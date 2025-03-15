
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface TimerProps {
  isRunning: boolean;
  onTimeUpdate?: (time: number) => void;
}

export const Timer = ({ isRunning, onTimeUpdate }: TimerProps) => {
  const [seconds, setSeconds] = useState(0);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    let interval: number | null = null;
    
    if (isRunning) {
      interval = window.setInterval(() => {
        setSeconds(prevSeconds => {
          const newTime = prevSeconds + 1;
          if (onTimeUpdate) onTimeUpdate(newTime);
          return newTime;
        });
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, onTimeUpdate]);
  
  // Format time as mm:ss
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div>
      <h3 className="text-xs sm:text-sm font-medium text-gray-500">Time</h3>
      <p className="text-xl sm:text-2xl font-bold text-indigo-700">{formatTime(seconds)}</p>
    </div>
  );
};
