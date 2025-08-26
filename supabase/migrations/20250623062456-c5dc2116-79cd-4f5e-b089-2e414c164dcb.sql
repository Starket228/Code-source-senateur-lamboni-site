
-- Activer RLS sur la table hero_section si ce n'est pas déjà fait
ALTER TABLE public.hero_section ENABLE ROW LEVEL SECURITY;

-- Créer des politiques RLS complètes pour la table hero_section
CREATE POLICY "Allow insert operations on hero_section" ON public.hero_section
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow select operations on hero_section" ON public.hero_section
FOR SELECT USING (true);

CREATE POLICY "Allow update operations on hero_section" ON public.hero_section
FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow delete operations on hero_section" ON public.hero_section
FOR DELETE USING (true);

-- Activer la réplication complète pour les mises à jour en temps réel
ALTER TABLE public.hero_section REPLICA IDENTITY FULL;

-- Ajouter la table à la publication realtime si elle n'y est pas déjà
ALTER PUBLICATION supabase_realtime ADD TABLE public.hero_section;

-- Créer le trigger pour la table hero_section (mise à jour automatique de updated_at)
DROP TRIGGER IF EXISTS update_hero_section_updated_at ON public.hero_section;
CREATE TRIGGER update_hero_section_updated_at
    BEFORE UPDATE ON public.hero_section
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
