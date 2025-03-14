
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface GameRulesProps {
  setShowRules: (show: boolean) => void;
}

export const GameRules = ({ setShowRules }: GameRulesProps) => {
  return (
    <Card className="mt-8 max-w-lg mx-auto shadow-lg">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-xl text-indigo-900">How to Play</CardTitle>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setShowRules(false)}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium text-indigo-700 mb-1">Goal</h3>
          <p className="text-gray-700">Find all matching pairs of cards in the fewest number of turns.</p>
        </div>
        
        <div>
          <h3 className="font-medium text-indigo-700 mb-1">How to Play</h3>
          <ol className="list-decimal list-inside text-gray-700 space-y-2">
            <li>Click on a card to flip it over and reveal its icon.</li>
            <li>Click on a second card to find a match.</li>
            <li>If the icons match, both cards stay flipped. If not, they flip back.</li>
            <li>Remember the positions of cards you've seen to make matches faster.</li>
            <li>Continue until all pairs are matched.</li>
          </ol>
        </div>
        
        <div>
          <h3 className="font-medium text-indigo-700 mb-1">Difficulty Levels</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li><span className="font-medium">Easy:</span> 6 pairs (12 cards)</li>
            <li><span className="font-medium">Medium:</span> 8 pairs (16 cards)</li>
            <li><span className="font-medium">Hard:</span> 10 pairs (20 cards)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
