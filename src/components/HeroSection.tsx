
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Video } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-medical-green via-medical-blue to-medical-green-light min-h-[80vh] flex items-center">
      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-shadow animate-fade-in">
            Get Your <span className="text-yellow-300">2nd Opinion</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 animate-fade-in">
            Connect with world-class specialists for a free consultation and discover the best medical tourism options tailored to your needs.
          </p>
          
          <Card className="bg-white/95 backdrop-blur-sm p-6 md:p-8 animate-scale-in">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Medical Specialty</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cardiology">Cardiology</SelectItem>
                    <SelectItem value="oncology">Oncology</SelectItem>
                    <SelectItem value="orthopedics">Orthopedics</SelectItem>
                    <SelectItem value="neurology">Neurology</SelectItem>
                    <SelectItem value="cosmetic">Cosmetic Surgery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Any destination" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="thailand">Thailand</SelectItem>
                    <SelectItem value="singapore">Singapore</SelectItem>
                    <SelectItem value="india">India</SelectItem>
                    <SelectItem value="turkey">Turkey</SelectItem>
                    <SelectItem value="germany">Germany</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Treatment Type</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All treatments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="surgery">Surgery</SelectItem>
                    <SelectItem value="diagnosis">Diagnosis</SelectItem>
                    <SelectItem value="therapy">Therapy</SelectItem>
                    <SelectItem value="checkup">Health Checkup</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="budget">Under $5,000</SelectItem>
                    <SelectItem value="mid">$5,000 - $15,000</SelectItem>
                    <SelectItem value="premium">$15,000 - $30,000</SelectItem>
                    <SelectItem value="luxury">$30,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <Button size="lg" className="flex-1 bg-medical-green hover:bg-medical-green-dark">
                Find Hospitals & Specialists
              </Button>
              <Button size="lg" variant="outline" className="border-medical-blue text-medical-blue hover:bg-medical-blue hover:text-white">
                <Video className="w-5 h-5 mr-2" />
                Start Free Consultation
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
