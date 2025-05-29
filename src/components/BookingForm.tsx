
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Calendar, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BookingFormProps {
  doctor: any;
  availability: any[];
  onClose: () => void;
}

const BookingForm = ({ doctor, availability, onClose }: BookingFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [consultationType, setConsultationType] = useState('video');
  const [notes, setNotes] = useState('');

  const createAppointment = useMutation({
    mutationFn: async (appointmentData: any) => {
      const { data, error } = await supabase
        .from('appointments')
        .insert([appointmentData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Appointment Booked",
        description: "Your appointment has been successfully scheduled.",
      });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to book an appointment.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please select a date and time for your appointment.",
        variant: "destructive",
      });
      return;
    }

    const appointmentDateTime = new Date(`${selectedDate}T${selectedTime}`);

    createAppointment.mutate({
      user_id: user.id,
      doctor_id: doctor.id,
      appointment_date: appointmentDateTime.toISOString(),
      consultation_type: consultationType,
      notes: notes || null,
      status: 'pending'
    });
  };

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Generate next 7 days for booking
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 7; i++) {
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
    
    return dates;
  };

  const getTimeSlots = () => {
    if (!selectedDate) return [];
    
    const selectedDateObj = new Date(selectedDate);
    const dayOfWeek = selectedDateObj.getDay();
    
    const dayAvailability = availability.find(slot => slot.day_of_week === dayOfWeek);
    if (!dayAvailability) return [];
    
    const slots = [];
    const startTime = dayAvailability.start_time.split(':');
    const endTime = dayAvailability.end_time.split(':');
    
    let currentHour = parseInt(startTime[0]);
    const endHour = parseInt(endTime[0]);
    
    while (currentHour < endHour) {
      slots.push(`${currentHour.toString().padStart(2, '0')}:00`);
      currentHour++;
    }
    
    return slots;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Book Appointment</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Doctor Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg">
              {doctor.first_name} {doctor.last_name}
            </h3>
            <p className="text-medical-blue">{doctor.specialty}</p>
            <Badge className="mt-2 bg-medical-green text-white">
              ${doctor.consultation_fee}/consultation
            </Badge>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date Selection */}
            <div>
              <Label className="text-base font-medium mb-3 block">Select Date</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {getAvailableDates().map((dateInfo) => (
                  <button
                    key={dateInfo.date}
                    type="button"
                    onClick={() => setSelectedDate(dateInfo.date)}
                    className={`p-3 border rounded-lg text-center transition-colors ${
                      selectedDate === dateInfo.date
                        ? 'border-medical-green bg-medical-green text-white'
                        : 'border-gray-300 hover:border-medical-green'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">{dateInfo.dayName}</span>
                    </div>
                    <span className="text-xs">{dateInfo.date}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div>
                <Label className="text-base font-medium mb-3 block">Select Time</Label>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {getTimeSlots().map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`p-2 border rounded-lg text-center transition-colors ${
                        selectedTime === time
                          ? 'border-medical-green bg-medical-green text-white'
                          : 'border-gray-300 hover:border-medical-green'
                      }`}
                    >
                      <Clock className="w-4 h-4 mx-auto mb-1" />
                      <span className="text-sm">{time}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Consultation Type */}
            <div>
              <Label className="text-base font-medium mb-3 block">Consultation Type</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setConsultationType('video')}
                  className={`p-3 border rounded-lg text-center transition-colors ${
                    consultationType === 'video'
                      ? 'border-medical-green bg-medical-green text-white'
                      : 'border-gray-300 hover:border-medical-green'
                  }`}
                >
                  Video Call
                </button>
                <button
                  type="button"
                  onClick={() => setConsultationType('in-person')}
                  className={`p-3 border rounded-lg text-center transition-colors ${
                    consultationType === 'in-person'
                      ? 'border-medical-green bg-medical-green text-white'
                      : 'border-gray-300 hover:border-medical-green'
                  }`}
                >
                  In-Person
                </button>
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes" className="text-base font-medium">
                Additional Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Please describe your symptoms or concerns..."
                className="mt-2"
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createAppointment.isPending || !selectedDate || !selectedTime}
                className="flex-1 bg-medical-green hover:bg-medical-green-dark"
              >
                {createAppointment.isPending ? 'Booking...' : 'Book Appointment'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingForm;
