
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Video, Calendar } from "lucide-react";

const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    specialty: "Cardiothoracic Surgery",
    hospital: "Singapore General Hospital",
    country: "Singapore",
    rating: 4.9,
    reviews: 250,
    experience: "15+ years",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
    availableSlots: "Next available: Tomorrow",
    languages: ["English", "Mandarin", "Malay"]
  },
  {
    id: 2,
    name: "Dr. Rajesh Patel",
    specialty: "Orthopedic Surgery",
    hospital: "Apollo Hospital",
    country: "India",
    rating: 4.8,
    reviews: 380,
    experience: "20+ years",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
    availableSlots: "Next available: Today",
    languages: ["English", "Hindi", "Gujarati"]
  },
  {
    id: 3,
    name: "Dr. Maria Rodriguez",
    specialty: "Cosmetic Surgery",
    hospital: "Bumrungrad Hospital",
    country: "Thailand",
    rating: 4.9,
    reviews: 420,
    experience: "12+ years",
    image: "https://images.unsplash.com/photo-1594824047368-48f627c9d66e?w=400&h=400&fit=crop&crop=face",
    availableSlots: "Next available: This week",
    languages: ["English", "Spanish", "Thai"]
  },
  {
    id: 4,
    name: "Dr. Mehmet Ozkan",
    specialty: "Hair Transplant",
    hospital: "Acıbadem Hospital",
    country: "Turkey",
    rating: 4.7,
    reviews: 310,
    experience: "10+ years",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face",
    availableSlots: "Next available: Next week",
    languages: ["English", "Turkish", "Arabic"]
  }
];

const FeaturedDoctors = () => {
  return (
    <section id="doctors" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Featured Specialists
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with world-renowned specialists who have helped thousands of international patients
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.map((doctor) => (
            <Card key={doctor.id} className="overflow-hidden hover-scale">
              <div className="relative">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-medical-green text-white">
                    {doctor.country}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="flex items-center space-x-1 bg-white/90 rounded-full px-2 py-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{doctor.rating}</span>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-1">
                  {doctor.name}
                </h3>
                <p className="text-medical-blue font-medium mb-2">
                  {doctor.specialty}
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  {doctor.hospital}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>{doctor.experience}</span>
                  <span>{doctor.reviews} reviews</span>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Languages:</p>
                  <div className="flex flex-wrap gap-1">
                    {doctor.languages.map((language, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <p className="text-xs text-medical-green font-medium mb-4">
                  {doctor.availableSlots}
                </p>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Video className="w-4 h-4 mr-1" />
                    Consult
                  </Button>
                  <Button size="sm" className="flex-1 bg-medical-green hover:bg-medical-green-dark">
                    <Calendar className="w-4 h-4 mr-1" />
                    Book
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDoctors;
