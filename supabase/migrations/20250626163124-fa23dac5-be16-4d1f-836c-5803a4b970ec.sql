
-- Add user_id to doctors table to link with auth.users (if not exists)
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Create doctor credentials table for storing qualifications and documents
CREATE TABLE public.doctor_credentials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE NOT NULL,
  credential_type TEXT NOT NULL, -- 'degree', 'license', 'certification', etc.
  institution TEXT NOT NULL,
  credential_name TEXT NOT NULL,
  year_obtained INTEGER,
  document_url TEXT, -- for storing uploaded documents
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for doctor_credentials
ALTER TABLE public.doctor_credentials ENABLE ROW LEVEL SECURITY;

-- RLS Policies for doctor_credentials
CREATE POLICY "Doctors can view their own credentials" 
  ON public.doctor_credentials 
  FOR SELECT 
  USING (
    doctor_id IN (
      SELECT id FROM public.doctors WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can create their own credentials" 
  ON public.doctor_credentials 
  FOR INSERT 
  WITH CHECK (
    doctor_id IN (
      SELECT id FROM public.doctors WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can update their own credentials" 
  ON public.doctor_credentials 
  FOR UPDATE 
  USING (
    doctor_id IN (
      SELECT id FROM public.doctors WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can delete their own credentials" 
  ON public.doctor_credentials 
  FOR DELETE 
  USING (
    doctor_id IN (
      SELECT id FROM public.doctors WHERE user_id = auth.uid()
    )
  );

-- Add RLS policies for doctors table
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Doctors can view their own profile" 
  ON public.doctors 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Doctors can update their own profile" 
  ON public.doctors 
  FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "Doctors can create their own profile" 
  ON public.doctors 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Public can view doctor profiles" 
  ON public.doctors 
  FOR SELECT 
  USING (true);

-- Add status column to doctors table for approval workflow
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended'));

-- Update profiles table to include doctor role
ALTER TABLE public.profiles ALTER COLUMN user_role DROP DEFAULT;
ALTER TABLE public.profiles ALTER COLUMN user_role SET DEFAULT 'patient';
-- Add check constraint to allow doctor role
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_role_check CHECK (user_role IN ('patient', 'doctor', 'admin'));
