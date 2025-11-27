import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Flame({ className }: { className?: string }) {
  return (
    <div className={cn("relative w-12 h-16 flex justify-center items-end", className)}>
      {/* Outer Flame (Red) */}
      <motion.div
        className="absolute bottom-0 w-full h-full bg-red-600 rounded-[50%] rounded-t-none rounded-tl-[40%] rounded-tr-[40%]"
        style={{ 
          clipPath: "path('M12,0 C4,7 2,12 2,17 C2,22 6,24 12,24 C18,24 22,22 22,17 C22,12 20,7 12,0 Z')",
          originY: 1
        }}
        animate={{
          scaleY: [1, 1.1, 0.9, 1.05, 1],
          scaleX: [1, 0.95, 1.05, 0.98, 1],
          skewX: [0, 2, -2, 1, 0],
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
         <svg viewBox="0 0 24 24" className="w-full h-full text-red-600 fill-current drop-shadow-lg">
           <path d="M12 0C6 8 2 13 2 17.5C2 21.5 5.5 24 12 24C18.5 24 22 21.5 22 17.5C22 13 18 8 12 0Z" />
         </svg>
      </motion.div>

      {/* Middle Flame (Orange) */}
      <motion.div
        className="absolute bottom-1 w-3/4 h-3/4 z-10"
        animate={{
          scaleY: [1, 1.15, 0.9, 1.1, 1],
          skewX: [0, -3, 3, -1, 0],
        }}
        transition={{
          duration: 0.4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
         <svg viewBox="0 0 24 24" className="w-full h-full text-orange-500 fill-current">
           <path d="M12 3C7 9 4 13 4 17C4 20.5 7 23 12 23C17 23 20 20.5 20 17C20 13 17 9 12 3Z" />
         </svg>
      </motion.div>

      {/* Inner Flame (Yellow) */}
      <motion.div
        className="absolute bottom-2 w-1/2 h-1/2 z-20"
        animate={{
          scaleY: [1, 1.2, 0.8, 1.1, 1],
          x: [0, -1, 1, 0],
        }}
        transition={{
          duration: 0.2,
          repeat: Infinity,
          ease: "linear"
        }}
      >
         <svg viewBox="0 0 24 24" className="w-full h-full text-yellow-400 fill-current">
           <path d="M12 6C9 10 7 13 7 16C7 18.5 9 21 12 21C15 21 17 18.5 17 16C17 13 15 10 12 6Z" />
         </svg>
      </motion.div>
    </div>
  );
}
