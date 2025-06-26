
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { signIn, signUp, resetPassword, user } = useAuth();

  // Redirect if already logged in
  if (user) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let result;
      
      if (isResetPassword) {
        result = await resetPassword(email);
        if (!result.error) {
          setSuccess('Password reset email sent! Please check your inbox.');
          setIsResetPassword(false);
        }
      } else {
        result = isLogin 
          ? await signIn(email, password)
          : await signUp(email, password);

        if (!result.error) {
          if (!isLogin) {
            setSuccess('Please check your email to confirm your account');
          } else {
            navigate('/');
          }
        }
      }

      if (result.error) {
        setError(result.error.message);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setError('');
    setSuccess('');
    setEmail('');
    setPassword('');
  };

  const switchToLogin = () => {
    setIsLogin(true);
    setIsResetPassword(false);
    resetForm();
  };

  const switchToSignup = () => {
    setIsLogin(false);
    setIsResetPassword(false);
    resetForm();
  };

  const switchToReset = () => {
    setIsResetPassword(true);
    resetForm();
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
              {isResetPassword 
                ? 'Reset Password' 
                : isLogin 
                  ? 'Welcome Back' 
                  : 'Get Started'
              }
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              {isResetPassword 
                ? 'Enter your email to receive a password reset link'
                : isLogin 
                  ? 'Sign in to your account' 
                  : 'Create your account for free consultations'
              }
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 h-10 sm:h-11"
                placeholder="your@email.com"
              />
            </div>

            {!isResetPassword && (
              <div>
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
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
            )}

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
              {loading 
                ? 'Loading...' 
                : isResetPassword 
                  ? 'Send Reset Email'
                  : isLogin 
                    ? 'Sign In' 
                    : 'Sign Up'
              }
            </Button>
          </form>

          {/* Toggle between login/signup/reset */}
          <div className="mt-4 sm:mt-6 text-center space-y-2">
            {!isResetPassword ? (
              <>
                <p className="text-sm text-gray-600">
                  {isLogin ? "Don't have an account?" : 'Already have an account?'}
                  <button
                    type="button"
                    onClick={isLogin ? switchToSignup : switchToLogin}
                    className="ml-2 text-teal-600 hover:text-teal-700 font-medium text-sm"
                  >
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </button>
                </p>
                {isLogin && (
                  <p className="text-sm text-gray-600">
                    Forgot your password?
                    <button
                      type="button"
                      onClick={switchToReset}
                      className="ml-2 text-teal-600 hover:text-teal-700 font-medium"
                    >
                      Reset Password
                    </button>
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-600">
                Remember your password?
                <button
                  type="button"
                  onClick={switchToLogin}
                  className="ml-2 text-teal-600 hover:text-teal-700 font-medium"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>

          {/* Back to home */}
          <div className="mt-4 sm:mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </button>
          </div>
        </div>

        {/* Feature highlight */}
        <div className="mt-6 sm:mt-8 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4">
            <div className="w-6 h-6 text-teal-600 mx-auto mb-2">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <p className="text-sm text-gray-600">
              Get your free consultation after signing up
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
