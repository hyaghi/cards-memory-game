
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { CalendarDays, Mail, Home, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Header = () => {
  const { isAuthenticated, user, signOut } = useGoogleAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  const navItems = [
    { path: '/', label: 'Home', icon: <Home className="h-4 w-4 mr-2" /> },
    { path: '/dashboard', label: 'Dashboard', icon: <Home className="h-4 w-4 mr-2" /> },
    { path: '/emails', label: 'Emails', icon: <Mail className="h-4 w-4 mr-2" /> },
    { path: '/calendar', label: 'Calendar', icon: <CalendarDays className="h-4 w-4 mr-2" /> },
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300 py-4 px-6",
        isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="rounded-md bg-primary p-1.5">
            <CalendarDays className="h-5 w-5 text-white" />
          </div>
          <span className="font-semibold text-lg">Assistant</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {isAuthenticated && navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              onClick={closeMenu}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                location.pathname === item.path 
                  ? "bg-secondary text-secondary-foreground" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
              )}
            >
              <span className="flex items-center">
                {item.icon}
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              {user?.photoURL && (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || 'User'} 
                  className="h-8 w-8 rounded-full object-cover border border-border"
                />
              )}
              <Button 
                variant="ghost" 
                onClick={signOut}
                className="text-sm"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <Link to="/">
              <Button className="rounded-full px-4">Sign In</Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-background border-b border-border animate-fade-in md:hidden">
          <div className="py-4 px-6 flex flex-col space-y-2">
            {isAuthenticated && navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMenu}
                className={cn(
                  "px-4 py-3 rounded-md text-sm font-medium flex items-center",
                  location.pathname === item.path
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <div className="flex items-center justify-between pt-4 mt-2 border-t border-border">
                <div className="flex items-center gap-2">
                  {user?.photoURL && (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  )}
                  <span className="text-sm font-medium">{user?.displayName}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    signOut();
                    closeMenu();
                  }}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link 
                to="/" 
                onClick={closeMenu}
                className="inline-block mt-2"
              >
                <Button className="w-full">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
