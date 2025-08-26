
-- Créer le bucket media s'il n'existe pas déjà
DO $$
BEGIN
    -- Créer le bucket media s'il n'existe pas
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'media') THEN
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES (
            'media',
            'media',
            true,
            52428800, -- 50MB limit
            ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'audio/mp3', 'audio/wav', 'audio/ogg']
        );
    END IF;
END $$;

-- Créer les politiques RLS pour le bucket media (uniquement si elles n'existent pas)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Allow public read access on media') THEN
        CREATE POLICY "Allow public read access on media"
        ON storage.objects FOR SELECT
        USING (bucket_id = 'media');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Allow public insert on media') THEN
        CREATE POLICY "Allow public insert on media"
        ON storage.objects FOR INSERT
        WITH CHECK (bucket_id = 'media');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Allow public update on media') THEN
        CREATE POLICY "Allow public update on media"
        ON storage.objects FOR UPDATE
        USING (bucket_id = 'media');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Allow public delete on media') THEN
        CREATE POLICY "Allow public delete on media"
        ON storage.objects FOR DELETE
        USING (bucket_id = 'media');
    END IF;
END $$;
