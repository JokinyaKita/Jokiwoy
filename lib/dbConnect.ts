// lib/dbConnect.ts
import mongoose from "mongoose";

// JANGAN validasi di luar fungsi
export const dbConnect = async () => {
  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    throw new Error(
      "MONGO_URI tidak ditemukan di environment variables. Cek .env.local atau Vercel Environment Variables."
    );
  }

  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(MONGO_URI, {
      dbName: "jokinyakita",
    });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error; // biar ditangkap oleh try-catch pemanggil
  }
};

export default dbConnect;