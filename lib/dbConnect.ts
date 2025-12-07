// lib/dbConnect.ts
import mongoose from "mongoose";

export const dbConnect = async () => {
  // 🛑 JANGAN konek ke DB saat build (Vercel / Turbopack)
  if (process.env.NEXT_PHASE === "phase-production-build") {
    console.log("⏭️ Skipping DB connection during build phase");
    return;
  }

  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    throw new Error(
      "MONGO_URI tidak ditemukan di environment variables. Cek Vercel → Settings → Environment Variables."
    );
  }

  // Gunakan caching koneksi (best practice)
  if (mongoose.connection.readyState >= 1) {
    console.log("🔁 Using existing DB connection");
    return;
  }

  try {
    await mongoose.connect(MONGO_URI, {
      dbName: "jokinyakita",
      // opsional: tambahkan untuk stabilitas
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
};

export default dbConnect;