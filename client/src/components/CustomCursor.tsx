import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 50, stiffness: 1000, mass: 0.1 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
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
        scale: isHovering ? 1.2 : 1,
        rotate: isHovering ? -15 : 0,
      }}
      transition={{
        scale: { duration: 0.2 },
        rotate: { duration: 0.2 },
      }}
    >
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}
      >
        {/* Pizza slice base - crust */}
        <path
          d="M18 2 L34 32 C34 34 32 35 30 34 L6 34 C4 35 2 34 2 32 L18 2Z"
          fill="#D4A574"
          stroke="#B8956E"
          strokeWidth="1"
        />
        
        {/* Pizza cheese/sauce layer */}
        <path
          d="M18 6 L30 30 L6 30 L18 6Z"
          fill="#FCD34D"
        />
        
        {/* Tomato sauce showing through */}
        <path
          d="M18 8 L28 28 L8 28 L18 8Z"
          fill="#EF4444"
          opacity="0.3"
        />
        
        {/* Pepperoni pieces */}
        <circle cx="15" cy="18" r="2.5" fill="#DC2626" />
        <circle cx="21" cy="20" r="2.5" fill="#DC2626" />
        <circle cx="18" cy="26" r="2.5" fill="#DC2626" />
        
        {/* Pepperoni darker centers */}
        <circle cx="15" cy="18" r="1.2" fill="#991B1B" />
        <circle cx="21" cy="20" r="1.2" fill="#991B1B" />
        <circle cx="18" cy="26" r="1.2" fill="#991B1B" />
        
        {/* Basil leaves */}
        <ellipse cx="12" cy="24" rx="1.5" ry="2" fill="#22C55E" transform="rotate(-30 12 24)" />
        <ellipse cx="24" cy="25" rx="1.5" ry="2" fill="#22C55E" transform="rotate(20 24 25)" />
        
        {/* Cheese bubbles/texture */}
        <circle cx="16" cy="14" r="1" fill="#FEF3C7" opacity="0.7" />
        <circle cx="20" cy="15" r="0.8" fill="#FEF3C7" opacity="0.7" />
        <circle cx="13" cy="22" r="0.8" fill="#FEF3C7" opacity="0.7" />
        <circle cx="23" cy="23" r="1" fill="#FEF3C7" opacity="0.7" />
        
        {/* Bite mark when hovering */}
        {isHovering && (
          <path
            d="M28 28 Q32 24 30 30 Q28 32 28 28"
            fill="#1a1a1a"
          />
        )}
        
        {/* Steam when hovering (hot pizza!) */}
        {isHovering && (
          <>
            <motion.path
              d="M10 4 Q8 1 10 -2"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.6"
              animate={{ y: [-2, -6], opacity: [0.6, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
            <motion.path
              d="M18 0 Q16 -3 18 -6"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.6"
              animate={{ y: [-2, -6], opacity: [0.6, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
            />
            <motion.path
              d="M26 4 Q24 1 26 -2"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.6"
              animate={{ y: [-2, -6], opacity: [0.6, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
            />
          </>
        )}
      </svg>
    </motion.div>
  );
}
