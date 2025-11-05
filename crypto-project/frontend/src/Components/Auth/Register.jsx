// src/Components/Auth/Register.jsx
import { useState } from "react";
import API from "../../api";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting registration form:", form);
      const res = await API.post("/auth/register", form);
      console.log("Registration successful:", res.data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setMsg("✅ Registered successfully!");
    } catch (err) {
      console.log("Registration error:", err);
      setMsg(err.response?.data?.message || "❌ Error occurred");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-xl border border-gray-700 p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        {/* Heading */}
        <h2 className="text-3xl font-extrabold text-center text-white mb-6 tracking-wide">
          Create Account
        </h2>

        {/* Username */}
        <input
          type="text"
          placeholder="👤 Username"
          className="w-full mb-4 px-4 py-3 bg-gray-900/70 text-white border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        {/* Email */}
        <input
          type="email"
          placeholder="📧 Email"
          className="w-full mb-4 px-4 py-3 bg-gray-900/70 text-white border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="🔑 Password"
          className="w-full mb-6 px-4 py-3 bg-gray-900/70 text-white border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {/* Button */}
        <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:opacity-90 transition-all duration-300">
          Register 🚀
        </button>

        {/* Message */}
        {msg && (
          <p
            className={`mt-4 text-center font-medium ${
              msg.includes("success") ? "text-green-400" : "text-red-400"
            }`}
          >
            {msg}
          </p>
        )}

        {/* Footer link */}
        <p className="mt-6 text-gray-400 text-sm text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:underline">
            Login here
          </a>
        </p>
      </form>
    </div>
  );
}
