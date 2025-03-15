
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User, LogOut, Trophy, Settings } from "lucide-react";
import { toast } from "sonner";
import { clearHighScores } from "@/utils/highScores";

interface UserProfileProps {
  isLoggedIn: boolean;
  onLogin: (username: string) => void;
  onLogout: () => void;
}

export const UserProfile = ({ isLoggedIn, onLogin, onLogout }: UserProfileProps) => {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  useEffect(() => {
    // Try to load user from localStorage
    const savedUser = localStorage.getItem("memory-game-user");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setDisplayName(parsed.username);
    }
  }, [isLoggedIn]);
  
  const handleLogin = () => {
    if (username.trim().length < 3) {
      toast.error("Username must be at least 3 characters");
      return;
    }
    
    onLogin(username);
    setUsername("");
    toast.success(`Welcome, ${username}!`);
  };
  
  const handleLogout = () => {
    onLogout();
    toast.info("You've been logged out");
  };

  const handleClearHighScores = () => {
    clearHighScores();
    toast.success("High scores have been reset");
    setSettingsOpen(false);
  };
  
  return (
    <div className="flex items-center gap-2">
      {isLoggedIn ? (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 border border-indigo-200">
            <AvatarFallback className="bg-indigo-100 text-indigo-800">
              {displayName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <span className="text-sm font-medium text-indigo-800 hidden sm:inline">
            {displayName}
          </span>
          
          <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Account Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="flex items-center gap-3">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-indigo-100 text-indigo-800 text-xl">
                      {displayName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{displayName}</h3>
                    <p className="text-sm text-muted-foreground">Player Account</p>
                  </div>
                </div>
                
                <div className="pt-4 space-y-3">
                  <Button 
                    variant="destructive" 
                    className="w-full" 
                    onClick={handleClearHighScores}
                  >
                    <Trophy className="h-4 w-4 mr-2" /> Reset High Scores
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Log Out
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-indigo-600 border-indigo-200">
              <User className="h-4 w-4 mr-2" /> Sign In
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Player Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter a username"
                  className="w-full"
                />
              </div>
              
              <Button 
                className="w-full bg-indigo-600 hover:bg-indigo-700" 
                onClick={handleLogin}
                disabled={username.trim().length < 3}
              >
                Create Profile
              </Button>
              
              <p className="text-xs text-center text-muted-foreground">
                Your profile will be stored locally on this device
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
