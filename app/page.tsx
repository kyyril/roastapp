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
import { toast } from "sonner";
import NextImage from "next/image";
import * as htmlToImage from "html-to-image";
import { cn } from "@/lib/utils";
import { ProfileSkeleton } from "@/components/Skeleton";

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

const Watermark = () => (
  <div className="mt-4 flex items-center justify-between text-black/50 text-sm border-t border-black/10 pt-4">
    <div className="flex items-center gap-1">
      <Flame size={16} className="text-orange-400" />
      <span className="font-balsamiq">INSTACOOK</span>
    </div>
    <div className="flex flex-row items-center gap-2 hover:opacity-50">
      <a
        href="https://github.com/kyyril"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-black/50 transition-colors flex items-center gap-1 font-balsamiq"
      >
        <NextImage
          src={"/images/katou.jpeg"}
          alt="owner"
          className="rounded-full"
          width={16}
          height={16}
        />
        kyyril
      </a>
    </div>
  </div>
);

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

  return (
    <div className="min-h-screen text-foreground relative p-4 sm:p-8">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>

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
          <h1 className="text-4xl font-balsamiq-bold sm:text-6xl font-black mb-2 sm:mb-4 text-primary animate-pulse">
            INSTACOOK🔥
          </h1>
          <p className="text-xl sm:text-2xl font-medium mb-2 ">
            Roasting pedas dijamin kena mental!💀
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
                className="retro-input pl-12 w-full"
              />
            </div>
            <Button
              onClick={handleRoast}
              disabled={loading}
              className="retro-button w-full sm:w-auto"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Roasting!"}
            </Button>
          </div>

          <div ref={resultRef}>
            {loading ? (
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
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                        {profileData.fullName}
                        {profileData.isVerified && (
                          <span className="text-blue-400">✓</span>
                        )}
                      </h2>
                      <p className="text-black/60">@{profileData.username}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                    <div className="bg-white/5 p-3 rounded-lg">
                      <Image className="w-5 h-5 mx-auto mb-1" />
                      <div className="text-lg font-bold">
                        {profileData.postsCount}
                      </div>
                      <div className="text-sm text-black/60">Post</div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg">
                      <Users className="w-5 h-5 mx-auto mb-1" />
                      <div className="text-lg font-bold">
                        {profileData.followersCount}
                      </div>
                      <div className="text-sm text-black/60">Followers</div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg">
                      <Link2 className="w-5 h-5 mx-auto mb-1" />
                      <div className="text-lg font-bold">
                        {profileData.followsCount}
                      </div>
                      <div className="text-sm text-black/60">Following</div>
                    </div>
                  </div>

                  {profileData.biography && (
                    <p className="text-black/50 whitespace-pre-line">
                      {profileData.biography}
                    </p>
                  )}
                </motion.div>
              )
            )}

            {loading ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card p-6 rounded-lg retro-border"
              >
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-4 bg-white/10 rounded animate-pulse",
                        i === 3 && "w-3/4"
                      )}
                    />
                  ))}
                </div>
              </motion.div>
            ) : (
              roast && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card p-6 rounded-lg retro-border"
                >
                  <p className="text-lg leading-relaxed whitespace-pre-line">
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
            </motion.div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
