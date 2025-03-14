
import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";

interface GameControlsProps {
  difficulty: "easy" | "medium" | "hard";
  setDifficulty: (difficulty: "easy" | "medium" | "hard") => void;
  showRules: boolean;
  setShowRules: (show: boolean) => void;
}

export const GameControls = ({ difficulty, setDifficulty, showRules, setShowRules }: GameControlsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">Select Difficulty</h3>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={difficulty === "easy" ? "default" : "outline"}
            onClick={() => setDifficulty("easy")}
            className={difficulty === "easy" ? "bg-indigo-600 hover:bg-indigo-700" : ""}
          >
            Easy
          </Button>
          <Button 
            variant={difficulty === "medium" ? "default" : "outline"}
            onClick={() => setDifficulty("medium")}
            className={difficulty === "medium" ? "bg-indigo-600 hover:bg-indigo-700" : ""}
          >
            Medium
          </Button>
          <Button 
            variant={difficulty === "hard" ? "default" : "outline"}
            onClick={() => setDifficulty("hard")}
            className={difficulty === "hard" ? "bg-indigo-600 hover:bg-indigo-700" : ""}
          >
            Hard
          </Button>
        </div>
      </div>
      
      <div className="flex justify-center">
        <Button 
          variant="ghost" 
          onClick={() => setShowRules(!showRules)}
          className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 flex items-center gap-1"
        >
          <InfoIcon className="h-4 w-4" />
          {showRules ? "Hide Rules" : "Show Rules"}
        </Button>
      </div>
    </div>
  );
};
