
-- Créer les buckets de stockage manquants pour les documents, images et médias
DO $$
BEGIN
    -- Créer le bucket documents s'il n'existe pas
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'documents') THEN
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES (
            'documents',
            'documents',
            true,
            10485760, -- 10MB limit
            ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
        );
    END IF;

    -- Créer le bucket images s'il n'existe pas
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'images') THEN
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES (
            'images',
            'images',
            true,
            5242880, -- 5MB limit
            ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        );
    END IF;

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

-- Créer les politiques RLS pour le bucket documents
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Allow public read access on documents') THEN
        CREATE POLICY "Allow public read access on documents"
        ON storage.objects FOR SELECT
        USING (bucket_id = 'documents');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Allow public insert on documents') THEN
        CREATE POLICY "Allow public insert on documents"
        ON storage.objects FOR INSERT
        WITH CHECK (bucket_id = 'documents');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Allow public update on documents') THEN
        CREATE POLICY "Allow public update on documents"
        ON storage.objects FOR UPDATE
        USING (bucket_id = 'documents');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Allow public delete on documents') THEN
        CREATE POLICY "Allow public delete on documents"
        ON storage.objects FOR DELETE
        USING (bucket_id = 'documents');
    END IF;
END $$;

-- Créer les politiques RLS pour le bucket images
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Allow public read access on images') THEN
        CREATE POLICY "Allow public read access on images"
        ON storage.objects FOR SELECT
        USING (bucket_id = 'images');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Allow public insert on images') THEN
        CREATE POLICY "Allow public insert on images"
        ON storage.objects FOR INSERT
        WITH CHECK (bucket_id = 'images');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Allow public update on images') THEN
        CREATE POLICY "Allow public update on images"
        ON storage.objects FOR UPDATE
        USING (bucket_id = 'images');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Allow public delete on images') THEN
        CREATE POLICY "Allow public delete on images"
        ON storage.objects FOR DELETE
        USING (bucket_id = 'images');
    END IF;
END $$;

-- Créer les politiques RLS pour le bucket media
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
