import { Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useSiteContent } from "@/hooks/useSiteContent";

export default function WorkingHoursStatus() {
  const siteContent = useSiteContent();
  const [isOpen, setIsOpen] = useState(false);
  const [nextOpenTime, setNextOpenTime] = useState("");

  useEffect(() => {
    const checkOpenStatus = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const currentTime = hours * 60 + minutes;
      
      const openTime = 10 * 60;
      const closeTime = 23 * 60;
      
      const open = currentTime >= openTime && currentTime < closeTime;
      setIsOpen(open);
      
      if (!open) {
        if (currentTime < openTime) {
          setNextOpenTime("danas u 10:00");
        } else {
          setNextOpenTime("sutra u 10:00");
        }
      }
    };

    checkOpenStatus();
    const interval = setInterval(checkOpenStatus, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20">
      <Clock className="w-4 h-4 text-white" />
      <span className="text-white font-medium text-sm">
        {isOpen ? (
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Trenutno OTVORENO
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full" />
            Zatvoreno · Otvaramo {nextOpenTime}
          </span>
        )}
      </span>
    </div>
  );
}
