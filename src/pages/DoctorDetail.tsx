
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Star, Video, Clock, User } from 'lucide-react';
import BookingForm from '@/components/BookingForm';

const DoctorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showBooking, setShowBooking] = useState(false);

  const { data: doctor, isLoading } = useQuery({
    queryKey: ['doctor', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const { data: availability } = useQuery({
    queryKey: ['doctor-availability', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('doctor_availability')
        .select('*')
        .eq('doctor_id', id)
        .order('day_of_week');
      if (error) throw error;
      return data;
    },
  });

  const handleBookConsultation = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setShowBooking(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Doctor not found</div>
        </div>
      </div>
    );
  }

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Doctor Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/4">
              <img
                src={doctor.avatar_url || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face"}
                alt={`${doctor.first_name} ${doctor.last_name}`}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            <div className="lg:w-3/4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {doctor.first_name} {doctor.last_name}
                  </h1>
                  <p className="text-xl text-medical-blue font-medium mb-2">{doctor.specialty}</p>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{doctor.hospital || 'International Hospital'}</span>
                  </div>
                  <div className="flex items-center mb-4">
                    <div className="flex items-center mr-4">
                      <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                      <span className="text-sm">4.9 (150+ reviews)</span>
                    </div>
                    <Badge className="bg-medical-green text-white">
                      $150/consultation
                    </Badge>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 mb-6">{doctor.bio}</p>
              
              <div className="flex gap-4">
                <Button 
                  onClick={handleBookConsultation}
                  className="bg-medical-green hover:bg-medical-green-dark"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Appointment
                </Button>
                <Button variant="outline">
                  <Video className="w-4 h-4 mr-2" />
                  Video Consultation
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Availability */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Availability</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availability?.map((slot) => (
                    <div key={slot.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{dayNames[slot.day_of_week]}</span>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-1" />
                          {slot.start_time} - {slot.end_time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Doctor Info */}
          <div>
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Doctor Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <User className="w-4 h-4 text-medical-green mr-2" />
                    <span className="text-sm">15+ years experience</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-medical-green mr-2" />
                    <span className="text-sm">4.9/5 patient rating</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-medical-green mr-2" />
                    <span className="text-sm">Available for online consultations</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">English</Badge>
                  <Badge variant="outline">Hindi</Badge>
                  <Badge variant="outline">Tamil</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && doctor && (
        <BookingForm
          doctor={doctor}
          availability={availability || []}
          onClose={() => setShowBooking(false)}
        />
      )}
    </div>
  );
};

export default DoctorDetail;
