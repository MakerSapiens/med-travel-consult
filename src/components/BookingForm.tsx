
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, X, Video, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface Doctor {
  id: string;
  first_name: string;
  last_name: string;
  specialty: string;
  hospital?: string;
  bio?: string;
}

interface Availability {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

interface BookingFormProps {
  doctor: Doctor;
  availability: Availability[];
  onClose: () => void;
}

const BookingForm = ({ doctor, availability, onClose }: BookingFormProps) => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [consultationType, setConsultationType] = useState<'video' | 'in-person'>('video');
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Generate next 30 days for booking
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayOfWeek = date.getDay();
      
      // Check if doctor is available on this day
      const hasAvailability = availability.some(slot => slot.day_of_week === dayOfWeek);
      
      if (hasAvailability) {
        dates.push({
          date: date.toISOString().split('T')[0],
          dayName: dayNames[dayOfWeek],
          dayOfWeek
        });
      }
    }
    
    return dates.slice(0, 10); // Show next 10 available dates
  };

  const getAvailableTimesForDate = (selectedDate: string) => {
    if (!selectedDate) return [];
    
    const date = new Date(selectedDate);
    const dayOfWeek = date.getDay();
    
    const dayAvailability = availability.filter(slot => slot.day_of_week === dayOfWeek);
    
    const times = [];
    for (const slot of dayAvailability) {
      const startHour = parseInt(slot.start_time.split(':')[0]);
      const endHour = parseInt(slot.end_time.split(':')[0]);
      
      for (let hour = startHour; hour < endHour; hour++) {
        times.push(`${hour.toString().padStart(2, '0')}:00`);
        if (hour < endHour - 1) {
          times.push(`${hour.toString().padStart(2, '0')}:30`);
        }
      }
    }
    
    return times;
  };

  const handleBooking = async () => {
    if (!user) {
      toast.error('Please log in to book an appointment');
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast.error('Please select a date and time');
      return;
    }

    setIsLoading(true);

    try {
      const appointmentDateTime = new Date(`${selectedDate}T${selectedTime}:00`);
      
      const { error } = await supabase
        .from('appointments')
        .insert({
          user_id: user.id,
          doctor_id: doctor.id,
          appointment_date: appointmentDateTime.toISOString(),
          consultation_type: consultationType,
          notes: notes || null,
          status: 'pending'
        });

      if (error) throw error;

      toast.success('Appointment booked successfully!');
      onClose();
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error('Failed to book appointment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const availableDates = getAvailableDates();
  const availableTimes = getAvailableTimesForDate(selectedDate);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Book Appointment</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Doctor Info */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-bold text-lg">{doctor.first_name} {doctor.last_name}</h3>
            <p className="text-medical-blue font-medium">{doctor.specialty}</p>
            <div className="flex items-center text-gray-600 mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">{doctor.hospital || 'International Hospital'}</span>
            </div>
          </div>

          {/* Consultation Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Consultation Type
            </label>
            <div className="flex gap-3">
              <Button
                variant={consultationType === 'video' ? 'default' : 'outline'}
                onClick={() => setConsultationType('video')}
                className="flex items-center gap-2"
              >
                <Video className="w-4 h-4" />
                Video Call
              </Button>
              <Button
                variant={consultationType === 'in-person' ? 'default' : 'outline'}
                onClick={() => setConsultationType('in-person')}
                className="flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                In-Person
              </Button>
            </div>
          </div>

          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {availableDates.map((dateInfo) => (
                <Button
                  key={dateInfo.date}
                  variant={selectedDate === dateInfo.date ? 'default' : 'outline'}
                  onClick={() => setSelectedDate(dateInfo.date)}
                  className="p-3 h-auto flex flex-col items-center"
                >
                  <span className="text-xs">{dateInfo.dayName}</span>
                  <span className="font-medium">
                    {new Date(dateInfo.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </Button>
              ))}
            </div>
          </div>

          {/* Time Selection */}
          {selectedDate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Time
              </label>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {availableTimes.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? 'default' : 'outline'}
                    onClick={() => setSelectedTime(time)}
                    className="flex items-center justify-center gap-1"
                  >
                    <Clock className="w-3 h-3" />
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any specific concerns or information you'd like to share..."
              className="w-full p-3 border rounded-lg resize-none"
              rows={3}
            />
          </div>

          {/* Booking Summary */}
          {selectedDate && selectedTime && (
            <div className="border rounded-lg p-4 bg-medical-green/5">
              <h4 className="font-medium mb-2">Booking Summary</h4>
              <div className="space-y-1 text-sm">
                <p><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
                <p><strong>Time:</strong> {selectedTime}</p>
                <p><strong>Type:</strong> {consultationType === 'video' ? 'Video Consultation' : 'In-Person Visit'}</p>
                <p><strong>Fee:</strong> $150</p>
              </div>
            </div>
          )}

          {/* Book Button */}
          <Button 
            onClick={handleBooking}
            disabled={!selectedDate || !selectedTime || isLoading}
            className="w-full bg-medical-green hover:bg-medical-green-dark"
          >
            <Calendar className="w-4 h-4 mr-2" />
            {isLoading ? 'Booking...' : 'Book Appointment'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingForm;
