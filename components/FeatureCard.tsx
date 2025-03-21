import { Zap, Flame, Cpu } from "lucide-react";
import { motion } from "framer-motion";

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  delay,
}: {
  icon: any;
  title: string;
  description: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-card p-6 rounded-lg retro-border text-center"
  >
    <div className="inline-block bg-primary/10 p-3 rounded-lg mb-4">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <h3 className="text-xl font-bold mb-2 font-balsamiq">{title}</h3>
    <p className="text-black/60 font-balsamiq">{description}</p>
  </motion.div>
);

export const FeatureCards = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
    <FeatureCard
      icon={Cpu}
      title="AI Cooked"
      description="Dibuat dengan teknologi Artipisial intelejen"
      delay={0.3}
    />
    <FeatureCard
      icon={Zap}
      title="Super Cepat"
      description="Roasting langsung jadi, gak pake lama!"
      delay={0.1}
    />
    <FeatureCard
      icon={Flame}
      title="Roast Pedas"
      description="Dibuat untuk membuat mental terbakar hingga gosong"
      delay={0.2}
    />
  </div>
);
