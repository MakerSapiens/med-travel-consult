
interface AppointmentData {
  id: string;
  appointment_date: string;
  doctor_name: string;
  doctor_email: string;
  patient_name: string;
  patient_email: string;
}

export async function createMeetingForAppointment(appointmentData: AppointmentData, accessToken: string) {
  // This will be implemented once you provide the Google API credentials
  try {
    const response = await fetch('/api/google/create-meeting', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(appointmentData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create meeting');
    }

    return {
      meetLink: data.meetLink,
      eventId: data.eventId
    };
  } catch (error) {
    console.error('Error creating Google Meet:', error);
    throw error;
  }
}

export function generateGoogleOAuthUrl(appointmentId: string) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'your_google_client_id';
  const redirectUri = `${window.location.origin}/auth/google/callback`;
  const scopes = encodeURIComponent('https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar');
  
  return `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${clientId}&` +
    `redirect_uri=${redirectUri}&` +
    `response_type=code&` +
    `scope=${scopes}&` +
    `state=${appointmentId}&` +
    `access_type=offline`;
}
