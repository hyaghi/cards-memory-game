
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

type CardProps = {
  card: {
    id: number;
    icon: JSX.Element;
    matched: boolean;
    flipped: boolean;
  };
  handleChoice: () => void;
};

export const Card = ({ card, handleChoice }: CardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Simulate loading of the icon
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 50); // Short delay to simulate lazy loading
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative">
      <motion.div
        className={`cursor-pointer h-20 md:h-28 rounded-xl ${
          card.matched ? "opacity-70" : ""
        }`}
        onClick={handleChoice}
        initial={{ rotateY: 0 }}
        animate={{ rotateY: card.flipped ? 180 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Front of card (hidden when flipped) */}
        <div 
          className={`absolute w-full h-full rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center ${
            card.flipped ? "opacity-0" : "opacity-100"
          } transition-opacity duration-250 shadow-lg`}
        >
          <div className="text-white text-3xl font-bold">?</div>
        </div>
        
        {/* Back of card (shown when flipped) */}
        <div 
          className={`absolute w-full h-full rounded-xl bg-white flex items-center justify-center transform rotateY-180 ${
            card.flipped ? "opacity-100" : "opacity-0"
          } transition-opacity duration-250 shadow-md border-2 ${
            card.matched ? "border-green-500" : "border-gray-100"
          }`}
        >
          {isLoaded ? (
            <div className="text-indigo-800">
              {card.icon}
            </div>
          ) : (
            <div className="animate-pulse h-10 w-10 bg-indigo-100 rounded-full"></div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
