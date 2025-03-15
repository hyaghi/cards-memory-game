
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GameBoard } from "@/components/game/GameBoard";
import { ScorePanel } from "@/components/game/ScorePanel";
import { GameControls } from "@/components/game/GameControls";
import { GameRules } from "@/components/game/GameRules";

const Index = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [turns, setTurns] = useState(0);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [showRules, setShowRules] = useState(false);
  const [gameTime, setGameTime] = useState(0);

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setTurns(0);
    setGameTime(0);
  };

  const endGame = () => {
    setGameStarted(false);
  };

  const handleTimeUpdate = (time: number) => {
    setGameTime(time);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-indigo-50 to-white px-4 py-12">
      <div className="max-w-5xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-indigo-900 mb-2">Yaghi's Match Memory Game</h1>
          <p className="text-lg text-indigo-700 mb-8">
            Test your memory and concentration with this cards-matching game!
          </p>
        </div>

        {!gameStarted ? (
          <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Ready to challenge your mind?</h2>
            <div className="space-y-4 mb-8">
              <GameControls 
                difficulty={difficulty} 
                setDifficulty={setDifficulty} 
                showRules={showRules}
                setShowRules={setShowRules}
              />
            </div>
            <Button 
              onClick={startGame} 
              className="bg-indigo-600 hover:bg-indigo-700 text-xl px-8 py-6"
            >
              Start Game
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
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
            />
            <div className="flex justify-center pt-4">
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
      </div>
    </div>
  );
};

export default Index;
