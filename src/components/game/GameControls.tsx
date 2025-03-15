
import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface GameControlsProps {
  difficulty: "easy" | "medium" | "hard";
  setDifficulty: (difficulty: "easy" | "medium" | "hard") => void;
  showRules: boolean;
  setShowRules: (show: boolean) => void;
}

export const GameControls = ({ difficulty, setDifficulty, showRules, setShowRules }: GameControlsProps) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center">
        <h3 className="text-gray-500 font-medium mb-3">Select Difficulty</h3>
        <div className="flex justify-center w-full">
          <div className="flex gap-2">
            <Button 
              variant={difficulty === "easy" ? "default" : "outline"}
              onClick={() => setDifficulty("easy")}
              className={`w-28 ${difficulty === "easy" ? "bg-indigo-600 hover:bg-indigo-700" : ""}`}
            >
              Easy
            </Button>
            <Button 
              variant={difficulty === "medium" ? "default" : "outline"}
              onClick={() => setDifficulty("medium")}
              className={`w-28 ${difficulty === "medium" ? "bg-indigo-600 hover:bg-indigo-700" : ""}`}
            >
              Medium
            </Button>
            <Button 
              variant={difficulty === "hard" ? "default" : "outline"}
              onClick={() => setDifficulty("hard")}
              className={`w-28 ${difficulty === "hard" ? "bg-indigo-600 hover:bg-indigo-700" : ""}`}
            >
              Hard
            </Button>
          </div>
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
