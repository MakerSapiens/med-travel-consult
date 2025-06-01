
import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, MapPin, Calendar, Video } from 'lucide-react';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    specialty: searchParams.get('specialty') || '',
    destination: searchParams.get('destination') || '',
    treatment: searchParams.get('treatment') || '',
    budget: searchParams.get('budget') || '',
    search: searchParams.get('search') || ''
  });

  const { data: doctors, isLoading: doctorsLoading } = useQuery({
    queryKey: ['search-doctors', filters],
    queryFn: async () => {
      let query = supabase
        .from('doctors')
        .select(`
          *,
          hospitals (
            name,
            location,
            country
          )
        `);

      if (filters.specialty) {
        query = query.ilike('specialty', `%${filters.specialty}%`);
      }

      if (filters.search) {
        query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,specialty.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const { data: hospitals, isLoading: hospitalsLoading } = useQuery({
    queryKey: ['search-hospitals', filters],
    queryFn: async () => {
      let query = supabase
        .from('hospitals')
        .select('*');

      if (filters.destination) {
        query = query.or(`country.ilike.%${filters.destination}%,location.ilike.%${filters.destination}%`);
      }

      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,location.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const updateFilters = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    const newParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) newParams.set(k, v);
    });
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Search Results</h1>
          
          {/* Search Filters */}
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Input
                placeholder="Search doctors, hospitals..."
                value={filters.search}
                onChange={(e) => updateFilters('search', e.target.value)}
              />
              
              <Select value={filters.specialty} onValueChange={(value) => updateFilters('specialty', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Specialties</SelectItem>
                  <SelectItem value="cardiology">Cardiology</SelectItem>
                  <SelectItem value="oncology">Oncology</SelectItem>
                  <SelectItem value="neurosurgery">Neurosurgery</SelectItem>
                  <SelectItem value="orthopedics">Orthopedics</SelectItem>
                  <SelectItem value="gynaecology">Gynaecology</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filters.destination} onValueChange={(value) => updateFilters('destination', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Destination" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Destinations</SelectItem>
                  <SelectItem value="thailand">Thailand</SelectItem>
                  <SelectItem value="singapore">Singapore</SelectItem>
                  <SelectItem value="india">India</SelectItem>
                  <SelectItem value="turkey">Turkey</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filters.treatment} onValueChange={(value) => updateFilters('treatment', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Treatment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Treatments</SelectItem>
                  <SelectItem value="surgery">Surgery</SelectItem>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="therapy">Therapy</SelectItem>
                  <SelectItem value="checkup">Health Checkup</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filters.budget} onValueChange={(value) => updateFilters('budget', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any Budget</SelectItem>
                  <SelectItem value="budget">Under $5,000</SelectItem>
                  <SelectItem value="mid">$5,000 - $15,000</SelectItem>
                  <SelectItem value="premium">$15,000 - $30,000</SelectItem>
                  <SelectItem value="luxury">$30,000+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Doctors */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Doctors ({doctors?.length || 0})</h2>
            {doctorsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {doctors?.map((doctor) => (
                  <Card key={doctor.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <img
                          src={doctor.avatar_url || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80&h=80&fit=crop&crop=face"}
                          alt={`${doctor.first_name} ${doctor.last_name}`}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">{doctor.first_name} {doctor.last_name}</h3>
                          <p className="text-medical-blue font-medium">{doctor.specialty}</p>
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{doctor.hospitals?.name}, {doctor.hospitals?.location}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                              <span className="text-sm">4.9 (150+ reviews)</span>
                            </div>
                            <div className="flex gap-2">
                              <span className="text-medical-green font-medium">${doctor.consultation_fee}/consultation</span>
                              <Link to={`/doctor/${doctor.id}`}>
                                <Button size="sm" className="bg-medical-green hover:bg-medical-green-dark">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  Book
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Hospitals */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Hospitals ({hospitals?.length || 0})</h2>
            {hospitalsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {hospitals?.map((hospital) => (
                  <Card key={hospital.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <img
                          src={hospital.image_url || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=80&h=80&fit=crop"}
                          alt={hospital.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">{hospital.name}</h3>
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{hospital.location}, {hospital.country}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {hospital.services?.slice(0, 3).map((service: string) => (
                              <Badge key={service} variant="outline" className="text-xs">{service}</Badge>
                            ))}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                              <span className="text-sm">4.8 (250+ reviews)</span>
                            </div>
                            <Link to={`/hospital/${hospital.id}`}>
                              <Button size="sm" variant="outline">View Details</Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
