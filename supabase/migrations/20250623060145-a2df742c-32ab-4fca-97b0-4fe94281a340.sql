
-- Créer des politiques RLS complètes pour la table programs (corrigées)
CREATE POLICY "Allow insert operations on programs" ON public.programs
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update operations on programs" ON public.programs
FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow delete operations on programs" ON public.programs
FOR DELETE USING (true);

-- Activer la réplication complète pour les mises à jour en temps réel
ALTER TABLE public.programs REPLICA IDENTITY FULL;

-- Ajouter la table à la publication realtime si elle n'y est pas déjà
ALTER PUBLICATION supabase_realtime ADD TABLE public.programs;

-- Créer le trigger pour la table programs (mise à jour automatique de updated_at)
DROP TRIGGER IF EXISTS update_programs_updated_at ON public.programs;
CREATE TRIGGER update_programs_updated_at
    BEFORE UPDATE ON public.programs
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
