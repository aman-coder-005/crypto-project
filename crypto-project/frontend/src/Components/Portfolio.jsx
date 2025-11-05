import { useEffect, useState } from "react";
import axios from "axios";

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [coin, setCoin] = useState("bitcoin");
  const [quantity, setQuantity] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [prices, setPrices] = useState({});
  const [totalInvestment, setTotalInvestment] = useState(0);

  const coinsList = [
    "bitcoin",
    "ethereum",
    "solana",
    "ripple",
    "litecoin",
    "cardano",
    "dogecoin",
    "polkadot",
  ];
  const userId = JSON.parse(localStorage.getItem("user")).id;

  useEffect(() => {
    fetchPrices();
    axios
      .get(`http://localhost:5000/api/portfolio/${userId}`)
      .then((res) => setPortfolio(res.data))
      .catch((err) => console.log("Load error:", err));
  }, []);

  useEffect(() => {
    const total = portfolio.reduce(
      (sum, coin) => sum + coin.buyPrice * coin.quantity,
      0
    );
    setTotalInvestment(total);
  }, [portfolio]);

  const fetchPrices = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/prices");
      setPrices(res.data);
    } catch (err) {
      console.error("Failed to fetch prices:", err.message);
    }
  };

  const handleAdd = async () => {
    if (!coin || !quantity || !buyPrice) return;

    const exists = portfolio.find((c) => c.id === coin);
    if (exists) {
      alert("Coin already in portfolio");
      return;
    }

    const newCoin = {
      id: coin,
      quantity: parseFloat(quantity),
      buyPrice: parseFloat(buyPrice),
    };

    const updatedPortfolio = [...portfolio, newCoin];

    try {
      await axios.post("http://localhost:5000/api/portfolio", {
        userId,
        coins: updatedPortfolio,
      });

      setPortfolio(updatedPortfolio);
      setQuantity("");
      setBuyPrice("");
    } catch (error) {
      console.error("Error saving portfolio:", error);
      alert("Failed to save portfolio to database");
    }
  };

  const getCurrentPrice = (coinId) => prices[coinId]?.inr || 0;

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">📊 My Portfolio</h2>

      {/* Form */}
      <div className="mb-6 grid md:grid-cols-4 gap-4 items-center">
        <select
          value={coin}
          onChange={(e) => setCoin(e.target.value)}
          className="p-2 border rounded"
        >
          {coinsList.map((c) => (
            <option key={c} value={c}>
              {c.toUpperCase()}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Buy Price (₹)"
          value={buyPrice}
          onChange={(e) => setBuyPrice(e.target.value)}
          className="p-2 border rounded"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          ➕ Add
        </button>
      </div>

      {/* Total Investment */}
      <p className="text-lg font-semibold mb-4 text-gray-700">
        Total Investment: <span className="text-blue-600">₹{totalInvestment.toFixed(2)}</span>
      </p>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full border-collapse">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-2 text-left">Coin</th>
              <th className="p-2 text-right">Quantity</th>
              <th className="p-2 text-right">Buy Price (₹)</th>
              <th className="p-2 text-right">Invested ₹</th>
              <th className="p-2 text-right">Current Price (₹)</th>
              <th className="p-2 text-right">Value ₹</th>
              <th className="p-2 text-right">P/L %</th>
              <th className="p-2 text-right">Portfolio %</th>
              <th className="p-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.map((coin) => {
              const invested = coin.buyPrice * coin.quantity;
              const currentPrice = getCurrentPrice(coin.id);
              const value = currentPrice * coin.quantity;
              const profitLossPercent = ((value - invested) / invested) * 100;
              const portfolioPercent = (invested / totalInvestment) * 100;

              return (
                <tr
                  key={coin.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-2 font-semibold">{coin.id.toUpperCase()}</td>
                  <td className="p-2 text-right">{coin.quantity}</td>
                  <td className="p-2 text-right">₹{coin.buyPrice}</td>
                  <td className="p-2 text-right">₹{invested.toFixed(2)}</td>
                  <td className="p-2 text-right">₹{currentPrice}</td>
                  <td className="p-2 text-right">₹{value.toFixed(2)}</td>
                  <td
                    className={`p-2 text-right font-semibold ${
                      profitLossPercent >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {profitLossPercent.toFixed(2)}%
                  </td>
                  <td
                    className={`p-2 text-right ${
                      portfolioPercent >= 50
                        ? "text-blue-600 font-semibold"
                        : "text-gray-600"
                    }`}
                  >
                    {portfolioPercent.toFixed(2)}%
                  </td>
                  <td className="p-2 text-right">
                    <button
                      onClick={() =>
                        setPortfolio((prev) =>
                          prev.filter((c) => c.id !== coin.id)
                        )
                      }
                      className="text-red-500 hover:text-red-700"
                    >
                      ❌
                    </button>
                  </td>
                </tr>
              );
            })}
            {portfolio.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center p-4 text-gray-500">
                  No coins in portfolio yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Portfolio;
