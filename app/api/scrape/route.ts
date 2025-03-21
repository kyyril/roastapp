import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { username } = await req.json();

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    console.log("Fetching data for username:", username);

    const response = await fetch(
      `https://api.apify.com/v2/actor-tasks/kyyril~all-scrap/run-sync-get-dataset-items`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.APIFY_API_TOKEN}`,
        },
        body: JSON.stringify({
          username,
          searchType: "user",
          searchLimit: 1,
        }),
      }
    );

    if (!response.ok) {
      console.error("Apify API error:", response.status, await response.text());
      throw new Error(`Apify API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Scraped data:", JSON.stringify(data, null, 2));

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "No profile data found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data[0]); // Return first profile found
  } catch (error) {
    console.error("Scrape error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Instagram data" },
      { status: 500 }
    );
  }
}
