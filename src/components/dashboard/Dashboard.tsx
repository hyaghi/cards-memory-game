
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGmail } from '@/hooks/useGmail';
import { useCalendar } from '@/hooks/useCalendar';
import Card from '@/components/common/Card';
import Loading from '@/components/common/Loading';
import { Button } from '@/components/ui/button';
import { CalendarDays, Mail, Bell, ChevronRight, Clock } from 'lucide-react';

const Dashboard = () => {
  const { unreadEmails, importantEmails, isLoading: emailsLoading } = useGmail();
  const { upcomingEvents, isLoading: eventsLoading } = useCalendar();
  const [greeting, setGreeting] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const hours = new Date().getHours();
    let greetingText = '';
    
    if (hours < 12) {
      greetingText = 'Good morning';
    } else if (hours < 18) {
      greetingText = 'Good afternoon';
    } else {
      greetingText = 'Good evening';
    }
    
    setGreeting(greetingText);
  }, []);

  const isLoading = emailsLoading || eventsLoading;

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loading text="Loading your data..." />
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">{greeting}</h1>
        <p className="text-muted-foreground">Here's what's happening with your emails and schedule.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-full bg-blue-100">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-3xl font-semibold text-blue-600">{unreadEmails?.length || 0}</span>
          </div>
          <h3 className="font-medium">Unread Emails</h3>
          <p className="text-sm text-muted-foreground mb-4">Messages awaiting your attention</p>
          <Button 
            variant="ghost" 
            className="w-full justify-between text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            onClick={() => navigate('/emails')}
          >
            <span>View emails</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-full bg-amber-100">
              <Bell className="h-5 w-5 text-amber-600" />
            </div>
            <span className="text-3xl font-semibold text-amber-600">{importantEmails?.length || 0}</span>
          </div>
          <h3 className="font-medium">Important Emails</h3>
          <p className="text-sm text-muted-foreground mb-4">High priority messages requiring action</p>
          <Button 
            variant="ghost" 
            className="w-full justify-between text-amber-600 hover:text-amber-700 hover:bg-amber-50"
            onClick={() => navigate('/emails?filter=important')}
          >
            <span>View important</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-full bg-emerald-100">
              <CalendarDays className="h-5 w-5 text-emerald-600" />
            </div>
            <span className="text-3xl font-semibold text-emerald-600">{upcomingEvents?.length || 0}</span>
          </div>
          <h3 className="font-medium">Upcoming Events</h3>
          <p className="text-sm text-muted-foreground mb-4">Scheduled appointments for today</p>
          <Button 
            variant="ghost" 
            className="w-full justify-between text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
            onClick={() => navigate('/calendar')}
          >
            <span>View calendar</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Next Appointments</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground"
              onClick={() => navigate('/calendar')}
            >
              View all
            </Button>
          </div>
          
          <div className="space-y-3">
            {upcomingEvents && upcomingEvents.length > 0 ? (
              upcomingEvents.slice(0, 3).map((event, index) => (
                <Card 
                  key={event.id} 
                  className="p-4 animate-slide-up stagger-animation"
                  interactive
                  onClick={() => navigate(`/calendar?event=${event.id}`)}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-secondary flex-shrink-0">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">{event.summary}</h3>
                      <p className="text-sm text-muted-foreground mb-1">
                        {new Date(event.start?.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                        {new Date(event.end?.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {event.location && (
                        <p className="text-xs text-muted-foreground truncate">{event.location}</p>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No upcoming appointments</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => navigate('/calendar')}
                >
                  Schedule one
                </Button>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Important Emails</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground"
              onClick={() => navigate('/emails?filter=important')}
            >
              View all
            </Button>
          </div>
          
          <div className="space-y-3">
            {importantEmails && importantEmails.length > 0 ? (
              importantEmails.slice(0, 3).map((email) => (
                <Card 
                  key={email.id} 
                  className="p-4 animate-slide-up stagger-animation"
                  interactive
                  onClick={() => navigate(`/emails?id=${email.id}`)}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-secondary flex-shrink-0">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">{email.from?.name || email.from?.email}</h3>
                      <p className="font-medium text-sm mb-1">{email.subject}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{email.snippet}</p>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No important emails</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => navigate('/emails')}
                >
                  View all emails
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
