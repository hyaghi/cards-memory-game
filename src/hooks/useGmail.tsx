
import { useState, useEffect } from 'react';
import { useGoogleAuth } from './useGoogleAuth';
import { mockEmails } from '@/services/googleService';
import { toast } from '@/hooks/use-toast';

interface EmailAddress {
  name?: string;
  email: string;
}

export interface Email {
  id: string;
  threadId: string;
  subject?: string;
  snippet?: string;
  from?: EmailAddress;
  to?: EmailAddress[];
  cc?: EmailAddress[];
  bcc?: EmailAddress[];
  date: string;
  read: boolean;
  important: boolean;
  hasAttachments: boolean;
}

export const useGmail = () => {
  const { isAuthenticated } = useGoogleAuth();
  const [emails, setEmails] = useState<Email[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchEmails();
    } else {
      setEmails([]);
    }
  }, [isAuthenticated]);

  const fetchEmails = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulating API call with mock data
      setTimeout(() => {
        setEmails(mockEmails);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Failed to fetch emails', error);
      setError('Failed to fetch emails. Please try again.');
      setIsLoading(false);
    }
  };

  const refreshEmails = () => {
    fetchEmails();
    toast({
      title: "Refreshed",
      description: "Your emails have been refreshed.",
    });
  };

  const markAsRead = (id: string) => {
    setEmails(prev => 
      prev.map(email => 
        email.id === id ? { ...email, read: true } : email
      )
    );
  };

  const markAsImportant = (id: string) => {
    setEmails(prev => 
      prev.map(email => 
        email.id === id ? { ...email, important: !email.important } : email
      )
    );
  };

  const archiveEmail = (id: string) => {
    setEmails(prev => prev.filter(email => email.id !== id));
    toast({
      title: "Email archived",
      description: "The email has been moved to archive.",
    });
  };

  const deleteEmail = (id: string) => {
    setEmails(prev => prev.filter(email => email.id !== id));
    toast({
      title: "Email deleted",
      description: "The email has been deleted.",
    });
  };

  const unreadEmails = emails.filter(email => !email.read);
  const importantEmails = emails.filter(email => email.important);

  return {
    emails,
    unreadEmails,
    importantEmails,
    isLoading,
    error,
    refreshEmails,
    markAsRead,
    markAsImportant,
    archiveEmail,
    deleteEmail,
  };
};
