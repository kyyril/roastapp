"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Flame,
  Loader2,
  Users,
  Image,
  Link2,
  Copy,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import NextImage from "next/image";
import * as htmlToImage from "html-to-image";
import { cn } from "@/lib/utils";
import { ProfileSkeleton, RoastingSkeleton } from "@/components/Skeleton";
import { Watermark } from "@/components/Watermark";
import toast from "react-hot-toast";

interface ProfileData {
  username: string;
  fullName: string;
  biography: string;
  followersCount: number;
  followsCount: number;
  postsCount: number;
  profilePicUrl: string;
  isPrivate: boolean;
  isVerified: boolean;
}

export default function Home() {
  const [username, setUsername] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingRoast, setLoadingRoast] = useState(false);
  const [roast, setRoast] = useState("");
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleRoast = async () => {
    if (!username) {
      toast.error("Masukkan username Instagram dulu dong!");
      return;
    }

    setLoadingProfile(true);
    setLoadingRoast(false);
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
      setLoadingProfile(false);

      // Start loading roast
      setLoadingRoast(true);

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
      setLoadingProfile(false);
      setLoadingRoast(false);
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

  return (
    <div className="min-h-screen text-foreground relative p-4 sm:p-8">
      <div className="absolute inset-0 -z-10 h-full w-full  bg-[radial-gradient(#707070_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <div className="text-center mb-8 sm:mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-block bg-primary text-white p-3 sm:p-4 rounded-lg retro-border mb-4 sm:mb-6"
          >
            <Flame size={32} className="sm:w-12 sm:h-12" />
          </motion.div>
          <h1 className="text-4xl font-balsamiq sm:text-6xl font-black mb-2 sm:mb-4 text-primary ">
            INSTACOOK<span className="animate-pulse">🔥</span>
          </h1>
          <p className="text-xl sm:text-2xl font-medium mb-2 font-balsamiq ">
            Roasting akun instagram dijamin kena mental!💀
          </p>
        </div>

        <Card className="retro-border bg-card p-4 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Masukkan username Instagram"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="retro-input pl-12 w-full font-balsamiq"
              />
            </div>
            <Button
              onClick={handleRoast}
              disabled={loadingProfile || loadingRoast}
              className="retro-button w-full sm:w-auto font-balsamiq"
            >
              {loadingProfile ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Roasting!"
              )}
            </Button>
          </div>

          <div ref={resultRef}>
            {loadingProfile ? (
              <ProfileSkeleton />
            ) : (
              profileData && (
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
                      <h2 className="text-2xl font-bold flex items-center gap-2 font-balsamiq">
                        {profileData.fullName}
                        {profileData.isVerified && (
                          <span className="text-blue-400">✓</span>
                        )}
                      </h2>
                      <p className="text-black/60 font-balsamiq">
                        @{profileData.username}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                    <div className="bg-white/5 p-3 rounded-lg">
                      <Image className="w-5 h-5 mx-auto mb-1" />
                      <div className="text-lg font-bold font-balsamiq">
                        {profileData.postsCount}
                      </div>
                      <div className="text-sm text-black/60 font-balsamiq">
                        Post
                      </div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg">
                      <Users className="w-5 h-5 mx-auto mb-1" />
                      <div className="text-lg font-bold font-balsamiq">
                        {profileData.followersCount}
                      </div>
                      <div className="text-sm text-black/60 font-balsamiq">
                        Followers
                      </div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg">
                      <Link2 className="w-5 h-5 mx-auto mb-1" />
                      <div className="text-lg font-bold font-balsamiq">
                        {profileData.followsCount}
                      </div>
                      <div className="text-sm text-black/60">Following</div>
                    </div>
                  </div>

                  {profileData.biography && (
                    <p className="text-black/50 whitespace-pre-line font-balsamiq">
                      {profileData.biography}
                    </p>
                  )}
                </motion.div>
              )
            )}

            {loadingRoast ? (
              <RoastingSkeleton />
            ) : (
              roast && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card p-6 rounded-lg retro-border"
                >
                  <p className="text-lg leading-relaxed whitespace-pre-line font-balsamiq">
                    {roast}
                  </p>
                  <Watermark />
                </motion.div>
              )
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
                className="retro-button bg-secondary text-secondary-foreground font-balsamiq"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button
                onClick={handleDownloadImage}
                className="retro-button bg-secondary text-secondary-foreground font-balsamiq"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </motion.div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
