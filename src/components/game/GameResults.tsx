
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Clock, RotateCw, Star, Award, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { saveHighScore, getHighScores, HighScore } from "@/utils/highScores";

interface GameResultsProps {
  score: number;
  turns: number;
  gameTime: number;
  difficulty: "easy" | "medium" | "hard";
  maxPairs: number;
  onPlayAgain: () => void;
  onMainMenu: () => void;
}

export const GameResults = ({ 
  score, 
  turns, 
  gameTime, 
  difficulty, 
  maxPairs,
  onPlayAgain,
  onMainMenu
}: GameResultsProps) => {
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  
  // Format time as mm:ss
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    // Check if this is a new high score
    const scores = getHighScores(difficulty);
    setHighScores(scores);
    
    // Calculate the score value (lower is better)
    // Formula: turns + (seconds * 0.5) - smaller is better
    const scoreValue = turns + (gameTime * 0.5);
    
    if (score === maxPairs) { // Only save if all pairs were found
      const isNewRecord = saveHighScore(difficulty, {
        turns,
        time: gameTime,
        score: maxPairs,
        scoreValue,
        date: new Date().toISOString()
      });
      
      if (isNewRecord) {
        setIsNewHighScore(true);
        toast.success("New high score achieved!");
      }
    }
  }, [score, turns, gameTime, difficulty, maxPairs]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 p-4"
    >
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-center text-2xl font-bold text-indigo-900">
            Game Complete!
          </CardTitle>
          {isNewHighScore && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center"
            >
              <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 mt-2">
                <Trophy className="h-4 w-4" /> New High Score!
              </div>
            </motion.div>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex justify-center mb-2">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 1.5, delay: 0.2 }}
            >
              <Sparkles className="h-16 w-16 text-amber-500" />
            </motion.div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-indigo-50 p-3 rounded-lg">
              <div className="text-indigo-600 mb-1"><Award className="h-5 w-5 mx-auto" /></div>
              <div className="text-sm text-gray-500">Score</div>
              <div className="font-bold text-lg">
                {score}/{maxPairs}
              </div>
            </div>
            
            <div className="bg-indigo-50 p-3 rounded-lg">
              <div className="text-indigo-600 mb-1"><RotateCw className="h-5 w-5 mx-auto" /></div>
              <div className="text-sm text-gray-500">Turns</div>
              <div className="font-bold text-lg">{turns}</div>
            </div>
            
            <div className="bg-indigo-50 p-3 rounded-lg">
              <div className="text-indigo-600 mb-1"><Clock className="h-5 w-5 mx-auto" /></div>
              <div className="text-sm text-gray-500">Time</div>
              <div className="font-bold text-lg">{formatTime(gameTime)}</div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
            <h3 className="text-center text-indigo-800 font-semibold mb-2 flex items-center justify-center gap-1">
              <Trophy className="h-4 w-4 text-amber-500" /> Top Scores - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </h3>
            
            <div className="space-y-2 overflow-auto max-h-40">
              {highScores.length > 0 ? (
                highScores.map((score, index) => (
                  <div key={index} className={`flex justify-between items-center p-2 text-sm rounded ${isNewHighScore && index === 0 ? 'bg-yellow-100' : 'bg-white'}`}>
                    <span className="font-medium">#{index + 1}</span>
                    <span className="flex items-center gap-1">
                      <RotateCw className="h-3 w-3" /> {score.turns}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {formatTime(score.time)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center text-sm text-gray-500 py-2">No scores yet</div>
              )}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex gap-2 justify-between">
          <Button
            variant="outline"
            className="w-1/2"
            onClick={onMainMenu}
          >
            Main Menu
          </Button>
          <Button
            className="w-1/2 bg-indigo-600 hover:bg-indigo-700"
            onClick={onPlayAgain}
          >
            Play Again
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
