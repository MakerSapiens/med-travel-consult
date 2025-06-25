
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Video, Calendar as CalendarIcon, Clock, X, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Appointment {
  id: string;
  appointment_date: string;
  meet_link?: string;
  doctors?: {
    first_name: string;
    last_name: string;
  };
}

interface ManualMeetingSetupProps {
  appointment: Appointment;
  onClose: () => void;
  onUpdate: (meetLink: string, newDateTime: string) => void;
}

export function ManualMeetingSetup({ appointment, onClose, onUpdate }: ManualMeetingSetupProps) {
  const [meetUrl, setMeetUrl] = useState(appointment.meet_link || '');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(appointment.appointment_date));
  const [selectedTime, setSelectedTime] = useState(() => {
    const date = new Date(appointment.appointment_date);
    return format(date, 'HH:mm');
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSave = async () => {
    if (!meetUrl.trim()) {
      toast.error('Please enter a meeting URL');
      return;
    }

    // Validate URL format
    try {
      new URL(meetUrl);
    } catch {
      toast.error('Please enter a valid URL');
      return;
    }

    setIsUpdating(true);

    try {
      // Combine selected date and time
      const [hours, minutes] = selectedTime.split(':');
      const newDateTime = new Date(selectedDate);
      newDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const { error } = await supabase
        .from('appointments')
        .update({
          meet_link: meetUrl.trim(),
          appointment_date: newDateTime.toISOString()
        })
        .eq('id', appointment.id);

      if (error) throw error;

      toast.success('Meeting details updated successfully!');
      onUpdate(meetUrl.trim(), newDateTime.toISOString());
      onClose();
    } catch (error) {
      console.error('Error updating meeting:', error);
      toast.error('Failed to update meeting details');
    } finally {
      setIsUpdating(false);
    }
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 8; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(timeString);
      }
    }
    return options;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Setup Meeting Details</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Appointment Info */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-bold text-lg">
              Dr. {appointment.doctors?.first_name} {appointment.doctors?.last_name}
            </h3>
            <Badge variant="outline" className="mt-1">
              ID: {appointment.id.slice(0, 8)}...
            </Badge>
          </div>

          {/* Meeting URL Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Meeting URL
            </label>
            <Input
              type="url"
              placeholder="https://meet.google.com/xxx-xxxx-xxx or https://zoom.us/j/123456789"
              value={meetUrl}
              onChange={(e) => setMeetUrl(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Enter any video conferencing URL (Google Meet, Zoom, Teams, etc.)
            </p>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Select Date
            </label>
            <div className="border rounded-lg p-3">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                className="rounded-md"
              />
            </div>
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Select Time
            </label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              {generateTimeOptions().map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          {/* Preview */}
          <div className="border rounded-lg p-4 bg-blue-50">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              Meeting Summary
            </h4>
            <div className="space-y-1 text-sm">
              <p><strong>Date:</strong> {format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
              <p><strong>Time:</strong> {selectedTime}</p>
              <p><strong>URL:</strong> {meetUrl.trim() || 'Not set'}</p>
            </div>
          </div>

          {/* Save Button */}
          <Button 
            onClick={handleSave}
            disabled={!meetUrl.trim() || isUpdating}
            className="w-full bg-medical-green hover:bg-medical-green-dark"
          >
            <Save className="w-4 h-4 mr-2" />
            {isUpdating ? 'Updating...' : 'Save Meeting Details'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
