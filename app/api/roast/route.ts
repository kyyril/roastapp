import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const API_KEY_1 = process.env.GEMINI_API_KEY_1;
const API_KEY_2 = process.env.GEMINI_API_KEY_2;

async function generateRoast(apiKey: string, profileData: any) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-3.1-flash-lite",
  });

  const generationConfig = {
    temperature: 0.7,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 256, // Reduced for roasts since we want shorter outputs
  };

  const prompt = `Kamu adalah roast master yang ahli dalam membuat roasting yang jenaka, pedas namun tetap menghormati. Buatkan roasting berdasarkan data profil Instagram ini:
${JSON.stringify(profileData, null, 2)}

Aturan roasting:
1. Gunakan Bahasa Indonesia gaul/slang kekinian
2. FOKUS pada personality dan karakteristik personal dari profile picture, bio style, dan vibe mereka
3. Hal yang boleh di-roast:
   - Gaya penulisan bio yang unique (misalnya terlalu dramatic, terlalu polos, terlalu fancy)
   - Vibes dari foto profil mereka
   - Personality traits yang bisa ditebak dari cara mereka mengekspresikan diri
   - Sense of humor mereka (jika terlihat)
   - Style atau aesthetic pilihan mereka

4. JANGAN fokus pada:
   - Jumlah followers atau engagement metrics
   - Aktifitas posting mereka
   - Memberikan "saran" untuk lebih aktif
   - Nilai/judgement terhadap keputusan mereka di Instagram

Format output:
- hanya 1 paragraf 
- Panjang: Maksimal 125 kata
- Gaya: Jenaka, cerdas, dan penuh respect
- Nada: Seperti teman yang sedang roasting dengan niat baik
- Tujuan: Buat mereka tertawa, bukan merasa kurang respect
- PENTING: Jangan gunakan markdown, asterisk, emoji, atau formatting apapun
- Output HANYA plain text tanpa karakter khusus
- Hindari: Kata kasar/toxic, SARA, body shaming, bullying

Contoh tone roasting yang tepat:
- "Bio lu kayak filosofer 2am yang baru nemu arti hidup"
- "Foto profil pake filter sampai orangtua sendiri gak kenal"
- "Aesthetic lu tuh kayak instragram 2015 yang belum evolve"
- "Cara tulismu kek lagi ngomong ke crush tapi di-publish"

Yang harus dihindari TOTAL:
- Tidak boleh ada kata kasar/toxic
- Tidak menyinggung SARA
- Tidak body shaming
- Tidak membully
- Tidak mencuri respect mereka
- Tidak memberikan judgement negatif tentang pilihan hidup

Berikan roasting yang bikin mereka tersenyum dan terhibur. Keluarkan HANYA text roasting tanpa markdown atau formatting apapun.`;

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
