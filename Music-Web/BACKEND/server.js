// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import connectDB from "./config/db.js";
// import authRoutes from "./routes/authRoutes.js";
// import songRoutes from "./routes/songRoutes.js";
// import uploadRoutes from "./routes/uploadRoutes.js";

// dotenv.config();
// connectDB();

// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use("/api/auth", authRoutes);
// app.use("/uploads", express.static("uploads"));

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/songs", songRoutes);
// app.use("/api/uploads", uploadRoutes);

// app.get("/", (req, res) => {
//   res.send("🎵 Music Web App Backend Running Successfully!");
// });

// // Global error handler
// app.use((err, req, res, next) => {
//   console.error("Error:", err);
//   res.status(500).json({ message: "Internal Server Error", error: err.message });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import songRoutes from "./routes/songRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: ["https://voxblend-music-app.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// ✅ Needed for serving static files correctly with ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve uploaded files (uploaded songs)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Serve frontend songs folder (FRONTEND is a sibling of BACKEND)
app.use("/songs", express.static(path.join(__dirname, "../FRONTEND/songs")));

// ✅ Serve the entire frontend as static files
app.use(express.static(path.join(__dirname, "../FRONTEND")));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/uploads", uploadRoutes);

// ✅ Root route check
app.get("/", (req, res) => {
  res.send("🎵 Music Web App Backend Running Successfully!");
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    message: "Internal Server Error",
    error: err.message,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
