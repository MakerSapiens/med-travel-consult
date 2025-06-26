
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Stethoscope, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const { data: profile } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getDashboardRoute = () => {
    if (profile?.user_role === 'doctor') {
      return '/doctor-dashboard';
    }
    return '/dashboard';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Stethoscope className="w-8 h-8 text-medical-green" />
            <span className="text-xl font-bold text-gray-800">MedConnect</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/#doctors"
              className="text-gray-600 hover:text-medical-green transition-colors"
            >
              Find Doctors
            </Link>
            <Link
              to="/#destinations"
              className="text-gray-600 hover:text-medical-green transition-colors"
            >
              Destinations
            </Link>
            <Link
              to="/consultation-booking"
              className="text-gray-600 hover:text-medical-green transition-colors"
            >
              Video Consultation
            </Link>
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to={getDashboardRoute()}
                  className="flex items-center space-x-2 text-gray-600 hover:text-medical-green transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/doctor-registration"
                  className="text-medical-green hover:text-medical-green-dark transition-colors font-medium"
                >
                  Join as Doctor
                </Link>
                <Link to="/auth">
                  <Button className="bg-medical-green hover:bg-medical-green-dark">
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/#doctors"
                className="text-gray-600 hover:text-medical-green transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Find Doctors
              </Link>
              <Link
                to="/#destinations"
                className="text-gray-600 hover:text-medical-green transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Destinations
              </Link>
              <Link
                to="/consultation-booking"
                className="text-gray-600 hover:text-medical-green transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Video Consultation
              </Link>
              {user ? (
                <>
                  <Link
                    to={getDashboardRoute()}
                    className="text-gray-600 hover:text-medical-green transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="text-left text-gray-600 hover:text-medical-green transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/doctor-registration"
                    className="text-medical-green hover:text-medical-green-dark transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Join as Doctor
                  </Link>
                  <Link
                    to="/auth"
                    className="text-gray-600 hover:text-medical-green transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
