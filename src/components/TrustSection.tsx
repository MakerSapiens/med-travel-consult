
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Shield, Award, Users } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Jennifer Wilson",
    country: "USA",
    procedure: "Cardiac Surgery",
    destination: "Singapore",
    rating: 5,
    text: "The consultation helped me understand my options better. The surgery in Singapore was exceptional, and I saved $40,000 compared to US prices.",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "David Thompson",
    country: "UK",
    procedure: "Hip Replacement",
    destination: "India",
    rating: 5,
    text: "From the initial consultation to recovery, everything was perfectly organized. The quality of care exceeded my expectations.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Sofia Martinez",
    country: "Spain",
    procedure: "Cosmetic Surgery",
    destination: "Thailand",
    rating: 5,
    text: "The free consultation gave me confidence in my decision. The results are amazing and the experience was like a health vacation.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
  }
];

const certifications = [
  { name: "JCI Accredited", icon: Shield },
  { name: "ISO 9001:2015", icon: Award },
  { name: "HIPAA Compliant", icon: Shield },
  { name: "50,000+ Patients", icon: Users }
];

const TrustSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-medical-green/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Trusted by Patients Worldwide
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of patients who have received world-class care through our platform
          </p>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="hover-scale">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.country}</p>
                  </div>
                </div>
                
                <div className="flex items-center mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                  "{testimonial.text}"
                </p>
                
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">
                    {testimonial.procedure}
                  </Badge>
                  <Badge className="bg-medical-green text-white text-xs">
                    {testimonial.destination}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Certifications */}
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
            Certified & Trusted
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-medical-green/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <cert.icon className="w-8 h-8 text-medical-green" />
                </div>
                <p className="font-medium text-gray-700">{cert.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
