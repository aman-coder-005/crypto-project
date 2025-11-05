# 💰 CryptoStack  

A **MERN stack cryptocurrency tracking application** with live prices, historical charts, news feed, leaderboard, and authentication. Built using **React (Vite)**, **Tailwind CSS**, **Framer Motion**, and **Recharts**.  

---

## 🚀 Features  
- 📈 Real-time cryptocurrency price tracking  
- 📰 Integrated crypto news feed  
- 📊 Historical price charts with **Recharts**  
- 🏆 Leaderboard system  
- 🔐 Authentication (Login/Register with JWT)  
- 🎨 Modern UI with **Tailwind CSS** + **Framer Motion animations**  
- 🌙 Dark mode ready  

---

## 📂 Project Structure  

```bash
crypto-project/
│── backend/                # Express + MongoDB backend
│   ├── routes/             # API routes (auth, prices, market)
│   ├── models/             # MongoDB models
│   └── server.js           # Main server
│
│── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── App.jsx         # Main app file
│   │   ├── index.css       # Tailwind CSS entry
│   │   └── main.jsx        # React entry point
│   └── vite.config.js      # Vite configuration
│
│── README.md               # Project documentation
│── package.json            # Dependencies
