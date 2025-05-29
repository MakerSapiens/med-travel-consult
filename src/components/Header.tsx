
import { Button } from "@/components/ui/button";
import { Video, User } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
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
          <Button size="sm">
            <User className="w-4 h-4 mr-2" />
            Sign In
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
