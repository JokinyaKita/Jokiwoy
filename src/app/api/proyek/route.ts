// lib/dbConnect.ts
import mongoose from "mongoose";

export const dbConnect = async () => {
  // 🛑 JANGAN koneksi DB saat build (Vercel / Turbopack)
  if (process.env.NEXT_PHASE === "phase-production-build") {
    console.log("⏭️ Skipping DB connection in build phase");
    return;
  }

  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    throw new Error("MONGO_URI tidak ditemukan");
  }

  if (mongoose.connection.readyState >= 1) return;

  await mongoose.connect(MONGO_URI, { dbName: "jokinyakita" });
  console.log("✅ DB connected");
};

export default dbConnect;