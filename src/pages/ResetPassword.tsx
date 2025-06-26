
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have the required tokens for password reset
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    
    if (!accessToken || !refreshToken) {
      setError('Invalid or expired reset link. Please request a new password reset.');
      return;
    }

    // Set the session with the tokens from the URL
    supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess('Password updated successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/auth');
        }, 2000);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-600/10 via-blue-700/10 to-teal-800/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">2O</span>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-gray-800">2nd Opinion</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              Reset Your Password
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Enter your new password below
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <Label htmlFor="password" className="text-sm font-medium">New Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 h-10 sm:h-11"
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1 h-10 sm:h-11"
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            {success && (
              <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md">
                {success}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-600 to-blue-700 hover:from-teal-700 hover:to-blue-800 h-10 sm:h-11"
              disabled={loading}
            >
              {loading ? 'Updating Password...' : 'Update Password'}
            </Button>
          </form>

          {/* Back to login */}
          <div className="mt-4 sm:mt-6 text-center">
            <button
              onClick={() => navigate('/auth')}
              className="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
