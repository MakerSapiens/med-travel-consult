
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, User, FileText, Settings, Video } from 'lucide-react';
import { format } from 'date-fns';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const { data: appointments, isLoading: appointmentsLoading } = useQuery({
    queryKey: ['user-appointments', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          doctors (
            first_name,
            last_name,
            specialty,
            avatar_url,
            hospitals (
              name,
              location
            )
          )
        `)
        .eq('user_id', user.id)
        .order('appointment_date', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: profile } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const upcomingAppointments = appointments?.filter(apt => 
    new Date(apt.appointment_date) > new Date() && apt.status !== 'cancelled'
  ) || [];

  const pastAppointments = appointments?.filter(apt => 
    new Date(apt.appointment_date) <= new Date() || apt.status === 'completed'
  ) || [];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome back, {profile?.first_name || 'Patient'}!
            </h1>
            <p className="text-gray-600">Manage your appointments and medical records</p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <Settings className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-medical-green mr-4" />
                <div>
                  <p className="text-2xl font-bold text-gray-800">{upcomingAppointments.length}</p>
                  <p className="text-sm text-gray-600">Upcoming</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-medical-blue mr-4" />
                <div>
                  <p className="text-2xl font-bold text-gray-800">{pastAppointments.length}</p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <User className="w-8 h-8 text-medical-green-light mr-4" />
                <div>
                  <p className="text-2xl font-bold text-gray-800">{appointments?.length || 0}</p>
                  <p className="text-sm text-gray-600">Total Visits</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="w-8 h-8 text-yellow-500 mr-4" />
                <div>
                  <p className="text-2xl font-bold text-gray-800">0</p>
                  <p className="text-sm text-gray-600">Reports</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">Upcoming Appointments</TabsTrigger>
            <TabsTrigger value="past">Past Appointments</TabsTrigger>
            <TabsTrigger value="profile">Profile Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="space-y-4">
            {appointmentsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
                ))}
              </div>
            ) : upcomingAppointments.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No upcoming appointments</h3>
                  <p className="text-gray-600 mb-4">Ready to book your next consultation?</p>
                  <Button 
                    onClick={() => navigate('/')}
                    className="bg-medical-green hover:bg-medical-green-dark"
                  >
                    Find Doctors
                  </Button>
                </CardContent>
              </Card>
            ) : (
              upcomingAppointments.map((appointment) => (
                <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <img
                        src={appointment.doctors?.avatar_url || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80&h=80&fit=crop&crop=face"}
                        alt={`${appointment.doctors?.first_name} ${appointment.doctors?.last_name}`}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-lg">
                              {appointment.doctors?.first_name} {appointment.doctors?.last_name}
                            </h3>
                            <p className="text-medical-blue font-medium">{appointment.doctors?.specialty}</p>
                            <p className="text-sm text-gray-600">{appointment.doctors?.hospitals?.name}</p>
                          </div>
                          <Badge 
                            className={
                              appointment.status === 'confirmed' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }
                          >
                            {appointment.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>{format(new Date(appointment.appointment_date), 'PPp')}</span>
                            <Badge variant="outline" className="ml-2">
                              {appointment.consultation_type}
                            </Badge>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Video className="w-4 h-4 mr-1" />
                              Join Call
                            </Button>
                            <Button size="sm" variant="outline">
                              Reschedule
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="past" className="space-y-4">
            {pastAppointments.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No past appointments</h3>
                  <p className="text-gray-600">Your completed consultations will appear here</p>
                </CardContent>
              </Card>
            ) : (
              pastAppointments.map((appointment) => (
                <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <img
                        src={appointment.doctors?.avatar_url || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80&h=80&fit=crop&crop=face"}
                        alt={`${appointment.doctors?.first_name} ${appointment.doctors?.last_name}`}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-lg">
                              {appointment.doctors?.first_name} {appointment.doctors?.last_name}
                            </h3>
                            <p className="text-medical-blue font-medium">{appointment.doctors?.specialty}</p>
                            <p className="text-sm text-gray-600">{appointment.doctors?.hospitals?.name}</p>
                          </div>
                          <Badge className="bg-gray-100 text-gray-800">
                            Completed
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>{format(new Date(appointment.appointment_date), 'PPp')}</span>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <FileText className="w-4 h-4 mr-1" />
                              View Report
                            </Button>
                            <Button size="sm" variant="outline">
                              Book Again
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="profile">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Profile Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <p className="text-gray-900">{profile?.first_name || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <p className="text-gray-900">{profile?.last_name || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">User Role</label>
                    <p className="text-gray-900">{profile?.user_role || 'patient'}</p>
                  </div>
                  <Button variant="outline">Edit Profile</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
