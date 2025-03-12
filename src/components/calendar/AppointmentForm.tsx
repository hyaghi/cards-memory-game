
import { useState } from 'react';
import { format, addHours, setHours, setMinutes } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

interface AppointmentFormProps {
  onSave: (data: any) => void;
  onCancel: () => void;
  event?: any;
  defaultDate?: Date;
}

const AppointmentForm = ({ onSave, onCancel, event, defaultDate = new Date() }: AppointmentFormProps) => {
  const [title, setTitle] = useState(event?.summary || '');
  const [description, setDescription] = useState(event?.description || '');
  const [location, setLocation] = useState(event?.location || '');
  
  // Set default start time to current hour + 1, rounded to nearest 30 min
  const defaultStartTime = event?.start?.dateTime 
    ? new Date(event.start.dateTime) 
    : setMinutes(setHours(defaultDate, defaultDate.getHours() + 1), 0);
  
  // Set default end time to start time + 1 hour
  const defaultEndTime = event?.end?.dateTime 
    ? new Date(event.end.dateTime) 
    : addHours(defaultStartTime, 1);
  
  const [date, setDate] = useState<Date>(defaultStartTime);
  const [startTime, setStartTime] = useState(format(defaultStartTime, 'HH:mm'));
  const [endTime, setEndTime] = useState(format(defaultEndTime, 'HH:mm'));
  
  const handleSave = () => {
    if (!title) return;
    
    // Create date objects for start and end times
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const startDateTime = new Date(date);
    startDateTime.setHours(startHour, startMinute);
    
    const endDateTime = new Date(date);
    endDateTime.setHours(endHour, endMinute);
    
    onSave({
      summary: title,
      description,
      location,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium">
          Title
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Meeting with client"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium">
          Description (optional)
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Meeting agenda and notes"
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="location" className="block text-sm font-medium">
          Location (optional)
        </label>
        <Input
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Office or Meeting Room"
        />
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium">
          Date
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={(newDate) => {
                if(newDate) setDate(newDate)
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="startTime" className="block text-sm font-medium">
            Start Time
          </label>
          <Input
            id="startTime"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="endTime" className="block text-sm font-medium">
            End Time
          </label>
          <Input
            id="endTime"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!title}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default AppointmentForm;
