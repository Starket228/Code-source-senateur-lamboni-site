
CREATE TABLE public.about_domains (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT 'Briefcase',
  color text NOT NULL DEFAULT 'blue',
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.about_domains ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to about_domains"
  ON public.about_domains FOR SELECT USING (true);

CREATE POLICY "Allow all operations on about_domains"
  ON public.about_domains FOR ALL USING (true) WITH CHECK (true);

CREATE TRIGGER update_about_domains_updated_at
  BEFORE UPDATE ON public.about_domains
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.about_domains (title, description, icon, color, order_index) VALUES
  ('Législation & Droit', 'Participation active à l''élaboration des lois et textes juridiques au service du peuple.', 'Scale', 'blue', 1),
  ('Développement Rural', 'Promotion du développement des zones rurales et amélioration des conditions de vie des populations.', 'Sprout', 'green', 2),
  ('Éducation & Formation', 'Soutien aux initiatives éducatives et aux programmes de formation professionnelle.', 'GraduationCap', 'purple', 3),
  ('Santé Publique', 'Engagement pour l''accès aux soins de santé de qualité pour tous les citoyens.', 'HeartPulse', 'red', 4),
  ('Infrastructure', 'Plaidoyer pour le développement des infrastructures et l''amélioration du cadre de vie.', 'Building2', 'orange', 5),
  ('Diplomatie & Relations', 'Contribution au renforcement des relations diplomatiques et de la coopération internationale.', 'Globe', 'indigo', 6);
