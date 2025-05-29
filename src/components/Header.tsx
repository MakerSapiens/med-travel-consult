
import { Button } from "@/components/ui/button";
import { Video, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 bg-gradient-to-br from-medical-green to-medical-blue rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">2O</span>
          </div>
          <span className="text-xl font-bold text-gray-800">2nd Opinion</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#hospitals" className="text-gray-600 hover:text-medical-green transition-colors">Hospitals</a>
          <a href="#doctors" className="text-gray-600 hover:text-medical-green transition-colors">Doctors</a>
          <a href="#destinations" className="text-gray-600 hover:text-medical-green transition-colors">Destinations</a>
          <a href="#consultation" className="text-gray-600 hover:text-medical-green transition-colors">Consultation</a>
        </nav>

        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Video className="w-4 h-4 mr-2" />
            Free Consultation
          </Button>
          
          {user ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 hidden sm:inline">
                {user.email}
              </span>
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <Button size="sm" onClick={() => navigate('/auth')}>
              <User className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
