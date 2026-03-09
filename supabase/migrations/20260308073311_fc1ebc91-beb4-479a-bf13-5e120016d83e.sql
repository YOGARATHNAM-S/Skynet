
-- Add auth_id column to users table to link with auth.users
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE;

-- Create index on auth_id
CREATE INDEX IF NOT EXISTS idx_users_auth_id ON public.users(auth_id);

-- Function to auto-create a user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (auth_id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student'::user_role)
  );
  RETURN NEW;
END;
$$;

-- Trigger on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Helper function to get current user's public user id
CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.users WHERE auth_id = auth.uid()
$$;

-- Helper function to get current user's role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.users WHERE auth_id = auth.uid()
$$;

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Public read access" ON public.users;
DROP POLICY IF EXISTS "Public insert access" ON public.users;
DROP POLICY IF EXISTS "Public update access" ON public.users;
DROP POLICY IF EXISTS "Public read access" ON public.epr_records;
DROP POLICY IF EXISTS "Public insert access" ON public.epr_records;
DROP POLICY IF EXISTS "Public update access" ON public.epr_records;
DROP POLICY IF EXISTS "Public read access" ON public.courses;
DROP POLICY IF EXISTS "Public read access" ON public.enrollments;
DROP POLICY IF EXISTS "Public insert access" ON public.enrollments;

-- Users: everyone authenticated can read
CREATE POLICY "Authenticated read users" ON public.users
  FOR SELECT TO authenticated USING (true);

-- Users: can update own profile
CREATE POLICY "Update own profile" ON public.users
  FOR UPDATE TO authenticated USING (auth_id = auth.uid());

-- Courses: authenticated can read
CREATE POLICY "Authenticated read courses" ON public.courses
  FOR SELECT TO authenticated USING (true);

-- Enrollments: authenticated can read
CREATE POLICY "Authenticated read enrollments" ON public.enrollments
  FOR SELECT TO authenticated USING (true);

-- EPR Records: students can only see their own, instructors/admins see all
CREATE POLICY "Role based read eprs" ON public.epr_records
  FOR SELECT TO authenticated USING (
    public.get_current_user_role() IN ('instructor', 'admin')
    OR person_id = public.get_current_user_id()
  );

-- EPR Records: instructors and admins can insert
CREATE POLICY "Instructors create eprs" ON public.epr_records
  FOR INSERT TO authenticated WITH CHECK (
    public.get_current_user_role() IN ('instructor', 'admin')
  );

-- EPR Records: instructors and admins can update
CREATE POLICY "Instructors update eprs" ON public.epr_records
  FOR UPDATE TO authenticated USING (
    public.get_current_user_role() IN ('instructor', 'admin')
  );
