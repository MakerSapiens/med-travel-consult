
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAuthClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-medical-green text-white p-2 rounded-lg">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zM9 9V6h2v3h3v2h-3v3H9v-3H6V9h3z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-800">MedTravel</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/#doctors" className="text-gray-600 hover:text-medical-green transition-colors">
              Find Doctors
            </Link>
            <Link to="/#destinations" className="text-gray-600 hover:text-medical-green transition-colors">
              Destinations
            </Link>
            <Link to="/search" className="text-gray-600 hover:text-medical-green transition-colors">
              Search
            </Link>
            <Button 
              onClick={handleAuthClick}
              className="bg-medical-green hover:bg-medical-green-dark"
            >
              {user ? (
                <>
                  <User className="w-4 h-4 mr-2" />
                  Dashboard
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
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
          <div className="md:hidden py-4 border-t">
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
                to="/search" 
                className="text-gray-600 hover:text-medical-green transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Search
              </Link>
              <Button 
                onClick={() => {
                  handleAuthClick();
                  setIsMenuOpen(false);
                }}
                className="bg-medical-green hover:bg-medical-green-dark w-full"
              >
                {user ? (
                  <>
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
