
import { Badge } from "@/components/ui/badge";
import { Timer } from "./Timer";

interface ScorePanelProps {
  score: number;
  turns: number;
  difficulty: "easy" | "medium" | "hard";
  isGameActive: boolean;
  onTimeUpdate?: (time: number) => void;
}

export const ScorePanel = ({ score, turns, difficulty, isGameActive, onTimeUpdate }: ScorePanelProps) => {
  const maxPairs = difficulty === "easy" ? 6 : difficulty === "medium" ? 8 : 10;
  
  return (
    <div className="flex flex-wrap justify-between items-center bg-white p-4 rounded-xl shadow-md">
      <div className="flex gap-4 items-center">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Matches</h3>
          <p className="text-2xl font-bold text-indigo-700">{score} <span className="text-sm text-gray-500">/ {maxPairs}</span></p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500">Turns</h3>
          <p className="text-2xl font-bold text-indigo-700">{turns}</p>
        </div>
        
        <Timer isRunning={isGameActive} onTimeUpdate={onTimeUpdate} />
      </div>
      
      <div>
        <Badge variant={
          difficulty === "easy" ? "outline" : 
          difficulty === "medium" ? "secondary" : 
          "destructive"
        }>
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Mode
        </Badge>
      </div>
    </div>
  );
};
