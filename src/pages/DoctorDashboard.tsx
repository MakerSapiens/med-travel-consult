
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, User, FileText, Settings, Video, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const DoctorDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: doctorProfile } = useQuery({
    queryKey: ['doctor-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: consultationRequests, isLoading: requestsLoading } = useQuery({
    queryKey: ['doctor-consultation-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('consultation_requests')
        .select(`
          *,
          profiles!consultation_requests_user_id_fkey(
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const updateRequestMutation = useMutation({
    mutationFn: async ({ requestId, status, doctorId }: { requestId: string; status: string; doctorId?: string }) => {
      const updateData: any = { status, updated_at: new Date().toISOString() };
      if (doctorId) updateData.doctor_id = doctorId;

      const { error } = await supabase
        .from('consultation_requests')
        .update(updateData)
        .eq('id', requestId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor-consultation-requests'] });
      toast.success('Request updated successfully');
    },
    onError: (error) => {
      console.error('Error updating request:', error);
      toast.error('Failed to update request');
    },
  });

  const handleAcceptRequest = (requestId: string) => {
    if (!doctorProfile?.id) {
      toast.error('Doctor profile not found');
      return;
    }
    updateRequestMutation.mutate({ 
      requestId, 
      status: 'accepted', 
      doctorId: doctorProfile.id 
    });
  };

  const handleRejectRequest = (requestId: string) => {
    updateRequestMutation.mutate({ requestId, status: 'rejected' });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  if (!doctorProfile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Complete Your Doctor Profile</h2>
              <p className="text-gray-600 mb-6">You need to create your doctor profile to access the dashboard.</p>
              <Button onClick={() => navigate('/doctor-registration')}>
                Create Doctor Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const pendingRequests = consultationRequests?.filter(req => req.status === 'pending') || [];
  const acceptedRequests = consultationRequests?.filter(req => req.status === 'accepted' && req.doctor_id === doctorProfile.id) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Dr. {doctorProfile.first_name} {doctorProfile.last_name}
            </h1>
            <p className="text-gray-600">{doctorProfile.specialty}</p>
            <Badge className={
              doctorProfile.status === 'approved' 
                ? 'bg-green-100 text-green-800 mt-2' 
                : 'bg-yellow-100 text-yellow-800 mt-2'
            }>
              {doctorProfile.status}
            </Badge>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <Settings className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageSquare className="w-8 h-8 text-blue-500 mr-4" />
                <div>
                  <p className="text-2xl font-bold text-gray-800">{pendingRequests.length}</p>
                  <p className="text-sm text-gray-600">Pending Requests</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-green-500 mr-4" />
                <div>
                  <p className="text-2xl font-bold text-gray-800">{acceptedRequests.length}</p>
                  <p className="text-sm text-gray-600">Accepted</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <User className="w-8 h-8 text-purple-500 mr-4" />
                <div>
                  <p className="text-2xl font-bold text-gray-800">{consultationRequests?.length || 0}</p>
                  <p className="text-sm text-gray-600">Total Requests</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="requests" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="requests">Consultation Requests</TabsTrigger>
            <TabsTrigger value="accepted">My Consultations</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>
          
          <TabsContent value="requests" className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Pending Consultation Requests</h3>
            {requestsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
                ))}
              </div>
            ) : pendingRequests.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No pending requests</h3>
                  <p className="text-gray-600">New consultation requests will appear here</p>
                </CardContent>
              </Card>
            ) : (
              pendingRequests.map((request) => (
                <Card key={request.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg">{request.title}</h3>
                        <p className="text-gray-600 mt-1">
                          Patient: {request.profiles?.first_name} {request.profiles?.last_name}
                        </p>
                        {request.description && (
                          <p className="text-gray-600 mt-2">{request.description}</p>
                        )}
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        {request.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>
                          Preferred: {format(new Date(request.preferred_date), 'PPP')} 
                          {' '}from {request.preferred_time_start} to {request.preferred_time_end}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Video className="w-4 h-4 mr-2" />
                        <span>Meeting Link: {request.meet_link}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>Requested: {format(new Date(request.created_at), 'PPp')}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleAcceptRequest(request.id)}
                        className="bg-green-600 hover:bg-green-700"
                        disabled={updateRequestMutation.isPending}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Accept
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => handleRejectRequest(request.id)}
                        disabled={updateRequestMutation.isPending}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Decline
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="accepted" className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">My Accepted Consultations</h3>
            {acceptedRequests.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No accepted consultations</h3>
                  <p className="text-gray-600">Consultations you accept will appear here</p>
                </CardContent>
              </Card>
            ) : (
              acceptedRequests.map((request) => (
                <Card key={request.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg">{request.title}</h3>
                        <p className="text-gray-600 mt-1">
                          Patient: {request.profiles?.first_name} {request.profiles?.last_name}
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        Accepted
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>
                          {format(new Date(request.preferred_date), 'PPP')} 
                          {' '}from {request.preferred_time_start} to {request.preferred_time_end}
                        </span>
                      </div>
                    </div>

                    <Button 
                      onClick={() => window.open(request.meet_link, '_blank')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Join Meeting
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="profile">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Doctor Profile</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <p className="text-gray-900">Dr. {doctorProfile.first_name} {doctorProfile.last_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                    <p className="text-gray-900">{doctorProfile.specialty}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <p className="text-gray-900">{doctorProfile.bio || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee</label>
                    <p className="text-gray-900">${doctorProfile.consultation_fee || 150}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <Badge className={
                      doctorProfile.status === 'approved' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }>
                      {doctorProfile.status}
                    </Badge>
                  </div>
                  <Button variant="outline" onClick={() => navigate('/doctor-profile-edit')}>
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DoctorDashboard;
