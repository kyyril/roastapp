import { NextResponse } from "next/server";
import { ApifyClient } from "apify-client";

// Define InstagramProfile type if not already defined elsewhere
interface InstagramProfile {
  username: string;
  fullName: string;
  biography: string;
  profilePicUrl: string;
  postsCount: number;
  followersCount: number;
  followsCount: number;
  isPrivate: boolean;
  isVerified: boolean;
  recentPosts: {
    caption: string;
    likesCount: number;
    commentsCount: number;
    imageUrl: string;
  }[];
}

export async function POST(req: Request) {
  try {
    const { username } = await req.json();

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const client = new ApifyClient({
      token: process.env.APIFY_API_TOKEN || "",
    });

    // Prepare Actor input
    const input = {
      directUrls: [`https://www.instagram.com/${username}/`],
      resultsType: "details",
      resultsLimit: 1,
    };

    // Run the Actor and wait for it to finish
    const run = await client.actor("apify/instagram-scraper").call(input);

    // Fetch data from the run's dataset
    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const profileData: any = items[0];

    // Parse and format the profile data
    const profile: InstagramProfile = {
      username: profileData.username || username,
      fullName: profileData.fullName || "",
      biography: profileData.biography || "",
      profilePicUrl: formatImageUrl(profileData.profilePicUrl) || "",
      postsCount: profileData.postsCount || 0,
      followersCount: profileData.followersCount || 0,
      followsCount: profileData.followsCount || 0,
      isPrivate: profileData.isPrivate || false,
      isVerified: profileData.isVerified || false,
      recentPosts: (profileData.latestPosts || [])
        .slice(0, 5)
        .map((post: any) => ({
          caption: post.caption || "",
          likesCount: post.likesCount || 0,
          commentsCount: post.commentsCount || 0,
          imageUrl: formatImageUrl(post.imageUrl) || "",
        })),
    };

    // Check if profile is empty
    const isProfileEmpty =
      profile.postsCount === 0 &&
      profile.followersCount === 0 &&
      profile.followsCount === 0 &&
      !profile.fullName &&
      !profile.biography &&
      !profile.profilePicUrl;

    if (isProfileEmpty) {
      return NextResponse.json(
        { error: "Profile not found or invalid" },
        { status: 404 }
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Scrape error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Instagram data" },
      { status: 500 }
    );
  }
}

function formatImageUrl(url: string): string {
  if (!url) return "";

  if (!url.startsWith("http")) {
    return "";
  }

  return `/api/image-proxy?url=${encodeURIComponent(url)}`;
}
