// src/Components/Auth/Login.jsx
import { useState } from "react";
import API from "../../api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting login form:", form);
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.location.href = "/"; // Redirect
    } catch (err) {
      setMsg(err.response?.data?.message || "Error occurred");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      <div className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-2xl p-8 w-full max-w-md border border-white/20">
        <h2 className="text-3xl font-bold text-center text-white mb-6 tracking-wide">
          Welcome Back 👋
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="email"
              placeholder="Email Address"
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/30 transition"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/30 transition"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg shadow-lg transform hover:scale-[1.02] transition duration-300"
          >
            Login
          </button>
          {msg && (
            <p className="mt-2 text-center text-sm text-red-400 font-medium">
              {msg}
            </p>
          )}
        </form>
        <p className="mt-6 text-gray-300 text-center text-sm">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-blue-400 hover:underline hover:text-blue-300"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
