-- Add user_class to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS user_class VARCHAR(20) DEFAULT 'standard' CHECK (user_class IN ('standard', 'legacy'));

-- Add referral tracking columns
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS referral_source VARCHAR(255),
ADD COLUMN IF NOT EXISTS agent_id UUID REFERENCES auth.users(id);

-- Create index for agent lookups
CREATE INDEX IF NOT EXISTS idx_profiles_agent_id ON public.profiles(agent_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user_class ON public.profiles(user_class);

-- Update RLS policies to include user_class
-- Users can read their own profile including user_class
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile except user_class (set during signup)
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Function to set user_class during signup based on metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, user_class, referral_source)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    COALESCE(new.raw_user_meta_data->>'user_class', 'standard'),
    new.raw_user_meta_data->>'referral_source'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();