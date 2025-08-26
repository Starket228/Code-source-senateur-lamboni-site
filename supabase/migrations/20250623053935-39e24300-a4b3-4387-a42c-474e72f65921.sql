
-- Activer RLS sur la table news si ce n'est pas déjà fait
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- Créer des politiques RLS pour permettre toutes les opérations (site public)
CREATE POLICY "Allow all operations on news" ON public.news
FOR ALL USING (true)
WITH CHECK (true);

-- Créer une fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Créer le trigger pour la table news
DROP TRIGGER IF EXISTS update_news_updated_at ON public.news;
CREATE TRIGGER update_news_updated_at
    BEFORE UPDATE ON public.news
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- S'assurer que la réplication complète est activée pour les mises à jour en temps réel
ALTER TABLE public.news REPLICA IDENTITY FULL;

-- Ajouter la table à la publication realtime si elle n'y est pas déjà
ALTER PUBLICATION supabase_realtime ADD TABLE public.news;
