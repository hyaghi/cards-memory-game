import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GameBoard } from "@/components/game/GameBoard";
import { ScorePanel } from "@/components/game/ScorePanel";
import { GameControls } from "@/components/game/GameControls";
import { GameRules } from "@/components/game/GameRules";
import { GameResults } from "@/components/game/GameResults";
import { UserProfile } from "@/components/game/UserProfile";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

const Index = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [turns, setTurns] = useState(0);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [showRules, setShowRules] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const user = localStorage.getItem("memory-game-user");
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  const startGame = () => {
    setGameStarted(true);
    setGameCompleted(false);
    setScore(0);
    setTurns(0);
    setGameTime(0);
  };

  const endGame = () => {
    setGameStarted(false);
    setGameCompleted(false);
  };
  
  const completeGame = () => {
    setGameCompleted(true);
  };

  const handleTimeUpdate = (time: number) => {
    setGameTime(time);
  };
  
  const getMaxPairs = () => {
    switch (difficulty) {
      case "easy": return 6;
      case "medium": return 8;
      case "hard": return 10;
      default: return 6;
    }
  };
  
  const handleUserLogin = (username: string) => {
    localStorage.setItem("memory-game-user", JSON.stringify({ 
      username,
      createdAt: new Date().toISOString()
    }));
    
    setIsLoggedIn(true);
  };
  
  const handleUserLogout = () => {
    localStorage.removeItem("memory-game-user");
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-indigo-50 to-white px-2 sm:px-4 py-6 sm:py-12">
      <div className="w-full max-w-5xl space-y-4 sm:space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold text-indigo-900 mb-1 sm:mb-2">Yaghi's Memory Game</h1>
            <p className="text-base sm:text-lg text-indigo-700">
              Test your memory and concentration!
            </p>
          </div>
          
          <UserProfile 
            isLoggedIn={isLoggedIn} 
            onLogin={handleUserLogin}
            onLogout={handleUserLogout}
          />
        </div>

        {!gameStarted ? (
          <div className="bg-white p-4 sm:p-8 rounded-xl shadow-lg text-center max-w-lg mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Boost Your Brainpower!</h2>
            <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
              <GameControls 
                difficulty={difficulty} 
                setDifficulty={setDifficulty} 
                showRules={showRules}
                setShowRules={setShowRules}
              />
            </div>
            <Button 
              onClick={startGame} 
              className="bg-indigo-600 hover:bg-indigo-700 text-lg sm:text-xl px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-56"
            >
              Start Game
            </Button>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6 w-full">
            <ScorePanel 
              score={score} 
              turns={turns} 
              difficulty={difficulty} 
              isGameActive={gameStarted}
              onTimeUpdate={handleTimeUpdate}
            />
            <GameBoard 
              difficulty={difficulty} 
              incrementScore={() => setScore(score + 1)} 
              incrementTurns={() => setTurns(turns + 1)}
              endGame={endGame}
              onGameComplete={completeGame}
            />
            <div className="flex justify-center pt-2 sm:pt-4">
              <Button 
                onClick={endGame} 
                variant="outline" 
                className="text-gray-700"
              >
                End Game
              </Button>
            </div>
          </div>
        )}
        
        {showRules && <GameRules setShowRules={setShowRules} />}
        
        {gameCompleted && (
          <GameResults
            score={score}
            turns={turns}
            gameTime={gameTime}
            difficulty={difficulty}
            maxPairs={getMaxPairs()}
            onPlayAgain={startGame}
            onMainMenu={endGame}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
