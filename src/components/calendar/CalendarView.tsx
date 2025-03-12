
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCalendar } from '@/hooks/useCalendar';
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Card from '@/components/common/Card';
import AppointmentForm from './AppointmentForm';
import Loading from '@/components/common/Loading';

const CalendarView = () => {
  const { events, isLoading, createEvent, updateEvent, deleteEvent } = useCalendar();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Check if an event ID is in the URL
  useState(() => {
    const eventId = searchParams.get('event');
    if (eventId && events) {
      const event = events.find(e => e.id === eventId);
      if (event) {
        setSelectedEvent(event);
        if (event.start?.dateTime) {
          const eventDate = new Date(event.start.dateTime);
          setCurrentDate(eventDate);
          setSelectedDate(eventDate);
        }
      }
    }
  });

  const handlePreviousWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };

  const handleNextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
  };

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    if (event.start?.dateTime) {
      setSelectedDate(new Date(event.start.dateTime));
    }
    // Update URL with event ID
    searchParams.set('event', event.id);
    navigate(`/calendar?event=${event.id}`);
  };

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setIsCreatingEvent(true);
  };

  const handleSaveEvent = (eventData: any) => {
    if (selectedEvent) {
      updateEvent({
        ...selectedEvent,
        ...eventData
      });
    } else {
      createEvent({
        ...eventData,
        start: {
          dateTime: eventData.startTime,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        end: {
          dateTime: eventData.endTime,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      });
    }
    setIsCreatingEvent(false);
    setSelectedEvent(null);
  };

  const handleCancelCreate = () => {
    setIsCreatingEvent(false);
    setSelectedEvent(null);
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      deleteEvent(selectedEvent.id);
      setSelectedEvent(null);
    }
  };

  // Generate week days
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Get events for selected date
  const selectedDateEvents = events?.filter(event => {
    if (!event.start?.dateTime) return false;
    return isSameDay(parseISO(event.start.dateTime), selectedDate);
  });

  if (isLoading) {
    return <Loading className="h-64" text="Loading your calendar..." />;
  }

  return (
    <div className="w-full animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Calendar</h1>
          <p className="text-muted-foreground">
            {format(currentDate, 'MMMM yyyy')}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleToday}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={handlePreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button onClick={handleCreateEvent}>
            <Plus className="h-4 w-4 mr-2" />
            New Event
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div className="md:col-span-2 lg:col-span-3 space-y-6">
          {/* Weekly calendar view */}
          <Card className="p-0 overflow-hidden">
            <div className="grid grid-cols-7 border-b border-border">
              {weekDays.map((day, index) => (
                <div 
                  key={index} 
                  className="text-center py-3 border-r border-border last:border-r-0"
                >
                  <p className="text-xs text-muted-foreground mb-1">
                    {format(day, 'EEE')}
                  </p>
                  <button
                    className={`flex items-center justify-center h-8 w-8 rounded-full mx-auto text-sm ${
                      isSameDay(day, selectedDate) 
                        ? 'bg-primary text-primary-foreground' 
                        : isSameDay(day, new Date()) 
                          ? 'bg-muted/70 text-muted-foreground' 
                          : ''
                    }`}
                    onClick={() => handleDateClick(day)}
                  >
                    {format(day, 'd')}
                  </button>
                </div>
              ))}
            </div>
            
            <div className="p-4">
              <div className="space-y-2">
                {weekDays.map((day, dayIndex) => {
                  const dayEvents = events?.filter(event => {
                    if (!event.start?.dateTime) return false;
                    return isSameDay(parseISO(event.start.dateTime), day);
                  });
                  
                  if (!dayEvents || dayEvents.length === 0) return null;
                  
                  return (
                    <div key={dayIndex} className="animate-slide-up">
                      <div className="flex items-center gap-2 mb-2">
                        <div 
                          className={`h-2 w-2 rounded-full ${
                            isSameDay(day, selectedDate) 
                              ? 'bg-primary' 
                              : 'bg-muted-foreground'
                          }`}
                        ></div>
                        <h3 className="text-sm font-medium">
                          {format(day, 'EEEE, MMMM d')}
                        </h3>
                      </div>
                      
                      <div className="pl-4 space-y-1.5">
                        {dayEvents.map((event) => (
                          <button
                            key={event.id}
                            className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                              selectedEvent?.id === event.id
                                ? 'bg-secondary text-secondary-foreground'
                                : 'hover:bg-muted/50'
                            }`}
                            onClick={() => handleEventClick(event)}
                          >
                            <div className="flex items-center">
                              <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                              <span className="text-xs text-muted-foreground">
                                {event.start?.dateTime && format(new Date(event.start.dateTime), 'h:mm a')}
                              </span>
                            </div>
                            <p className="font-medium truncate">{event.summary}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
                
                {!weekDays.some(day => {
                  const dayEvents = events?.filter(event => {
                    if (!event.start?.dateTime) return false;
                    return isSameDay(parseISO(event.start.dateTime), day);
                  });
                  return dayEvents && dayEvents.length > 0;
                }) && (
                  <div className="flex flex-col items-center justify-center py-8">
                    <CalendarIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground mb-2">No events this week</p>
                    <Button onClick={handleCreateEvent} variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Event
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        <div className="md:col-span-1">
          <div className="sticky top-20">
            {isCreatingEvent ? (
              <Card>
                <h2 className="text-lg font-semibold mb-4">Create Event</h2>
                <AppointmentForm 
                  onSave={handleSaveEvent} 
                  onCancel={handleCancelCreate}
                  defaultDate={selectedDate}
                />
              </Card>
            ) : selectedEvent ? (
              <Card>
                <h2 className="text-lg font-semibold mb-4">Event Details</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">{selectedEvent.summary}</h3>
                    {selectedEvent.description && (
                      <p className="text-sm text-muted-foreground mt-1">{selectedEvent.description}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm">
                          {selectedEvent.start?.dateTime && (
                            format(new Date(selectedEvent.start.dateTime), 'EEEE, MMMM d, yyyy')
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {selectedEvent.start?.dateTime && selectedEvent.end?.dateTime && (
                            `${format(new Date(selectedEvent.start.dateTime), 'h:mm a')} - ${format(new Date(selectedEvent.end.dateTime), 'h:mm a')}`
                          )}
                        </p>
                      </div>
                    </div>
                    
                    {selectedEvent.location && (
                      <div className="flex items-start gap-3">
                        <svg className="h-4 w-4 text-muted-foreground mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <p className="text-sm">{selectedEvent.location}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSelectedEvent(null);
                        // Remove event param from URL
                        searchParams.delete('event');
                        navigate(`/calendar`);
                      }}
                    >
                      Close
                    </Button>
                    <div className="space-x-2">
                      <Button variant="destructive" size="sm" onClick={handleDeleteEvent}>
                        Delete
                      </Button>
                      <Button 
                        onClick={() => {
                          setIsCreatingEvent(true);
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card>
                <h2 className="text-lg font-semibold mb-4">
                  {format(selectedDate, 'EEEE, MMMM d')}
                </h2>
                
                {selectedDateEvents && selectedDateEvents.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDateEvents.map((event) => (
                      <div 
                        key={event.id}
                        className="p-3 rounded-md border border-border hover:bg-muted/30 transition-colors cursor-pointer"
                        onClick={() => handleEventClick(event)}
                      >
                        <p className="text-sm font-medium mb-1">{event.summary}</p>
                        <p className="text-xs text-muted-foreground">
                          {event.start?.dateTime && format(new Date(event.start.dateTime), 'h:mm a')} - 
                          {event.end?.dateTime && format(new Date(event.end.dateTime), 'h:mm a')}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground mb-4">No events scheduled</p>
                    <Button onClick={handleCreateEvent} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Event
                    </Button>
                  </div>
                )}
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
