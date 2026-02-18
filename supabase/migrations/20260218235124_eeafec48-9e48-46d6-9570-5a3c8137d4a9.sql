
CREATE TABLE public.about_vision (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL DEFAULT 'Notre Vision',
  subtitle text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT 'Eye',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.about_vision ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to about_vision"
  ON public.about_vision FOR SELECT USING (true);

CREATE POLICY "Allow all operations on about_vision"
  ON public.about_vision FOR ALL USING (true) WITH CHECK (true);

CREATE TRIGGER update_about_vision_updated_at
  BEFORE UPDATE ON public.about_vision
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.about_vision (title, subtitle, content, icon)
VALUES (
  'Notre Vision',
  'Une vision pour le Togo de demain',
  'Notre vision est de construire un Togo prospère, équitable et uni, où chaque citoyen bénéficie d''un accès équitable aux ressources et aux opportunités. Nous œuvrons pour un développement inclusif qui préserve nos valeurs culturelles tout en embrassant le progrès.',
  'Eye'
);
