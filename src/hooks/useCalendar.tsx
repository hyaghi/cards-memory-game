
import { useState, useEffect } from 'react';
import { useGoogleAuth } from './useGoogleAuth';
import { mockEvents } from '@/services/googleService';
import { addHours } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start?: {
    dateTime: string;
    timeZone?: string;
  };
  end?: {
    dateTime: string;
    timeZone?: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
    responseStatus?: 'needsAction' | 'declined' | 'tentative' | 'accepted';
  }>;
}

export const useCalendar = () => {
  const { isAuthenticated } = useGoogleAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchEvents();
    } else {
      setEvents([]);
    }
  }, [isAuthenticated]);

  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulating API call with mock data
      setTimeout(() => {
        // Type assertion to ensure mockEvents matches CalendarEvent[]
        const typedEvents = mockEvents.map(event => ({
          ...event,
          attendees: event.attendees?.map(attendee => ({
            ...attendee,
            // Ensure responseStatus is one of the allowed values
            responseStatus: (attendee.responseStatus as 'needsAction' | 'declined' | 'tentative' | 'accepted') || 'needsAction'
          }))
        })) as CalendarEvent[];
        
        setEvents(typedEvents);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Failed to fetch events', error);
      setError('Failed to fetch calendar events. Please try again.');
      setIsLoading(false);
    }
  };

  const createEvent = (eventData: any) => {
    const newEvent: CalendarEvent = {
      id: `event-${Date.now()}`,
      summary: eventData.summary,
      description: eventData.description,
      location: eventData.location,
      start: {
        dateTime: eventData.start?.dateTime || new Date().toISOString(),
        timeZone: eventData.start?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: eventData.end?.dateTime || addHours(new Date(), 1).toISOString(),
        timeZone: eventData.end?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      attendees: eventData.attendees || [],
    };
    
    setEvents(prev => [...prev, newEvent]);
    
    toast({
      title: "Event created",
      description: "Your new event has been added to the calendar.",
    });
    
    return newEvent;
  };

  const updateEvent = (eventData: CalendarEvent) => {
    setEvents(prev => 
      prev.map(event => 
        event.id === eventData.id ? { ...event, ...eventData } : event
      )
    );
    
    toast({
      title: "Event updated",
      description: "The event has been updated successfully.",
    });
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
    
    toast({
      title: "Event deleted",
      description: "The event has been removed from your calendar.",
    });
  };

  // Get upcoming events (today and future)
  const upcomingEvents = events
    .filter(event => {
      if (!event.start?.dateTime) return false;
      const eventDate = new Date(event.start.dateTime);
      return eventDate >= new Date(new Date().setHours(0, 0, 0, 0));
    })
    .sort((a, b) => {
      if (!a.start?.dateTime || !b.start?.dateTime) return 0;
      return new Date(a.start.dateTime).getTime() - new Date(b.start.dateTime).getTime();
    });

  return {
    events,
    upcomingEvents,
    isLoading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
  };
};
