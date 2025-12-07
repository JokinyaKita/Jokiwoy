// src/app/api/proyek/route.ts
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "cloudinary";
import dbConnect from "../../../../lib/dbConnect";
import Proyek from "../../../../models/Proyek";
// ✅ Config Cloudinary di top-level — aman (hanya baca env)
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
}

export async function GET() {
  try {
    await dbConnect();
    const proyekList = await Proyek.find().lean(); // .lean() lebih ringan
    return NextResponse.json(
      { message: "Data proyek ditemukan", data: proyekList },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ GET /api/proyek error:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data proyek", error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const formData = await req.formData();
    const title = (formData.get("title")?.toString() || "").trim();
    const description = (formData.get("description")?.toString() || "").trim();
    const oldprice = formData.get("oldprice")?.toString() || "";
    const price = formData.get("price")?.toString() || "";
    const category = formData.get("category")?.toString() || "";

    // Parse technologies
    const technologiesRaw = formData.getAll("technologies");
    let technologies: string[] = technologiesRaw
      .map(item => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);

    if (technologies.length === 1) {
      try {
        technologies = JSON.parse(technologies[0]);
      } catch {
        technologies = technologies[0].split(",").map(t => t.trim()).filter(Boolean);
      }
    }

    // Upload ke Cloudinary
    let imageUrl = "";
    const image = formData.get("image") as File | null;

    if (image && image.size > 0) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResponse = await new Promise<CloudinaryResponse>((resolve, reject) => {
        cloudinary.v2.uploader.upload_stream(
          { folder: "proyek" },
          (error, result) => error ? reject(error) : resolve(result as CloudinaryResponse)
        ).end(buffer);
      });

      imageUrl = uploadResponse.secure_url;
    }

    // Simpan ke DB
    const proyekBaru = await Proyek.create({
      title,
      description,
      oldprice,
      price,
      category,
      technologies,
      image: imageUrl,
    });

    return NextResponse.json(
      { message: "Proyek berhasil disimpan", data: proyekBaru },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ POST /api/proyek error:", error);
    return NextResponse.json(
      { message: "Server error", error: (error as Error).message },
      { status: 500 }
    );
  }
}