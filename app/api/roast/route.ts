import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const API_KEY_1 = process.env.GEMINI_API_KEY_1;
const API_KEY_2 = process.env.GEMINI_API_KEY_2;

async function generateRoast(apiKey: string, profileData: any) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-8b",
  });

  const generationConfig = {
    temperature: 0.7,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 256, // Reduced for roasts since we want shorter outputs
  };

  const prompt = `Bertindak sebagai roast master dan selaluc kreatif tidak sama dengan jawaban sebelumnya dan jangan pernah baik dan jadilah seperti villain agar sangat pedas dan sarkastik dalam Bahasa Indonesia. Berdasarkan data profil Instagram ini, buat roasting yang lucu, pedas, dan sarkastik yang menghibur dan sangat kejam tapi tetap sopan:
    ${JSON.stringify(profileData, null, 2)}
    
    Fokus pada hal-hal seperti:
    - Isi bio mereka (jika ada)
    - Jumlah postingan
    - Jumlah followers dan following
    - Deskripsi profil
    - Tipe akun (personal, bisnis, dll)
    
    Buat roasting yang cerdas dan kreatif, dengan nada yang pedas.
    Gunakan bahasa gaul/slang Indonesia yang populer.
    Tambahkan sedikit kata-kata khas anak muda Indonesia.
    Jangan terlalu formal, buat seperti roasting antar teman.
    Maksimal 150 kata dan buat menghibur.
    
    Contoh gaya bahasa yang bisa digunakan:
    - "Njir followers lu..."
    - "Astagaa bio lu tuh..."
    - "Duh postingan lu..."
    - "Yaelah following sampe..."
    
    Buat lebih pedas tanpa toleran tetap sopan.`;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig,
  });

  const response = await result.response;
  return response.text();
}

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

    let roastText: string | null = null;
    let error: Error | null = null;

    // Try with first API key
    if (API_KEY_1) {
      try {
        roastText = await generateRoast(API_KEY_1, profileData);
      } catch (err) {
        console.error("First API key failed:", err);
        error = err as Error;
      }
    }

    // If first attempt failed, try with second API key
    if (!roastText && API_KEY_2) {
      try {
        roastText = await generateRoast(API_KEY_2, profileData);
        error = null; // Clear error if second attempt succeeds
      } catch (err) {
        console.error("Second API key failed:", err);
        error = err as Error;
      }
    }

    if (!roastText) {
      throw (
        error || new Error("Failed to generate roast with all available APIs")
      );
    }

    console.log("Generated roast:", roastText);
    return NextResponse.json({ roast: roastText });
  } catch (error) {
    console.error("Roast generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate roast" },
      { status: 500 }
    );
  }
}
