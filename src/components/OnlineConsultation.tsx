
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Video, Clock, Shield, Globe } from "lucide-react";

const features = [
  {
    icon: Video,
    title: "HD Video Consultations",
    description: "Crystal clear video calls with specialists worldwide"
  },
  {
    icon: Clock,
    title: "Available 24/7",
    description: "Book consultations across different time zones"
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "HIPAA-compliant platform ensuring your privacy"
  },
  {
    icon: Globe,
    title: "Global Network",
    description: "Access to 1000+ specialists in 50+ countries"
  }
];

const OnlineConsultation = () => {
  return (
    <section id="consultation" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Get Your Free <span className="text-medical-green">2nd Opinion</span> Online
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Connect with world-class specialists for a comprehensive consultation before making any medical decisions. Our platform ensures you get the expert opinion you deserve.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-medical-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-medical-green" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <Button size="lg" className="bg-medical-green hover:bg-medical-green-dark">
              <Video className="w-5 h-5 mr-2" />
              Start Free Consultation Now
            </Button>
          </div>
          
          <div className="relative">
            <Card className="bg-gradient-to-br from-medical-green to-medical-blue p-8 text-white">
              <CardContent className="p-0">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Video className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">
                    Free Medical Consultation
                  </h3>
                  <p className="opacity-90">
                    Get expert medical advice from our network of specialists
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                    <span>Duration</span>
                    <span className="font-semibold">30 minutes</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                    <span>Cost</span>
                    <span className="font-semibold">FREE</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                    <span>Response Time</span>
                    <span className="font-semibold">Within 24 hours</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-lg">
              FREE
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OnlineConsultation;
