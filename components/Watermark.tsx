import { Flame } from "lucide-react";
import Image from "next/image";

export const Watermark = () => (
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
        <Image
          src={"/images/katou.jpeg"}
          alt="owner"
          className="rounded-full"
          width={20}
          height={20}
        />
        kyyril
      </a>
    </div>
  </div>
);
