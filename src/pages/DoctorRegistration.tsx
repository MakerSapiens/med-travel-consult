
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const DoctorRegistration = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    specialty: '',
    bio: '',
    consultation_fee: 150,
    hospital: '',
  });

  const [credentials, setCredentials] = useState([
    {
      credential_type: 'degree',
      institution: '',
      credential_name: '',
      year_obtained: new Date().getFullYear(),
    }
  ]);

  const createDoctorMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      // First update user role to doctor
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ user_role: 'doctor' })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Create doctor profile
      const { data: doctorData, error: doctorError } = await supabase
        .from('doctors')
        .insert({
          user_id: user.id,
          first_name: formData.first_name,
          last_name: formData.last_name,
          specialty: formData.specialty,
          bio: formData.bio,
          consultation_fee: formData.consultation_fee,
          hospital: formData.hospital,
          status: 'pending'
        })
        .select()
        .single();

      if (doctorError) throw doctorError;

      // Add credentials
      if (credentials.length > 0) {
        const credentialData = credentials.map(cred => ({
          doctor_id: doctorData.id,
          credential_type: cred.credential_type,
          institution: cred.institution,
          credential_name: cred.credential_name,
          year_obtained: cred.year_obtained,
        }));

        const { error: credError } = await supabase
          .from('doctor_credentials')
          .insert(credentialData);

        if (credError) throw credError;
      }

      return doctorData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor-profile'] });
      toast.success('Doctor profile created successfully! Awaiting approval.');
      navigate('/doctor-dashboard');
    },
    onError: (error) => {
      console.error('Error creating doctor profile:', error);
      toast.error('Failed to create doctor profile');
    },
  });

  const addCredential = () => {
    setCredentials([...credentials, {
      credential_type: 'degree',
      institution: '',
      credential_name: '',
      year_obtained: new Date().getFullYear(),
    }]);
  };

  const updateCredential = (index: number, field: string, value: string | number) => {
    const updated = [...credentials];
    updated[index] = { ...updated[index], [field]: value };
    setCredentials(updated);
  };

  const removeCredential = (index: number) => {
    setCredentials(credentials.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.first_name || !formData.last_name || !formData.specialty) {
      toast.error('Please fill in all required fields');
      return;
    }
    createDoctorMutation.mutate();
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Doctor Registration
            </h1>
            <p className="text-gray-600">
              Create your professional profile to start offering consultations
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">First Name *</Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name *</Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="specialty">Specialty *</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, specialty: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cardiology">Cardiology</SelectItem>
                      <SelectItem value="Dermatology">Dermatology</SelectItem>
                      <SelectItem value="Endocrinology">Endocrinology</SelectItem>
                      <SelectItem value="Gastroenterology">Gastroenterology</SelectItem>
                      <SelectItem value="General Medicine">General Medicine</SelectItem>
                      <SelectItem value="Gynaecology">Gynaecology</SelectItem>
                      <SelectItem value="Neurology">Neurology</SelectItem>
                      <SelectItem value="Oncology">Oncology</SelectItem>
                      <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                      <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="Psychiatry">Psychiatry</SelectItem>
                      <SelectItem value="Surgery">Surgery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="hospital">Hospital/Clinic</Label>
                  <Input
                    id="hospital"
                    value={formData.hospital}
                    onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                    placeholder="Your affiliated hospital or clinic"
                  />
                </div>

                <div>
                  <Label htmlFor="consultation_fee">Consultation Fee (USD)</Label>
                  <Input
                    id="consultation_fee"
                    type="number"
                    value={formData.consultation_fee}
                    onChange={(e) => setFormData({ ...formData, consultation_fee: parseInt(e.target.value) })}
                    min="0"
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell patients about your experience, specializations, and approach to care..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Credentials */}
            <Card>
              <CardHeader>
                <CardTitle>Professional Credentials</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {credentials.map((credential, index) => (
                  <div key={index} className="border p-4 rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Credential {index + 1}</h4>
                      {credentials.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeCredential(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Type</Label>
                        <Select 
                          value={credential.credential_type}
                          onValueChange={(value) => updateCredential(index, 'credential_type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="degree">Medical Degree</SelectItem>
                            <SelectItem value="license">Medical License</SelectItem>
                            <SelectItem value="certification">Board Certification</SelectItem>
                            <SelectItem value="fellowship">Fellowship</SelectItem>
                            <SelectItem value="residency">Residency</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Year Obtained</Label>
                        <Input
                          type="number"
                          value={credential.year_obtained}
                          onChange={(e) => updateCredential(index, 'year_obtained', parseInt(e.target.value))}
                          min="1950"
                          max={new Date().getFullYear()}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Institution</Label>
                      <Input
                        value={credential.institution}
                        onChange={(e) => updateCredential(index, 'institution', e.target.value)}
                        placeholder="Medical school, hospital, or certifying body"
                      />
                    </div>
                    
                    <div>
                      <Label>Credential Name</Label>
                      <Input
                        value={credential.credential_name}
                        onChange={(e) => updateCredential(index, 'credential_name', e.target.value)}
                        placeholder="e.g., MD, Board Certification in Cardiology"
                      />
                    </div>
                  </div>
                ))}
                
                <Button type="button" variant="outline" onClick={addCredential}>
                  Add Another Credential
                </Button>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button 
                type="submit" 
                className="bg-medical-green hover:bg-medical-green-dark px-8 py-3"
                disabled={createDoctorMutation.isPending}
              >
                {createDoctorMutation.isPending ? 'Creating Profile...' : 'Create Doctor Profile'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorRegistration;
