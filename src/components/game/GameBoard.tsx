
import { useState, useEffect, useMemo } from "react";
import { Card } from "./Card";
import { Lightbulb, Brain, Target, Key, Star, Lock, Search, Puzzle, Zap, Eye } from "lucide-react";
import { toast } from "sonner";

interface GameBoardProps {
  difficulty: "easy" | "medium" | "hard";
  incrementScore: () => void;
  incrementTurns: () => void;
  endGame: () => void;
  onGameComplete: () => void;
}

type CardType = {
  id: number;
  icon: JSX.Element;
  matched: boolean;
  flipped: boolean;
  type: string;
};

export const GameBoard = ({ 
  difficulty, 
  incrementScore, 
  incrementTurns, 
  endGame,
  onGameComplete 
}: GameBoardProps) => {
  const [cards, setCards] = useState<CardType[]>([]);
  const [firstChoice, setFirstChoice] = useState<CardType | null>(null);
  const [secondChoice, setSecondChoice] = useState<CardType | null>(null);
  const [disabled, setDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Define card pairs based on difficulty
  const getCardCount = () => {
    switch (difficulty) {
      case "easy": return 6; // 12 cards = 6 pairs
      case "medium": return 8; // 16 cards = 8 pairs
      case "hard": return 10; // 20 cards = 10 pairs
      default: return 6;
    }
  };
  
  // Memoize the icons to prevent unnecessary re-renders
  const icons = useMemo(() => [
    { element: <Lightbulb className="h-10 w-10" />, type: "lightbulb" },
    { element: <Brain className="h-10 w-10" />, type: "brain" },
    { element: <Target className="h-10 w-10" />, type: "target" },
    { element: <Key className="h-10 w-10" />, type: "key" },
    { element: <Star className="h-10 w-10" />, type: "star" },
    { element: <Lock className="h-10 w-10" />, type: "lock" },
    { element: <Search className="h-10 w-10" />, type: "search" },
    { element: <Puzzle className="h-10 w-10" />, type: "puzzle" },
    { element: <Zap className="h-10 w-10" />, type: "zap" },
    { element: <Eye className="h-10 w-10" />, type: "eye" },
  ], []);

  // Create and shuffle the cards
  useEffect(() => {
    const createCards = () => {
      setIsLoading(true);
      
      const cardCount = getCardCount();
      // Get required number of icons
      const selectedIcons = [...icons].slice(0, cardCount);
      
      // Create pairs and assign properties
      const cardPairs = [...selectedIcons, ...selectedIcons].map((icon, index) => ({
        id: index,
        icon: icon.element,
        matched: false,
        flipped: false,
        type: icon.type,
      }));
      
      // Shuffle
      return cardPairs.sort(() => Math.random() - 0.5);
    };
    
    // Use setTimeout to prevent UI freezing during card creation
    setTimeout(() => {
      setCards(createCards());
      setFirstChoice(null);
      setSecondChoice(null);
      setIsLoading(false);
    }, 100);
  }, [difficulty, icons]);
  
  // Check if all cards are matched to end the game
  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.matched)) {
      setTimeout(() => {
        toast.success("Congratulations! You've matched all cards!");
        onGameComplete();
      }, 1000);
    }
  }, [cards, onGameComplete]);
  
  // Logic to check for a match
  useEffect(() => {
    if (firstChoice && secondChoice) {
      setDisabled(true);
      incrementTurns();
      
      if (firstChoice.type === secondChoice.type) {
        // It's a match!
        setCards(prevCards => {
          return prevCards.map(card => {
            if (card.type === firstChoice.type) {
              return { ...card, matched: true };
            } else {
              return card;
            }
          });
        });
        incrementScore();
        resetTurn();
        toast.success("Match found!");
      } else {
        // No match, flip cards back
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [firstChoice, secondChoice, incrementScore, incrementTurns]);
  
  // Handle card selection
  const handleChoice = (card: CardType) => {
    if (!disabled && !card.flipped) {
      // Flip the selected card
      setCards(prevCards => 
        prevCards.map(c => 
          c.id === card.id ? { ...c, flipped: true } : c
        )
      );
      
      // Set first or second choice
      firstChoice ? setSecondChoice(card) : setFirstChoice(card);
    }
  };
  
  // Reset choices and enable the board
  const resetTurn = () => {
    setFirstChoice(null);
    setSecondChoice(null);
    setDisabled(false);
    
    // Reset card flips for non-matched cards
    setCards(prevCards => 
      prevCards.map(card => {
        if (!card.matched && card.flipped) {
          return { ...card, flipped: false };
        }
        return card;
      })
    );
  };
  
  // Calculate grid layout based on difficulty
  const getGridClass = () => {
    switch (difficulty) {
      case "easy": return "grid-cols-4";
      case "medium": return "grid-cols-4";
      case "hard": return "grid-cols-5";
      default: return "grid-cols-4";
    }
  };
  
  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto flex justify-center items-center h-60">
        <div className="text-indigo-600 text-lg">Loading cards...</div>
      </div>
    );
  }
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className={`grid ${getGridClass()} gap-4 md:gap-6`}>
        {cards.map(card => (
          <Card 
            key={card.id}
            card={card}
            handleChoice={() => handleChoice(card)}
          />
        ))}
      </div>
    </div>
  );
};
