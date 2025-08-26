-- Create about_page table to store About page content
CREATE TABLE public.about_page (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  biography_title TEXT NOT NULL,
  biography_content TEXT NOT NULL,
  biography_image TEXT NOT NULL,
  values_title TEXT NOT NULL,
  values_subtitle TEXT NOT NULL,
  achievements_title TEXT NOT NULL,
  achievements_subtitle TEXT NOT NULL,
  cta_title TEXT NOT NULL,
  cta_subtitle TEXT NOT NULL,
  election_date TEXT NOT NULL,
  election_description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.about_page ENABLE ROW LEVEL SECURITY;

-- Create policies for about_page
CREATE POLICY "Allow public read access to about_page" 
ON public.about_page 
FOR SELECT 
USING (true);

CREATE POLICY "Allow all operations on about_page" 
ON public.about_page 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create about_values table for storing values
CREATE TABLE public.about_values (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.about_values ENABLE ROW LEVEL SECURITY;

-- Create policies for about_values
CREATE POLICY "Allow public read access to about_values" 
ON public.about_values 
FOR SELECT 
USING (true);

CREATE POLICY "Allow all operations on about_values" 
ON public.about_values 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create about_achievements table for storing achievements
CREATE TABLE public.about_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  year TEXT NOT NULL,
  title TEXT NOT NULL,
  items TEXT[] NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.about_achievements ENABLE ROW LEVEL SECURITY;

-- Create policies for about_achievements
CREATE POLICY "Allow public read access to about_achievements" 
ON public.about_achievements 
FOR SELECT 
USING (true);

CREATE POLICY "Allow all operations on about_achievements" 
ON public.about_achievements 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_about_page_updated_at
BEFORE UPDATE ON public.about_page
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_about_values_updated_at
BEFORE UPDATE ON public.about_values
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_about_achievements_updated_at
BEFORE UPDATE ON public.about_achievements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default data for about_page
INSERT INTO public.about_page (
  title, subtitle, biography_title, biography_content, biography_image,
  values_title, values_subtitle, achievements_title, achievements_subtitle,
  cta_title, cta_subtitle, election_date, election_description
) VALUES (
  'À propos du Sénateur LAMBONI Mindi',
  'Découvrez le parcours et les valeurs du Sénateur LAMBONI Mindi, au service du peuple togolais.',
  'Biographie',
  'Né au Togo, le Sénateur LAMBONI Mindi a consacré sa vie au service public et à l''amélioration des conditions de vie des citoyens togolais. Sa vision d''un Togo prospère et équitable guide chacune de ses actions et initiatives législatives. Il est particulièrement engagé dans les domaines de l''éducation, de la santé et du développement rural.',
  '/lovable-uploads/142fb0af-71f6-4ffd-a4bd-8957e1962c78.jpg',
  'Nos Valeurs',
  'Les principes qui guident notre action quotidienne',
  'Nos Réalisations',
  'Un aperçu de nos accomplissements au service du peuple togolais',
  'Construisons ensemble l''avenir du Togo',
  'Votre voix compte. Rejoignez-nous dans cette démarche de développement et de transformation positive de notre nation.',
  '15 février 2024',
  'Élu sénateur, marquant le début d''un mandat dédié au développement et à la prospérité du Togo.'
);

-- Insert default values
INSERT INTO public.about_values (title, description, icon, color) VALUES
('Intégrité', 'Nous agissons avec transparence et honnêteté dans tous nos engagements.', 'Shield', 'blue'),
('Solidarité', 'Nous œuvrons pour l''unité et la cohésion sociale au sein de notre communauté.', 'Heart', 'red'),
('Excellence', 'Nous nous efforçons d''atteindre les plus hauts standards dans notre service public.', 'Star', 'yellow');

-- Insert default achievements
INSERT INTO public.about_achievements (year, title, items, color) VALUES
('2022', 'Année 2022', ARRAY['Lancement du programme de développement rural', 'Création de 500 emplois dans le secteur agricole', 'Amélioration de l''accès à l''eau potable dans 15 villages'], 'blue'),
('2020', 'Année 2020', ARRAY['Construction de 3 écoles primaires', 'Formation de 200 jeunes entrepreneurs', 'Mise en place d''un centre de santé communautaire'], 'purple'),
('2018', 'Année 2018', ARRAY['Réhabilitation de 50 km de routes rurales', 'Électrification de 10 villages', 'Mise en place d''un programme de micro-crédit'], 'red'),
('ongoing', 'Projets en cours', ARRAY['Extension du réseau électrique', 'Programme de bourses d''études', 'Développement de l''agriculture moderne'], 'gradient');