
-- Créer la table pour les événements à venir
CREATE TABLE public.upcoming_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location TEXT NOT NULL,
  image TEXT,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer la table pour les photos d'événements
CREATE TABLE public.event_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  event_id UUID REFERENCES public.upcoming_events(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  photographer TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS sur les deux tables
ALTER TABLE public.upcoming_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_photos ENABLE ROW LEVEL SECURITY;

-- Créer des politiques RLS pour upcoming_events
CREATE POLICY "Allow all operations on upcoming_events" ON public.upcoming_events
FOR ALL USING (true) WITH CHECK (true);

-- Créer des politiques RLS pour event_photos
CREATE POLICY "Allow all operations on event_photos" ON public.event_photos
FOR ALL USING (true) WITH CHECK (true);

-- Activer la réplication pour les mises à jour en temps réel
ALTER TABLE public.upcoming_events REPLICA IDENTITY FULL;
ALTER TABLE public.event_photos REPLICA IDENTITY FULL;

-- Ajouter les tables à la publication realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.upcoming_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.event_photos;

-- Créer les triggers pour la mise à jour automatique de updated_at
CREATE TRIGGER update_upcoming_events_updated_at
    BEFORE UPDATE ON public.upcoming_events
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_event_photos_updated_at
    BEFORE UPDATE ON public.event_photos
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insérer quelques données d'exemple pour les événements à venir
INSERT INTO public.upcoming_events (title, description, date, time, location, category, image) VALUES
('Assemblée Générale 2025', 'Assemblée générale annuelle de l''association avec présentation du bilan et des projets futurs.', '2025-03-15', '14:00', 'Salle de conférence, Mairie de Paris', 'Assemblée', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500'),
('Conférence sur l''Environnement', 'Conférence sur les enjeux environnementaux actuels et les solutions durables.', '2025-04-20', '10:30', 'Amphithéâtre Université Sorbonne', 'Conférence', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'),
('Formation Leadership', 'Session de formation sur le leadership et la gestion d''équipe pour les membres actifs.', '2025-05-10', '09:00', 'Centre de formation CNAM', 'Formation', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500');

-- Insérer quelques données d'exemple pour les photos d'événements
INSERT INTO public.event_photos (title, description, image_url, date, photographer) VALUES
('Cérémonie d''ouverture 2024', 'Photos de la cérémonie d''ouverture de l''année 2024 avec tous les membres présents.', 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=500', '2024-01-15', 'Marie Dubois'),
('Atelier de formation', 'Images de l''atelier de formation organisé en février sur les nouvelles technologies.', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500', '2024-02-20', 'Jean Martin'),
('Réunion mensuelle', 'Photos de la réunion mensuelle de mars avec présentation des résultats trimestriels.', 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=500', '2024-03-12', 'Sophie Laurent'),
('Événement communautaire', 'Images de l''événement communautaire organisé au parc avec les familles des membres.', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500', '2024-04-05', 'Pierre Durand'),
('Conférence annuelle', 'Photos de la conférence annuelle avec les intervenants experts et les participants.', 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=500', '2024-05-18', 'Marie Dubois');
