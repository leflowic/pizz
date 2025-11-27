import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

export default function CustomCursor() {
  // Use MotionValues to bypass React render cycle for high performance
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Extremely tight spring physics for minimal latency but smooth movement
  const springConfig = { damping: 50, stiffness: 1000, mass: 0.1 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16); // Center the 32px cursor
      cursorY.set(e.clientY - 16);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "BUTTON" || target.tagName === "A" || target.closest("button") || target.closest("a")) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none hidden md:block will-change-transform"
      style={{
        x: springX,
        y: springY,
      }}
      animate={{
        scale: isHovering ? 1.5 : 1,
      }}
      transition={{
        scale: { duration: 0.2 }
      }}
    >
      <div className={cn(
        "w-8 h-8 border-2 rounded-full flex items-center justify-center transition-colors duration-200",
        isHovering ? "border-primary bg-primary/20" : "border-white/50"
      )}>
        <div className={cn(
          "w-1 h-1 bg-white rounded-full",
          isHovering ? "bg-primary" : "bg-white"
        )} />
        
        {/* Crosshair lines */}
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-current opacity-50" />
        <div className="absolute left-1/2 top-0 h-full w-[1px] bg-current opacity-50" />

        {/* Rotating element when hovering */}
        {isHovering && (
          <motion.div 
            className="absolute inset-0 border-t-2 border-primary rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        )}
      </div>
    </motion.div>
  );
}
