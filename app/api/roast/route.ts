import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const API_KEY_1 = process.env.GEMINI_API_KEY_1;
const API_KEY_2 = process.env.GEMINI_API_KEY_2;

async function generateRoast(apiKey: string, profileData: any) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });

  const generationConfig = {
    temperature: 0.7,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 256, // Reduced for roasts since we want shorter outputs
  };

  const prompt = `Kamu adalah roast master yang ahli dalam membuat roasting yang pedas namun tetap sopan. Buatkan roasting berdasarkan data profil Instagram ini:
${JSON.stringify(profileData, null, 2)}

Aturan roasting:
1. Gunakan Bahasa Indonesia gaul/slang kekinian
2. Fokus pada analisis dan kritik terhadap:
   - Jumlah followers vs following ratio
   - Kualitas & kuantitas postingan
   - Gaya penulisan bio
   - Pemilihan foto profil
   - Keaktifan akun

Format output:
- hanya 1 paragraf 
- Panjang: Maksimal 125 kata
- Gaya: Sarkastik tapi cerdas
- Nada: Seperti teman yang sedang roasting
- Hindari: Kata kasar, SARA, atau bullying

Contoh tone roasting:
- "Aduhay, followers segitu doang udah verified?"
- "Bio lu kek anak Twitter 2014 anjir"
- "Matematika gampang: following > followers = desperate"
- "Postingan dikit banget, kuota abis apa gimana?"

Yang harus dihindari:
- Tidak boleh ada kata kasar/toxic
- Tidak menyinggung SARA
- Tidak body shaming
- Tidak membully

Berikan roasting yang tajam, jenaka, dan menghibur namun tetap dalam batas sopan.`;

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
