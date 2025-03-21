import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey!);

export async function POST(req: Request) {
  try {
    const { profileData } = await req.json();

    if (!profileData) {
      return NextResponse.json(
        { error: "Profile data is required" },
        { status: 400 }
      );
    }

    console.log(
      "Generating roast for profile:",
      JSON.stringify(profileData, null, 2)
    );

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
    });

    const prompt = `Bertindak sebagai roast master yang sangat pedas dan sarkastik dalam Bahasa Indonesia. Berdasarkan data profil Instagram ini, buat roasting yang lucu, pedas, dan sarkastik yang menghibur tapi tidak terlalu kejam:
    ${JSON.stringify(profileData, null, 2)}
    
    Fokus pada hal-hal seperti:
    - Isi bio mereka (jika ada)
    - Jumlah postingan
    - Jumlah followers dan following
    - Deskripsi profil
    - Tipe akun (personal, bisnis, dll)
    
    Buat roasting yang cerdas dan kreatif, dengan nada yang pedas tapi tetap lucu.
    Gunakan bahasa gaul/slang Indonesia yang populer.
    Tambahkan sedikit kata-kata khas anak muda Indonesia.
    Jangan terlalu formal, buat seperti roasting antar teman.
    Maksimal 150 kata dan buat menghibur.
    
    Contoh gaya bahasa yang bisa digunakan:
    - "Njir followers lu..."
    - "Astagaa bio lu tuh..."
    - "Duh postingan lu..."
    - "Yaelah following sampe..."
    
    Buat lebih pedas tanpa toleran.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("Generated roast:", text);

    return NextResponse.json({ roast: text });
  } catch (error) {
    console.error("Roast generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate roast" },
      { status: 500 }
    );
  }
}
