
import { supabase } from '@/integrations/supabase/client';

export interface UploadResult {
  success: boolean;
  data?: {
    url: string;
    path: string;
  };
  error?: string;
}

export class StorageService {
  /**
   * Upload un fichier vers un bucket Supabase
   */
  static async uploadFile(
    bucket: 'images' | 'media' | 'documents',
    file: File,
    path?: string
  ): Promise<UploadResult> {
    try {
      // Sanitize filename: remove accents, special chars, spaces
      const sanitize = (name: string) =>
        name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9._-]/g, '-');
      const fileName = path || `${Date.now()}-${Math.random().toString(36).substring(2)}-${sanitize(file.name)}`;
      
      console.log(`StorageService: Uploading file ${fileName} to bucket ${bucket}`);
      
      // Upload du fichier
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('StorageService: Upload error:', error);
        return {
          success: false,
          error: error.message
        };
      }

      // Obtenir l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      console.log('StorageService: File uploaded successfully:', publicUrl);

      return {
        success: true,
        data: {
          url: publicUrl,
          path: fileName
        }
      };
    } catch (error) {
      console.error('StorageService: Unexpected error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inattendue lors de l\'upload'
      };
    }
  }

  /**
   * Supprime un fichier d'un bucket
   */
  static async deleteFile(
    bucket: 'images' | 'media' | 'documents',
    path: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`StorageService: Deleting file ${path} from bucket ${bucket}`);
      
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) {
        console.error('StorageService: Delete error:', error);
        return {
          success: false,
          error: error.message
        };
      }

      console.log('StorageService: File deleted successfully');
      return { success: true };
    } catch (error) {
      console.error('StorageService: Unexpected error during delete:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inattendue lors de la suppression'
      };
    }
  }

  /**
   * Liste les fichiers d'un bucket
   */
  static async listFiles(
    bucket: 'images' | 'media' | 'documents',
    folder?: string
  ) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(folder || '', {
          limit: 100,
          offset: 0
        });

      if (error) {
        console.error('StorageService: List error:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error('StorageService: Unexpected error during list:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inattendue'
      };
    }
  }

  /**
   * Valide un fichier avant upload
   */
  static validateFile(
    file: File,
    bucket: 'images' | 'media' | 'documents'
  ): { valid: boolean; error?: string } {
    const limits = {
      images: {
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      },
      media: {
        maxSize: 50 * 1024 * 1024, // 50MB
        allowedTypes: [
          'image/jpeg', 'image/png', 'image/gif', 'image/webp',
          'video/mp4', 'video/webm', 'audio/mp3', 'audio/wav', 'audio/ogg'
        ]
      },
      documents: {
        maxSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain'
        ]
      }
    };

    const config = limits[bucket];

    // Vérifier la taille
    if (file.size > config.maxSize) {
      return {
        valid: false,
        error: `Le fichier est trop volumineux. Taille maximum: ${Math.round(config.maxSize / 1024 / 1024)}MB`
      };
    }

    // Vérifier le type
    if (!config.allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Type de fichier non autorisé. Types acceptés: ${config.allowedTypes.join(', ')}`
      };
    }

    return { valid: true };
  }
}
