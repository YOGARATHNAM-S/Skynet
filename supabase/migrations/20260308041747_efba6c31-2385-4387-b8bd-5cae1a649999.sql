
-- Create enums
CREATE TYPE public.user_role AS ENUM ('student', 'instructor', 'admin');
CREATE TYPE public.enrollment_status AS ENUM ('active', 'completed', 'dropped');
CREATE TYPE public.epr_status AS ENUM ('draft', 'submitted', 'archived');
CREATE TYPE public.role_type AS ENUM ('student', 'instructor');

-- Create users table
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role user_role NOT NULL DEFAULT 'student',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  license_type TEXT NOT NULL,
  total_required_hours NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create enrollments table
CREATE TABLE public.enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status enrollment_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create EPR records table
CREATE TABLE public.epr_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  person_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  evaluator_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role_type role_type NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  overall_rating INTEGER NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
  technical_skills_rating INTEGER NOT NULL CHECK (technical_skills_rating BETWEEN 1 AND 5),
  non_technical_skills_rating INTEGER NOT NULL CHECK (non_technical_skills_rating BETWEEN 1 AND 5),
  remarks TEXT,
  status epr_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT period_end_after_start CHECK (period_end >= period_start)
);

-- Create indexes
CREATE INDEX epr_records_person_idx ON public.epr_records(person_id);
CREATE INDEX epr_records_evaluator_idx ON public.epr_records(evaluator_id);
CREATE INDEX epr_records_period_idx ON public.epr_records(period_start, period_end);
CREATE INDEX enrollments_student_idx ON public.enrollments(student_id);
CREATE INDEX enrollments_course_idx ON public.enrollments(course_id);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.epr_records ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables (mock auth via headers)
CREATE POLICY "Public read access" ON public.users FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON public.users FOR UPDATE USING (true);

CREATE POLICY "Public read access" ON public.courses FOR SELECT USING (true);

CREATE POLICY "Public read access" ON public.enrollments FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON public.enrollments FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read access" ON public.epr_records FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON public.epr_records FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON public.epr_records FOR UPDATE USING (true);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_epr_records_updated_at BEFORE UPDATE ON public.epr_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
