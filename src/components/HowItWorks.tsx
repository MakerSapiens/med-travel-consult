
import { Card, CardContent } from "@/components/ui/card";
import { Video, Search, Calendar, Plane } from "lucide-react";

const steps = [
  {
    icon: Video,
    number: "01",
    title: "Free Consultation",
    description: "Get a second opinion from our specialist network through a secure video call"
  },
  {
    icon: Search,
    number: "02",
    title: "Explore Options",
    description: "Browse recommended hospitals and treatments based on your consultation"
  },
  {
    icon: Calendar,
    number: "03",
    title: "Book Treatment",
    description: "Schedule your procedure with verified hospitals and top-rated specialists"
  },
  {
    icon: Plane,
    number: "04",
    title: "Travel & Heal",
    description: "We arrange everything from travel to aftercare for a seamless experience"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your journey to world-class healthcare in just 4 simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="relative overflow-hidden hover-scale">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-medical-green to-medical-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                
                <div className="absolute top-4 right-4 text-6xl font-bold text-gray-100">
                  {step.number}
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 text-medical-green">
            <span className="w-2 h-2 bg-medical-green rounded-full"></span>
            <span className="w-8 h-0.5 bg-medical-green"></span>
            <span className="w-2 h-2 bg-medical-green rounded-full"></span>
            <span className="w-8 h-0.5 bg-medical-green"></span>
            <span className="w-2 h-2 bg-medical-green rounded-full"></span>
            <span className="w-8 h-0.5 bg-medical-green"></span>
            <span className="w-2 h-2 bg-medical-green rounded-full"></span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
