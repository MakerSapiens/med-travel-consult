
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const destinations = [
  {
    id: 1,
    name: "Thailand",
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=800&h=600&fit=crop",
    specialties: ["Cosmetic Surgery", "Dental Care", "Heart Surgery"],
    savings: "Up to 70% savings",
    hospitals: "150+ hospitals",
    description: "World-class medical facilities with luxury hospitality"
  },
  {
    id: 2,
    name: "Singapore",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop",
    specialties: ["Cancer Treatment", "Neurosurgery", "Cardiology"],
    savings: "Up to 50% savings",
    hospitals: "80+ hospitals",
    description: "Advanced medical technology and international standards"
  },
  {
    id: 3,
    name: "India",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop",
    specialties: ["Orthopedics", "Eye Surgery", "Fertility"],
    savings: "Up to 80% savings",
    hospitals: "300+ hospitals",
    description: "Exceptional care at affordable prices"
  },
  {
    id: 4,
    name: "Turkey",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&h=600&fit=crop",
    specialties: ["Hair Transplant", "Cosmetic Surgery", "Dental"],
    savings: "Up to 75% savings",
    hospitals: "120+ hospitals",
    description: "European standards with competitive pricing"
  }
];

const FeaturedDestinations = () => {
  return (
    <section id="destinations" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Top Medical Tourism Destinations
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover world-renowned healthcare destinations offering exceptional medical care at affordable prices
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination) => (
            <Card key={destination.id} className="overflow-hidden hover-scale cursor-pointer">
              <div className="relative h-48">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-medical-green text-white">
                    {destination.savings}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {destination.name}
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                  {destination.description}
                </p>
                
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Popular Specialties:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {destination.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <p className="text-sm text-medical-blue font-medium">
                  {destination.hospitals}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDestinations;
