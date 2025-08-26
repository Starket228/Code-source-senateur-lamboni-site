
-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('news', 'programs', 'documents')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(name, type)
);

-- Create trigger to update updated_at
CREATE TRIGGER update_categories_updated_at 
  BEFORE UPDATE ON public.categories 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS (no policies needed as this is public data)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access to categories" 
  ON public.categories 
  FOR SELECT 
  TO public 
  USING (true);

-- Create policy to allow insert/update/delete (you may want to restrict this later)
CREATE POLICY "Allow all operations on categories" 
  ON public.categories 
  FOR ALL 
  TO public 
  USING (true) 
  WITH CHECK (true);
