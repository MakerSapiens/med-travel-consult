
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Video, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const FeaturedDoctors = () => {
  const { data: doctors, isLoading } = useQuery({
    queryKey: ['featured-doctors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('doctors')
        .select(`
          *,
          hospitals (
            name
          )
        `)
        .limit(6);
      
      if (error) throw error;
      return data;
    },
  });

  // Add the two new doctors at the beginning
  const featuredDoctors = [
    {
      id: 'dr-shruti',
      first_name: 'Dr. Shruti',
      last_name: '',
      specialty: 'Gynaecologist',
      hospitals: { name: 'International Women\'s Hospital' },
      bio: 'Experienced gynaecologist specializing in women\'s reproductive health and minimally invasive procedures.',
      avatar_url: '/lovable-uploads/0e69e9c2-41dc-4d19-b381-04ed3250e232.png',
      consultation_fee: 180
    },
    {
      id: 'dr-aniket',
      first_name: 'Dr. Aniket',
      last_name: '',
      specialty: 'General Surgeon',
      hospitals: { name: 'Advanced Surgical Center' },
      bio: 'Skilled general surgeon with expertise in laparoscopic surgery and emergency procedures.',
      avatar_url: '/lovable-uploads/dc259089-4bf2-49a7-ae7c-2e28a5e342fb.png',
      consultation_fee: 200
    }
  ];

  // Combine with existing doctors from database
  const allDoctors = [...featuredDoctors, ...(doctors || [])].slice(0, 6);

  if (isLoading) {
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-t-lg"></div>
                <div className="bg-gray-100 p-6 rounded-b-lg">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allDoctors?.map((doctor) => (
            <Card key={doctor.id} className="overflow-hidden hover-scale">
              <div className="relative">
                <img
                  src={doctor.avatar_url || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face"}
                  alt={`${doctor.first_name} ${doctor.last_name}`}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-medical-green text-white">
                    International
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="flex items-center space-x-1 bg-white/90 rounded-full px-2 py-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">4.9</span>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-1">
                  {doctor.first_name} {doctor.last_name}
                </h3>
                <p className="text-medical-blue font-medium mb-2">
                  {doctor.specialty}
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  {doctor.hospitals?.name || 'International Hospital'}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>15+ years exp.</span>
                  <span>150+ reviews</span>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Languages:</p>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">English</Badge>
                    <Badge variant="outline" className="text-xs">Hindi</Badge>
                    <Badge variant="outline" className="text-xs">Local</Badge>
                  </div>
                </div>
                
                <p className="text-xs text-medical-green font-medium mb-4">
                  ${doctor.consultation_fee || 150}/consultation
                </p>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Video className="w-4 h-4 mr-1" />
                    Consult
                  </Button>
                  <Link to={`/doctor/${doctor.id}`} className="flex-1">
                    <Button size="sm" className="w-full bg-medical-green hover:bg-medical-green-dark">
                      <Calendar className="w-4 h-4 mr-1" />
                      Book
                    </Button>
                  </Link>
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
