
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Video, Users, Calendar, Star, Clock } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  const [searchForm, setSearchForm] = useState({
    specialty: '',
    destination: '',
    treatment: '',
    budget: '',
    search: ''
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    Object.entries(searchForm).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    navigate(`/search?${params.toString()}`);
  };

  const handleConsultation = () => {
    navigate('/auth');
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-teal-600 via-blue-700 to-teal-800 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      {/* Floating Notification Cards - Aneta Inspired */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top Left Card */}
        <div className="absolute top-20 left-8 animate-float-slow">
          <Card className="bg-white/95 backdrop-blur-sm p-4 shadow-lg max-w-xs">
            <div className="flex items-start gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <Users className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-800">Second Opinion Ready</h4>
                <p className="text-xs text-gray-600 mt-1">Dr. Sarah Martinez is available for your cardiology consultation. 📋</p>
                <span className="text-xs text-gray-500">2 min ago</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Top Right Card */}
        <div className="absolute top-32 right-8 animate-float-delayed">
          <Card className="bg-white/95 backdrop-blur-sm p-4 shadow-lg max-w-xs">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-800">Appointment Scheduled</h4>
                <p className="text-xs text-gray-600 mt-1">Your consultation with Dr. Johnson is confirmed for tomorrow at 3 PM. ⏰</p>
                <span className="text-xs text-gray-500">5 min ago</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Bottom Left Card */}
        <div className="absolute bottom-32 left-12 animate-float-slow">
          <Card className="bg-white/95 backdrop-blur-sm p-4 shadow-lg max-w-xs">
            <div className="flex items-start gap-3">
              <div className="bg-purple-100 p-2 rounded-full">
                <Star className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-800">Patient Feedback</h4>
                <p className="text-xs text-gray-600 mt-1">John D. rated his second opinion experience 5 stars. Read the full review. ⭐</p>
                <span className="text-xs text-gray-500">12 min ago</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Bottom Right Card */}
        <div className="absolute bottom-20 right-12 animate-float-delayed">
          <Card className="bg-white/95 backdrop-blur-sm p-4 shadow-lg max-w-xs">
            <div className="flex items-start gap-3">
              <div className="bg-orange-100 p-2 rounded-full">
                <Clock className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-800">Quick Consultation</h4>
                <p className="text-xs text-gray-600 mt-1">Dr. Kim is available for immediate consultation. Join now! 🚀</p>
                <span className="text-xs text-gray-500">Just now</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10 flex items-center min-h-screen">
        <div className="max-w-6xl mx-auto text-center text-white">
          {/* Main Hero Content */}
          <div className="mb-12">
            <div className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <span className="text-sm font-medium">🏥 Proudly Trusted by Medical Professionals Worldwide</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              Get Your Professional
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent font-serif italic">
                2nd Opinion
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
              Connect instantly with world-renowned specialists through secure video consultations. 
              Get expert medical opinions from the comfort of your home.
            </p>

            {/* Primary CTA - Video Consultation */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black font-semibold px-8 py-4 text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                onClick={handleConsultation}
              >
                <Video className="w-6 h-6 mr-3" />
                Start Video Consultation Now
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-4 text-lg"
                onClick={handleSearch}
              >
                Browse Specialists
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 mb-12 opacity-80">
              <div className="text-center">
                <div className="text-3xl font-bold">500+</div>
                <div className="text-sm">Expert Doctors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">50+</div>
                <div className="text-sm">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">10k+</div>
                <div className="text-sm">Second Opinions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm">Available</div>
              </div>
            </div>
          </div>

          {/* Enhanced Search Card */}
          <Card className="bg-white/95 backdrop-blur-sm p-8 shadow-2xl max-w-4xl mx-auto">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Find Your Specialist</h3>
              <p className="text-gray-600">Search by specialty, location, or treatment type</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Medical Specialty</label>
                <Select value={searchForm.specialty} onValueChange={(value) => setSearchForm({...searchForm, specialty: value})}>
                  <SelectTrigger className="h-12">
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
                <Select value={searchForm.destination} onValueChange={(value) => setSearchForm({...searchForm, destination: value})}>
                  <SelectTrigger className="h-12">
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
                <Select value={searchForm.treatment} onValueChange={(value) => setSearchForm({...searchForm, treatment: value})}>
                  <SelectTrigger className="h-12">
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
                <Select value={searchForm.budget} onValueChange={(value) => setSearchForm({...searchForm, budget: value})}>
                  <SelectTrigger className="h-12">
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
            
            <Button 
              size="lg" 
              className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-semibold py-4 text-lg"
              onClick={handleSearch}
            >
              Search Medical Specialists
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
