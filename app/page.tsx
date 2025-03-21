"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Flame,
  Instagram,
  Loader2,
  Users,
  Image,
  Link2,
  Copy,
  Download,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import NextImage from "next/image";
import * as htmlToImage from "html-to-image";

interface ProfileData {
  username: string;
  fullName: string;
  biography: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  profilePicUrl: string;
  isPrivate: boolean;
  isVerified: boolean;
}

export default function Home() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [roast, setRoast] = useState("");
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleRoast = async () => {
    if (!username) {
      toast.error("Masukkan username Instagram dulu dong!");
      return;
    }

    setLoading(true);
    setRoast("");
    setProfileData(null);

    try {
      // Fetch Instagram data
      const scrapeResponse = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      if (!scrapeResponse.ok) {
        const error = await scrapeResponse.json();
        throw new Error(error.error || "Gagal mengambil data profil");
      }

      const data = await scrapeResponse.json();
      console.log("Profile data:", data);

      if (!data) {
        throw new Error("Profil tidak ditemukan");
      }

      setProfileData(data);

      // Generate roast
      const roastResponse = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileData: data }),
      });

      if (!roastResponse.ok) {
        const error = await roastResponse.json();
        throw new Error(error.error || "Gagal membuat roasting");
      }

      const { roast } = await roastResponse.json();

      if (!roast) {
        throw new Error("Roasting gagal dibuat");
      }

      // Save to dataset
      await fetch("/api/addToDataset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          roast,
          timestamp: new Date().toISOString(),
        }),
      });

      setRoast(roast);
      toast.success("Roasting berhasil dibuat!");
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error instanceof Error ? error.message : "Ada yang salah! Coba lagi ya."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = async () => {
    if (!roast) return;
    try {
      await navigator.clipboard.writeText(roast);
      toast.success("Roasting berhasil dicopy!");
    } catch (err) {
      toast.error("Gagal copy text");
    }
  };

  const handleDownloadImage = async () => {
    if (!resultRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(resultRef.current);
      const link = document.createElement("a");
      link.download = `roastgram-${username}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Gambar berhasil didownload!");
    } catch (err) {
      toast.error("Gagal download gambar");
    }
  };

  const handleShare = async () => {
    if (!resultRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(resultRef.current);
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "roastgram.png", { type: "image/png" });

      if (navigator.share) {
        await navigator.share({
          title: "Roasting Instagram Gue",
          text: roast,
          files: [file],
        });
        toast.success("Berhasil dibagikan!");
      } else {
        throw new Error("Fitur berbagi tidak didukung");
      }
    } catch (err) {
      toast.error("Gagal membagikan");
    }
  };

  return (
    <div className="min-h-screen text-foreground relative p-8">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-block bg-primary text-white p-4 rounded-lg retro-border mb-6"
          >
            <Flame size={48} />
          </motion.div>
          <h1 className="text-6xl font-black mb-4 font-mono text-primary animate-pulse">
            INSTACOOK🔥
          </h1>
          <p className="text-2xl font-medium mb-2">
            Roasting pedas dijamin kena mental!💀
          </p>
        </div>

        <Card className="retro-border bg-card p-8">
          <div className="flex gap-4 mb-8">
            <div className="relative flex-1">
              <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Masukkan username Instagram"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="retro-input pl-12"
              />
            </div>
            <Button
              onClick={handleRoast}
              disabled={loading}
              className="retro-button"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Roasting!"}
            </Button>
          </div>

          <div ref={resultRef}>
            {profileData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 bg-card p-6 rounded-lg retro-border"
              >
                <div className="flex items-center gap-6 mb-4">
                  {profileData.profilePicUrl && (
                    <div className="relative w-20 h-20 rounded-full border-2 border-white/20 overflow-hidden">
                      <NextImage
                        src={profileData.profilePicUrl}
                        alt={profileData.username}
                        fill
                        className="object-cover"
                        sizes="80px"
                        priority
                      />
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      {profileData.fullName}
                      {profileData.isVerified && (
                        <span className="text-blue-400">✓</span>
                      )}
                    </h2>
                    <p className="text-white/60">@{profileData.username}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                  <div className="bg-white/5 p-3 rounded-lg">
                    <Image className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-lg font-bold">
                      {profileData.postsCount}
                    </div>
                    <div className="text-sm text-white/60">Post</div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg">
                    <Users className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-lg font-bold">
                      {profileData.followersCount}
                    </div>
                    <div className="text-sm text-white/60">Followers</div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg">
                    <Link2 className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-lg font-bold">
                      {profileData.followingCount}
                    </div>
                    <div className="text-sm text-white/60">Following</div>
                  </div>
                </div>

                {profileData.biography && (
                  <p className="text-white/80 whitespace-pre-line">
                    {profileData.biography}
                  </p>
                )}
              </motion.div>
            )}

            {roast && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card p-6 rounded-lg retro-border"
              >
                <p className="text-lg leading-relaxed whitespace-pre-line">
                  {roast}
                </p>
              </motion.div>
            )}
          </div>

          {roast && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 flex gap-4 justify-end"
            >
              <Button
                onClick={handleCopyText}
                className="retro-button bg-secondary text-secondary-foreground"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button
                onClick={handleDownloadImage}
                className="retro-button bg-secondary text-secondary-foreground"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button
                onClick={handleShare}
                className="retro-button bg-secondary text-secondary-foreground"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </motion.div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
