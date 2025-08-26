
-- Activer RLS sur la table activities si ce n'est pas déjà fait
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Créer des politiques RLS complètes pour la table activities
CREATE POLICY "Allow insert operations on activities" ON public.activities
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow select operations on activities" ON public.activities
FOR SELECT USING (true);

CREATE POLICY "Allow update operations on activities" ON public.activities
FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow delete operations on activities" ON public.activities
FOR DELETE USING (true);

-- Activer la réplication complète pour les mises à jour en temps réel
ALTER TABLE public.activities REPLICA IDENTITY FULL;

-- Ajouter la table à la publication realtime si elle n'y est pas déjà
ALTER PUBLICATION supabase_realtime ADD TABLE public.activities;

-- Créer le trigger pour la table activities (mise à jour automatique de updated_at)
DROP TRIGGER IF EXISTS update_activities_updated_at ON public.activities;
CREATE TRIGGER update_activities_updated_at
    BEFORE UPDATE ON public.activities
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
