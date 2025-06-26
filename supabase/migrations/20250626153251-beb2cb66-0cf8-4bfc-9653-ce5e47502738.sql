
-- Create table for consultation requests
CREATE TABLE public.consultation_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  doctor_id UUID REFERENCES public.doctors(id),
  title TEXT NOT NULL,
  description TEXT,
  meet_link TEXT NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time_start TIME NOT NULL,
  preferred_time_end TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for consultation_requests
CREATE POLICY "Users can view their own consultation requests" 
  ON public.consultation_requests 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own consultation requests" 
  ON public.consultation_requests 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own consultation requests" 
  ON public.consultation_requests 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Doctors can view all consultation requests" 
  ON public.consultation_requests 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.doctors 
      WHERE doctors.user_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can update consultation requests" 
  ON public.consultation_requests 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.doctors 
      WHERE doctors.user_id = auth.uid()
    )
  );

-- Add meet_link column to appointments table if it doesn't exist
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS meet_link TEXT;
