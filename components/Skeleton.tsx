import { motion } from "framer-motion";
import { Image, Users, Link2 } from "lucide-react";

export const ProfileSkeleton = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="mb-8 bg-card p-4 sm:p-6 rounded-lg retro-border"
  >
    {/* Profile Header */}
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-4">
      {/* Profile Picture Skeleton */}
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-black/20 overflow-hidden">
        <div className="w-full h-full bg-black/10 animate-pulse" />
      </div>
      {/* Name and Username Skeleton */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="h-6 sm:h-8 w-36 sm:w-48 bg-black/10 rounded animate-pulse" />
          <div className="h-4 w-4 bg-blue-400/10 rounded animate-pulse" />
        </div>
        <div className="h-4 w-24 sm:w-32 bg-black/10 rounded animate-pulse" />
      </div>
    </div>

    {/* Stats Grid */}
    <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 text-center">
      {/* Posts */}
      <div className="bg-black/5 p-2 sm:p-3 rounded-lg">
        <Image className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 text-black/20" />
        <div className="h-5 sm:h-6 w-12 sm:w-16 mx-auto mb-1 bg-black/10 rounded animate-pulse" />
        <div className="h-3 sm:h-4 w-10 sm:w-12 mx-auto bg-black/10 rounded animate-pulse" />
      </div>
      {/* Followers */}
      <div className="bg-black/5 p-2 sm:p-3 rounded-lg">
        <Users className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 text-black/20" />
        <div className="h-5 sm:h-6 w-12 sm:w-16 mx-auto mb-1 bg-black/10 rounded animate-pulse" />
        <div className="h-3 sm:h-4 w-14 sm:w-16 mx-auto bg-black/10 rounded animate-pulse" />
      </div>
      {/* Following */}
      <div className="bg-black/5 p-2 sm:p-3 rounded-lg">
        <Link2 className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 text-black/20" />
        <div className="h-5 sm:h-6 w-12 sm:w-16 mx-auto mb-1 bg-black/10 rounded animate-pulse" />
        <div className="h-3 sm:h-4 w-14 sm:w-16 mx-auto bg-black/10 rounded animate-pulse" />
      </div>
    </div>

    {/* Biography Skeleton */}
    <div className="space-y-2">
      <div className="h-3 sm:h-4 w-full bg-black/10 rounded animate-pulse" />
      <div className="h-3 sm:h-4 w-3/4 bg-black/10 rounded animate-pulse" />
    </div>
  </motion.div>
);

export const RoastingSkeleton = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-card p-6 rounded-lg retro-border"
  >
    {/* Text content skeleton */}
    <div className="space-y-3">
      <div className="h-4 w-full bg-black/10 rounded animate-pulse" />
      <div className="h-4 w-5/6 bg-black/10 rounded animate-pulse" />
      <div className="h-4 w-4/6 bg-black/10 rounded animate-pulse" />
    </div>

    {/* Watermark skeleton */}
    <div className="mt-4 h-6 w-32 bg-black/10 rounded animate-pulse" />
  </motion.div>
);
