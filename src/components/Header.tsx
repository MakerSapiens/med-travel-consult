
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User } from "lucide-react";
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-teal-600 to-blue-700 text-white p-2 rounded-lg">
              <span className="text-sm sm:text-base font-bold">2O</span>
            </div>
            <span className="text-lg sm:text-xl font-bold text-gray-800">2nd Opinion</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link to="/#doctors" className="text-sm text-gray-600 hover:text-teal-600 transition-colors">
              Find Doctors
            </Link>
            <Link to="/#destinations" className="text-sm text-gray-600 hover:text-teal-600 transition-colors">
              Destinations
            </Link>
            <Link to="/search" className="text-sm text-gray-600 hover:text-teal-600 transition-colors">
              Search
            </Link>
            <Button 
              onClick={handleAuthClick}
              className="bg-gradient-to-r from-teal-600 to-blue-700 hover:from-teal-700 hover:to-blue-800 text-sm px-4 py-2"
              size="sm"
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
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 text-gray-600" />
            ) : (
              <Menu className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-3">
              <Link 
                to="/#doctors" 
                className="text-sm text-gray-600 hover:text-teal-600 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Find Doctors
              </Link>
              <Link 
                to="/#destinations" 
                className="text-sm text-gray-600 hover:text-teal-600 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Destinations
              </Link>
              <Link 
                to="/search" 
                className="text-sm text-gray-600 hover:text-teal-600 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Search
              </Link>
              <Button 
                onClick={() => {
                  handleAuthClick();
                  setIsMenuOpen(false);
                }}
                className="bg-gradient-to-r from-teal-600 to-blue-700 hover:from-teal-700 hover:to-blue-800 w-full text-sm mt-2"
                size="sm"
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
