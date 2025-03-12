
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { useToast } from '@/hooks/use-toast';
import { Mail, Calendar } from 'lucide-react';

const GoogleAuth = () => {
  const { isAuthenticated, isLoading, signIn, error } = useGoogleAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Authentication error",
        description: error,
      });
    }
  }, [error, toast]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight">Sign in</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Connect your Google account to manage emails and calendar
          </p>
        </div>
        
        <div className="space-y-4">
          <Button
            className="w-full flex items-center justify-center gap-2 transition-all hover:shadow-md"
            onClick={signIn}
            disabled={isLoading}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path
                d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                fill="#EA4335"
              />
              <path
                d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                fill="#4285F4"
              />
              <path
                d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                fill="#FBBC05"
              />
              <path
                d="M12.0004 24C15.2404 24 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24 12.0004 24Z"
                fill="#34A853"
              />
            </svg>
            <span>{isLoading ? 'Signing in...' : 'Sign in with Google'}</span>
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Required permissions
              </span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg border border-border bg-secondary/40">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="text-sm font-medium">Gmail Access</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  View and manage your emails to identify important messages and respond on your behalf.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg border border-border bg-secondary/40">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="text-sm font-medium">Calendar Access</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  View, create and manage calendar events to schedule appointments and set reminders.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleAuth;
