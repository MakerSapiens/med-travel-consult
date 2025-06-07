
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

export default function GoogleCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Setting up your meeting...');

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');
      
      if (error) {
        setStatus('error');
        setMessage('Authorization was cancelled or failed.');
        return;
      }

      if (!code || !state) {
        return; // Still loading query params
      }

      try {
        // Exchange code for access token
        const tokenResponse = await fetch('/api/auth/google-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            code: code as string,
            appointmentId: state as string 
          })
        });

        const tokenData = await tokenResponse.json();
        
        if (!tokenResponse.ok) {
          throw new Error(tokenData.error || 'Failed to get access token');
        }

        // Create meeting for the appointment
        const meetResponse = await fetch(`/api/appointments/${state}/create-meet`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken: tokenData.accessToken })
        });

        const meetData = await meetResponse.json();

        if (meetData.success) {
          setStatus('success');
          setMessage('Meeting link created successfully! Redirecting to dashboard...');
          
          // Redirect after a short delay
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        } else {
          throw new Error(meetData.error || 'Failed to create meeting');
        }
        
      } catch (error) {
        console.error('Callback error:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  const getIcon = () => {
    switch (status) {
      case 'loading':
        return <Clock className="w-8 h-8 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'error':
        return <XCircle className="w-8 h-8 text-red-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="mb-4">
            {getIcon()}
          </div>
          <h2 className="text-xl font-semibold mb-2">
            {status === 'loading' && 'Setting Up Meeting'}
            {status === 'success' && 'Success!'}
            {status === 'error' && 'Something Went Wrong'}
          </h2>
          <p className="text-gray-600 mb-4">{message}</p>
          
          {status === 'error' && (
            <Button onClick={() => navigate('/dashboard')}>
              Return to Dashboard
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
