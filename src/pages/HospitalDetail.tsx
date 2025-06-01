
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Star, Calendar, Users } from 'lucide-react';

// Sample hospital data to use while the types are being updated
const sampleHospitals = [
  {
    id: '1',
    name: 'Bangkok International Hospital',
    description: 'Leading private hospital in Thailand offering world-class medical care with international standards.',
    location: 'Bangkok',
    country: 'Thailand',
    image_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop',
    services: ['Cardiology', 'Orthopedics', 'Plastic Surgery', 'Dental Care'],
    pricing_info: { consultation: 150, surgery_range: '5000-50000' },
    contact_info: { phone: '+66-2-310-3000', email: 'info@bih.co.th' }
  },
  {
    id: '2',
    name: 'Apollo Hospital Delhi',
    description: 'Premier healthcare institution in India providing comprehensive medical services.',
    location: 'New Delhi',
    country: 'India',
    image_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop',
    services: ['Oncology', 'Neurology', 'Transplant Surgery', 'IVF'],
    pricing_info: { consultation: 100, surgery_range: '3000-30000' },
    contact_info: { phone: '+91-11-2692-5858', email: 'info@apollodelhi.com' }
  },
  {
    id: '3',
    name: 'Gleneagles Hospital Singapore',
    description: 'Award-winning private hospital known for excellent patient care and advanced medical technology.',
    location: 'Singapore',
    country: 'Singapore',
    image_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop',
    services: ['Cardiology', 'Oncology', 'Neurosurgery', 'Pediatrics'],
    pricing_info: { consultation: 200, surgery_range: '8000-80000' },
    contact_info: { phone: '+65-6473-7222', email: 'enquiry@gleneagles.com.sg' }
  }
];

const sampleDoctors = [
  {
    id: '1',
    first_name: 'Dr. Somchai',
    last_name: 'Patel',
    specialty: 'Cardiology',
    hospital_id: '1',
    bio: 'Experienced cardiologist with 15+ years of experience in interventional cardiology.',
    consultation_fee: 150
  },
  {
    id: '2',
    first_name: 'Dr. Priya',
    last_name: 'Sharma',
    specialty: 'Oncology',
    hospital_id: '2',
    bio: 'Leading oncologist specializing in breast cancer treatment and research.',
    consultation_fee: 120
  },
  {
    id: '3',
    first_name: 'Dr. Michael',
    last_name: 'Tan',
    specialty: 'Neurosurgery',
    hospital_id: '3',
    bio: 'Renowned neurosurgeon with expertise in brain tumor surgery and spinal procedures.',
    consultation_fee: 250
  }
];

const HospitalDetail = () => {
  const { id } = useParams<{ id: string }>();

  // Use sample data for now while the database types are being updated
  const hospital = sampleHospitals.find(h => h.id === id);
  const hospitalDoctors = sampleDoctors.filter(d => d.hospital_id === id);

  if (!hospital) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Hospital not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hospital Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/3">
              <img
                src={hospital.image_url}
                alt={hospital.name}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            <div className="lg:w-2/3">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{hospital.name}</h1>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{hospital.location}, {hospital.country}</span>
                  </div>
                  <div className="flex items-center mb-4">
                    <div className="flex items-center mr-4">
                      <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                      <span className="text-sm">4.8 (250+ reviews)</span>
                    </div>
                    <Badge className="bg-medical-green text-white">
                      {hospital.country}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 mb-6">{hospital.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hospital.contact_info.phone && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-medical-green mr-2" />
                    <span className="text-sm">{hospital.contact_info.phone}</span>
                  </div>
                )}
                {hospital.contact_info.email && (
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 text-medical-green mr-2" />
                    <span className="text-sm">{hospital.contact_info.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Services */}
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Medical Services</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {hospital.services.map((service: string, index: number) => (
                    <Badge key={index} variant="outline" className="justify-center py-2">
                      {service}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Doctors */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Specialists</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hospitalDoctors.map((doctor) => (
                    <div key={doctor.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="font-bold text-lg text-gray-800">{doctor.first_name} {doctor.last_name}</h3>
                      <p className="text-medical-blue font-medium">{doctor.specialty}</p>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{doctor.bio}</p>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-sm font-medium text-medical-green">
                          ${doctor.consultation_fee}/consultation
                        </span>
                        <Link to={`/doctor/${doctor.id}`}>
                          <Button size="sm" variant="outline">
                            <Calendar className="w-4 h-4 mr-1" />
                            Book
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pricing & Contact */}
          <div>
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Pricing Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Consultation:</span>
                    <span className="font-medium">${hospital.pricing_info.consultation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Surgery Range:</span>
                    <span className="font-medium">${hospital.pricing_info.surgery_range}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button className="w-full bg-medical-green hover:bg-medical-green-dark">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Consultation
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Users className="w-4 h-4 mr-2" />
                    View All Doctors
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalDetail;
