
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Video, Clock, ExternalLink } from 'lucide-react';
import { generateGoogleOAuthUrl } from '@/lib/google-meet';

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
  const [isCreating, setIsCreating] = useState(false);
  const [meetLink, setMeetLink] = useState(appointment.meet_link);

  const handleCreateMeeting = async () => {
    setIsCreating(true);
    
    try {
      // Check if user has already authorized Google
      const authCheck = await fetch('/api/auth/google-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentId: appointment.id })
      });

      if (!authCheck.ok) {
        // Redirect to Google OAuth
        const authUrl = generateGoogleOAuthUrl(appointment.id);
        window.location.href = authUrl;
        return;
      }

      const { accessToken } = await authCheck.json();

      // Create meeting
      const meetResponse = await fetch(`/api/appointments/${appointment.id}/create-meet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken })
      });

      const meetData = await meetResponse.json();
      
      if (meetData.success) {
        setMeetLink(meetData.meetLink);
      } else {
        alert('Failed to create meeting: ' + meetData.error);
      }
    } catch (error) {
      console.error('Meeting creation failed:', error);
      alert('Failed to create meeting. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const isAppointmentTime = () => {
    const now = new Date();
    const appointmentDateTime = new Date(appointment.appointment_date);
    const timeDiff = appointmentDateTime.getTime() - now.getTime();
    // Allow joining 10 minutes before to 30 minutes after
    return timeDiff <= 10 * 60 * 1000 && timeDiff >= -30 * 60 * 1000;
  };

  if (meetLink) {
    return (
      <Button
        onClick={() => window.open(meetLink, '_blank')}
        disabled={!isAppointmentTime()}
        className="flex items-center gap-2"
        size="sm"
      >
        <Video className="w-4 h-4" />
        Join Google Meet
        <ExternalLink className="w-3 h-3" />
      </Button>
    );
  }

  return (
    <Button
      onClick={handleCreateMeeting}
      disabled={isCreating}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      {isCreating ? (
        <>
          <Clock className="w-4 h-4 animate-spin" />
          Creating Meeting...
        </>
      ) : (
        <>
          <Video className="w-4 h-4" />
          Create Meeting Link
        </>
      )}
    </Button>
  );
}
