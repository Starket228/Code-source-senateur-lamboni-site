
-- Créer les buckets de stockage nécessaires
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('images', 'images', true),
  ('media', 'media', true),
  ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Politiques RLS pour le bucket images
CREATE POLICY "Allow public uploads to images bucket" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'images');

CREATE POLICY "Allow public access to images bucket" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "Allow public updates to images bucket" ON storage.objects
  FOR UPDATE USING (bucket_id = 'images');

CREATE POLICY "Allow public deletes to images bucket" ON storage.objects
  FOR DELETE USING (bucket_id = 'images');

-- Politiques RLS pour le bucket media
CREATE POLICY "Allow public uploads to media bucket" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'media');

CREATE POLICY "Allow public access to media bucket" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

CREATE POLICY "Allow public updates to media bucket" ON storage.objects
  FOR UPDATE USING (bucket_id = 'media');

CREATE POLICY "Allow public deletes to media bucket" ON storage.objects
  FOR DELETE USING (bucket_id = 'media');

-- Politiques RLS pour le bucket documents
CREATE POLICY "Allow public uploads to documents bucket" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Allow public access to documents bucket" ON storage.objects
  FOR SELECT USING (bucket_id = 'documents');

CREATE POLICY "Allow public updates to documents bucket" ON storage.objects
  FOR UPDATE USING (bucket_id = 'documents');

CREATE POLICY "Allow public deletes to documents bucket" ON storage.objects
  FOR DELETE USING (bucket_id = 'documents');
