
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-medical-green to-medical-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">2O</span>
              </div>
              <span className="text-xl font-bold">2nd Opinion</span>
            </div>
            <p className="text-gray-400 mb-4">
              Connecting patients with world-class healthcare specialists for expert medical consultations and treatments worldwide.
            </p>
            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-medical-green cursor-pointer transition-colors">
                <span className="text-sm">f</span>
              </div>
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-medical-green cursor-pointer transition-colors">
                <span className="text-sm">t</span>
              </div>
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-medical-green cursor-pointer transition-colors">
                <span className="text-sm">in</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#hospitals" className="hover:text-medical-green transition-colors">Find Hospitals</a></li>
              <li><a href="#doctors" className="hover:text-medical-green transition-colors">Browse Doctors</a></li>
              <li><a href="#destinations" className="hover:text-medical-green transition-colors">Destinations</a></li>
              <li><a href="#consultation" className="hover:text-medical-green transition-colors">Free Consultation</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Medical Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-medical-green transition-colors">Cardiology</a></li>
              <li><a href="#" className="hover:text-medical-green transition-colors">Oncology</a></li>
              <li><a href="#" className="hover:text-medical-green transition-colors">Orthopedics</a></li>
              <li><a href="#" className="hover:text-medical-green transition-colors">Cosmetic Surgery</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-4 text-sm">
              Subscribe to get the latest updates on medical tourism and health tips.
            </p>
            <div className="flex gap-2">
              <Input 
                placeholder="Enter your email" 
                className="bg-gray-800 border-gray-700 text-white"
              />
              <Button className="bg-medical-green hover:bg-medical-green-dark">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 2nd Opinion. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-medical-green text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-medical-green text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-medical-green text-sm transition-colors">Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
