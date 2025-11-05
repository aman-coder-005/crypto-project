import News from "./Components/News";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Portfolio from "./Components/Portfolio";
import Leaderboard from "./Components/Leaderboard";
import Register from "./Components/Auth/Register";
import Login from "./Components/Auth/Login";

const socket = io("http://localhost:5000"); // replace with your backend URL

export default function App() {
  const [coins, setCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState("bitcoin");
  const [prices, setPrices] = useState([]);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [activePage, setActivePage] = useState("dashboard");
  const inputRef = useRef(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  // Fetch coins on first load
  useEffect(() => {
    fetchCoins();
    console.log("User data:", user);
  }, []);

  // Join room and fetch price when selectedCoin changes
  useEffect(() => {
    setChat([]);
    const fetchChat = async () => {
      const res3 = await axios.get(
        `http://localhost:5000/api/chat/${selectedCoin}`
      );
      setChat(res3.data);
    };
    fetchChat();
    fetchPriceHistory(selectedCoin);
    socket.emit("joinRoom", selectedCoin);
  }, [selectedCoin]);

  // Set up socket listener ONCE
  useEffect(() => {
    const handleMessage = (msg) => {
      setChat((prev) => [...prev, msg]);
    };
    socket.on("receiveMessage", handleMessage);
    return () => {
      socket.off("receiveMessage", handleMessage);
    };
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data } = await axios.get("http://localhost:5000/api/leaderboard");
      setLeaderboard(data);
    };
    fetchLeaderboard();
  }, []);

  const fetchCoins = async () => {
    const { data } = await axios.get("http://localhost:5000/api/market/coins");
    setCoins(data.slice(0, 50));
  };

  const fetchPriceHistory = async (coin) => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/market/price-history/${coin}`
      );

      if (!Array.isArray(data)) {
        console.error("Unexpected data format:", data);
        return;
      }

      const formatted = data.map((item) => ({
        time: item.time,
        price: item.price,
      }));

      setPrices(formatted);
    } catch (error) {
      console.error("Error fetching price history:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const res = await axios.post("http://localhost:5000/api/chat", {
      room: selectedCoin,
      message: message,
      user: user.id,
    });

    setMessage("");
    const fetchChat = async () => {
      const res3 = await axios.get(
        `http://localhost:5000/api/chat/${selectedCoin}`
      );
      setChat(res3.data);
    };
    fetchChat();
    socket.emit("sendMessage", res.data);
    inputRef.current?.focus();
  };

  const DashboardPage = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded-xl shadow-lg">
        <label className="block font-semibold mb-2">Select Coin</label>
        <select
          value={selectedCoin}
          onChange={(e) => setSelectedCoin(e.target.value)}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
        >
          {coins.map((coin) => (
            <option key={coin.id} value={coin.id}>
              {coin.name}
            </option>
          ))}
        </select>

        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Price History (7 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={prices}>
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#3b82f6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-lg flex flex-col">
        <h2 className="text-xl font-semibold mb-2">
          Live Chat - #{selectedCoin}
        </h2>
        <div className="border h-64 overflow-y-auto p-2 rounded bg-gray-50 mb-2 space-y-2">
          {chat.map((msg, i) => (
            <div
              key={i}
              className={`p-2 rounded-lg text-sm ${
                msg.user.username === user?.username
                  ? "bg-blue-500 text-white self-end"
                  : "bg-gray-200"
              }`}
            >
              <strong>{msg.user.username}:</strong> {msg.message}
            </div>
          ))}
        </div>
        <div className="flex mt-auto">
          <input
            ref={inputRef}
            type="text"
            className="flex-1 p-2 border rounded-l-lg outline-none focus:ring-2 focus:ring-blue-400"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 text-white px-4 rounded-r-lg hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );

  const PortfolioPage = () => (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">My Portfolio</h2>
      <Portfolio />
    </div>
  );

  const NewsPage = () => (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Crypto News</h2>
      <News />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 p-6">
      <header className="sticky top-0 bg-white shadow-md rounded-xl px-6 py-4 flex justify-between items-center mb-6 z-10">
        <h1 className="text-3xl font-bold text-blue-600">CryptoStack</h1>
        <h3 className="text-sm text-gray-600">
          logged in as <span className="font-semibold">{user?.username}</span>
        </h3>
        <nav className="space-x-2">
          {[
            "dashboard",
            "portfolio",
            "leaderboard",
            "news",
            "login",
            "register",
          ].map((page) => (
            <button
              key={page}
              onClick={() => setActivePage(page)}
              className={`px-3 py-1 rounded-full font-medium transition ${
                activePage === page
                  ? "bg-blue-600 text-white shadow-md"
                  : "hover:bg-blue-100 text-gray-700"
              }`}
            >
              {page.charAt(0).toUpperCase() + page.slice(1)}
            </button>
          ))}
        </nav>
      </header>

      {activePage === "dashboard" && <DashboardPage />}
      {activePage === "portfolio" && <PortfolioPage />}
      {activePage === "leaderboard" && (
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <Leaderboard data={leaderboard} />
        </div>
      )}
      {activePage === "news" && <NewsPage />}
      {activePage === "login" && (
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <Login />
        </div>
      )}
      {activePage === "register" && (
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <Register />
        </div>
      )}
    </div>
  );
}
