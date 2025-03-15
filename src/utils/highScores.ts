export interface HighScore {
  turns: number;
  time: number;
  score: number;
  scoreValue: number; // Calculated value for sorting (lower is better)
  date: string;
}

const HIGH_SCORES_KEY = 'memory-game-high-scores';

// Get high scores for a specific difficulty
export const getHighScores = (difficulty: "easy" | "medium" | "hard"): HighScore[] => {
  try {
    const storedScores = localStorage.getItem(HIGH_SCORES_KEY);
    const allScores = storedScores ? JSON.parse(storedScores) : {};
    const difficultyScores = allScores[difficulty] || [];
    
    // Sort by scoreValue (lower is better)
    return difficultyScores.sort((a: HighScore, b: HighScore) => a.scoreValue - b.scoreValue);
  } catch (error) {
    console.error('Error getting high scores:', error);
    return [];
  }
};

// Save a high score - returns true if it's a new record
export const saveHighScore = (
  difficulty: "easy" | "medium" | "hard", 
  score: HighScore
): boolean => {
  try {
    const storedScores = localStorage.getItem(HIGH_SCORES_KEY);
    const allScores = storedScores ? JSON.parse(storedScores) : {};
    
    // Initialize difficulty array if it doesn't exist
    if (!allScores[difficulty]) {
      allScores[difficulty] = [];
    }
    
    // Add the new score
    allScores[difficulty].push(score);
    
    // Sort and keep only top 5 scores
    allScores[difficulty] = allScores[difficulty]
      .sort((a: HighScore, b: HighScore) => a.scoreValue - b.scoreValue)
      .slice(0, 5);
    
    // Save back to localStorage
    localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(allScores));
    
    // Check if this score is #1
    return allScores[difficulty][0].date === score.date;
  } catch (error) {
    console.error('Error saving high score:', error);
    return false;
  }
};

// Clear all high scores
export const clearHighScores = (): void => {
  localStorage.removeItem(HIGH_SCORES_KEY);
};
