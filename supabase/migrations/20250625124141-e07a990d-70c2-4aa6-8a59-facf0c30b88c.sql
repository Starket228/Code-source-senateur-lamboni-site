
-- Mettre à jour les événements existants pour supprimer les images
UPDATE public.upcoming_events SET image = NULL;

-- Ou si vous préférez, supprimer et recréer les données sans images
DELETE FROM public.upcoming_events;

INSERT INTO public.upcoming_events (title, description, date, time, location, category) VALUES
('Assemblée Générale 2025', 'Assemblée générale annuelle de l''association avec présentation du bilan et des projets futurs.', '2025-03-15', '14:00', 'Salle de conférence, Mairie de Paris', 'Assemblée'),
('Conférence sur l''Environnement', 'Conférence sur les enjeux environnementaux actuels et les solutions durables.', '2025-04-20', '10:30', 'Amphithéâtre Université Sorbonne', 'Conférence'),
('Formation Leadership', 'Session de formation sur le leadership et la gestion d''équipe pour les membres actifs.', '2025-05-10', '09:00', 'Centre de formation CNAM', 'Formation');
