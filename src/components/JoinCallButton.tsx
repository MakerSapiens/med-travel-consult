
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Video, Clock, ExternalLink, Settings } from 'lucide-react';
import { ManualMeetingSetup } from './ManualMeetingSetup';

interface Appointment {
  id: string;
  appointment_date: string;
  meet_link?: string;
  doctors?: {
    first_name: string;
    last_name: string;
  };
}

interface JoinCallButtonProps {
  appointment: Appointment;
}

export function JoinCallButton({ appointment }: JoinCallButtonProps) {
  const [showSetup, setShowSetup] = useState(false);
  const [currentMeetLink, setCurrentMeetLink] = useState(appointment.meet_link);
  const [currentDateTime, setCurrentDateTime] = useState(appointment.appointment_date);

  const handleUpdate = (meetLink: string, newDateTime: string) => {
    setCurrentMeetLink(meetLink);
    setCurrentDateTime(newDateTime);
  };

  const isAppointmentTime = () => {
    const now = new Date();
    const appointmentDateTime = new Date(currentDateTime);
    const timeDiff = appointmentDateTime.getTime() - now.getTime();
    // Allow joining 10 minutes before to 2 hours after
    return timeDiff <= 10 * 60 * 1000 && timeDiff >= -120 * 60 * 1000;
  };

  if (currentMeetLink) {
    return (
      <div className="flex gap-2">
        <Button
          onClick={() => window.open(currentMeetLink, '_blank')}
          disabled={!isAppointmentTime()}
          className="flex items-center gap-2"
          size="sm"
        >
          <Video className="w-4 h-4" />
          Join Meeting
          <ExternalLink className="w-3 h-3" />
        </Button>
        
        <Button
          onClick={() => setShowSetup(true)}
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
        >
          <Settings className="w-3 h-3" />
        </Button>
        
        {showSetup && (
          <ManualMeetingSetup
            appointment={{
              ...appointment,
              meet_link: currentMeetLink,
              appointment_date: currentDateTime
            }}
            onClose={() => setShowSetup(false)}
            onUpdate={handleUpdate}
          />
        )}
      </div>
    );
  }

  return (
    <>
      <Button
        onClick={() => setShowSetup(true)}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <Video className="w-4 h-4" />
        Setup Meeting
      </Button>
      
      {showSetup && (
        <ManualMeetingSetup
          appointment={appointment}
          onClose={() => setShowSetup(false)}
          onUpdate={handleUpdate}
        />
      )}
    </>
  );
}
