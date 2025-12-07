import { NextRequest, NextResponse } from "next/server";
import Order from "../../../../models/Order";
import dbConnect from "../../../../lib/dbConnect";

// ❌ HAPUS baris ini:
// await dbConnect();  ← JANGAN pernah panggil di luar fungsi!

export async function GET() {
  try {
    await dbConnect(); // ✅ Panggil DI DALAM handler
    const orders = await Order.find().sort({ createdAt: -1 });
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Error di GET /api/order:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data order" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect(); // ✅ Di sini juga

    const { service, details, deadline, whatsapp, status, price } = await req.json();

    if (!service || !details || !deadline || !whatsapp) {
      return NextResponse.json(
        { error: "Semua bidang wajib diisi" },
        { status: 400 }
      );
    }

    const newOrder = new Order({
      service,
      details,
      deadline,
      whatsapp,
      status: status || "process",
      price: price || "-",
    });

    await newOrder.save();

    return NextResponse.json(
      { message: "Pesanan berhasil disimpan", order: newOrder },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error di POST /api/order:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menyimpan data" },
      { status: 500 }
    );
  }
}