
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { useGoogleAuth } from "./useGoogleAuth";

export interface CalendarEvent {
  id: string;
  summary: string;
  description: string;
  location: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees: {
    email: string;
    displayName?: string;
    responseStatus?: "accepted" | "needsAction" | "declined" | "tentative";
  }[];
}

export const useCalendar = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { user, isAuthenticated } = useGoogleAuth();
  const token = user?.accessToken;

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchEvents();
    }
  }, [isAuthenticated, token]);

  const fetchEvents = async () => {
    if (!isAuthenticated || !token) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      
      // Cast the events to ensure they match the CalendarEvent type
      const typedEvents = data.items.map((event: any): CalendarEvent => ({
        id: event.id,
        summary: event.summary || "",
        description: event.description || "",
        location: event.location || "",
        start: event.start || { dateTime: "", timeZone: "" },
        end: event.end || { dateTime: "", timeZone: "" },
        attendees: event.attendees?.map((attendee: any) => ({
          email: attendee.email,
          displayName: attendee.displayName,
          responseStatus: attendee.responseStatus as "accepted" | "needsAction" | "declined" | "tentative"
        })) || []
      }));
      
      setEvents(typedEvents);
    } catch (error) {
      console.error("Error fetching calendar events:", error);
      toast({
        title: "Error",
        description: "Failed to fetch calendar events",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData: Omit<CalendarEvent, "id">) => {
    if (!isAuthenticated || !token) return null;

    setLoading(true);
    try {
      const response = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventData),
        }
      );

      const data = await response.json();
      
      // Cast the new event to ensure it matches the CalendarEvent type
      const newEvent: CalendarEvent = {
        id: data.id,
        summary: data.summary || "",
        description: data.description || "",
        location: data.location || "",
        start: data.start || { dateTime: "", timeZone: "" },
        end: data.end || { dateTime: "", timeZone: "" },
        attendees: data.attendees?.map((attendee: any) => ({
          email: attendee.email,
          displayName: attendee.displayName,
          responseStatus: attendee.responseStatus as "accepted" | "needsAction" | "declined" | "tentative"
        })) || []
      };
      
      setEvents([...events, newEvent]);
      toast({
        title: "Success",
        description: "Event created successfully",
      });
      return newEvent;
    } catch (error) {
      console.error("Error creating calendar event:", error);
      toast({
        title: "Error",
        description: "Failed to create calendar event",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Add new functions needed by CalendarView component
  const updateEvent = async (eventData: CalendarEvent) => {
    if (!isAuthenticated || !token) return null;
    
    setLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventData.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventData),
        }
      );

      const data = await response.json();
      
      const updatedEvent: CalendarEvent = {
        id: data.id,
        summary: data.summary || "",
        description: data.description || "",
        location: data.location || "",
        start: data.start || { dateTime: "", timeZone: "" },
        end: data.end || { dateTime: "", timeZone: "" },
        attendees: data.attendees?.map((attendee: any) => ({
          email: attendee.email,
          displayName: attendee.displayName,
          responseStatus: attendee.responseStatus as "accepted" | "needsAction" | "declined" | "tentative"
        })) || []
      };
      
      setEvents(events.map(e => e.id === updatedEvent.id ? updatedEvent : e));
      toast({
        title: "Success",
        description: "Event updated successfully",
      });
      return updatedEvent;
    } catch (error) {
      console.error("Error updating calendar event:", error);
      toast({
        title: "Error",
        description: "Failed to update calendar event",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (eventId: string) => {
    if (!isAuthenticated || !token) return false;
    
    setLoading(true);
    try {
      await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setEvents(events.filter(e => e.id !== eventId));
      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
      return true;
    } catch (error) {
      console.error("Error deleting calendar event:", error);
      toast({
        title: "Error",
        description: "Failed to delete calendar event",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get upcoming events for the Dashboard
  const upcomingEvents = events.filter(event => {
    if (!event.start?.dateTime) return false;
    const eventDate = new Date(event.start.dateTime);
    const today = new Date();
    return eventDate.toDateString() === today.toDateString();
  });

  return { 
    events, 
    loading, 
    fetchEvents, 
    createEvent, 
    updateEvent, 
    deleteEvent, 
    isLoading: loading, 
    upcomingEvents 
  };
};
