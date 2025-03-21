import { motion } from "framer-motion";

export const ProfileSkeleton = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="mb-8 bg-card p-6 rounded-lg retro-border"
  >
    <div className="flex items-center gap-6 mb-4">
      <div className="w-20 h-20 rounded-full bg-white/10 animate-pulse" />
      <div className="space-y-2">
        <div className="h-8 w-48 bg-white/10 rounded animate-pulse" />
        <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
      </div>
    </div>
    <div className="grid grid-cols-3 gap-4 mb-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white/5 p-3 rounded-lg">
          <div className="w-5 h-5 mx-auto mb-1 bg-white/10 rounded animate-pulse" />
          <div className="h-6 w-16 mx-auto mb-1 bg-white/10 rounded animate-pulse" />
          <div className="h-4 w-20 mx-auto bg-white/10 rounded animate-pulse" />
        </div>
      ))}
    </div>
    <div className="space-y-2">
      <div className="h-4 w-full bg-white/10 rounded animate-pulse" />
      <div className="h-4 w-3/4 bg-white/10 rounded animate-pulse" />
    </div>
  </motion.div>
);
