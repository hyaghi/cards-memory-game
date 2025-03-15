
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

  // Card flip animation variants
  const flipVariants = {
    front: {
      rotateY: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    },
    back: {
      rotateY: 180,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  // Matched animation variants
  const matchedVariants = {
    initial: { scale: 1 },
    matched: {
      scale: [1, 1.1, 1],
      transition: { duration: 0.5, ease: "easeInOut" }
    }
  };

  return (
    <div className="relative perspective-500">
      <motion.div
        className={`cursor-pointer h-20 md:h-28 rounded-xl preserve-3d ${
          card.matched ? "opacity-80" : ""
        }`}
        onClick={handleChoice}
        initial="front"
        animate={card.flipped ? "back" : "front"}
        variants={flipVariants}
        whileHover={{ scale: card.flipped ? 1 : 1.05 }}
        {...(card.matched && {
          initial: "initial",
          animate: "matched",
          variants: matchedVariants
        })}
      >
        {/* Front of card (hidden when flipped) */}
        <motion.div 
          className="absolute w-full h-full rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center backface-hidden shadow-lg"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="text-white text-3xl font-bold">?</div>
        </motion.div>
        
        {/* Back of card (shown when flipped) */}
        <motion.div 
          className={`absolute w-full h-full rounded-xl bg-white flex items-center justify-center backface-hidden shadow-md border-2 transform rotateY-180 ${
            card.matched ? "border-green-500" : "border-gray-100"
          }`}
          style={{ 
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)"
          }}
        >
          {isLoaded ? (
            <div className="text-indigo-800">
              {card.icon}
            </div>
          ) : (
            <div className="animate-pulse h-10 w-10 bg-indigo-100 rounded-full"></div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};
