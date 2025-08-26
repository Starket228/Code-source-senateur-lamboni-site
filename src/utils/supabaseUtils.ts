
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const handleSupabaseError = (error: any, operation: string) => {
  console.error(`Supabase error during ${operation}:`, error);
  
  let message = `Erreur lors de ${operation}`;
  
  if (error?.message) {
    if (error.message.includes('duplicate key')) {
      message += ': Un élément avec ces informations existe déjà';
    } else if (error.message.includes('not-null')) {
      message += ': Certains champs obligatoires sont manquants';
    } else if (error.message.includes('foreign key')) {
      message += ': Référence invalide vers un autre élément';
    } else if (error.message.includes('violates row-level security')) {
      message += ': Accès non autorisé aux données';
    } else if (error.code === 'PGRST116') {
      message += ': Enregistrement non trouvé ou déjà supprimé';
    } else {
      message += `: ${error.message}`;
    }
  }
  
  toast({
    title: "Erreur de base de données",
    description: message,
    variant: "destructive",
  });
  
  return error;
};

export const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 2,
  delay: number = 1000
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempting operation, try ${attempt}/${maxRetries}`);
      const result = await operation();
      console.log(`Operation succeeded on attempt ${attempt}`);
      return result;
    } catch (error) {
      lastError = error;
      console.error(`Operation failed on attempt ${attempt}/${maxRetries}:`, error);
      
      // Ne pas réessayer pour certaines erreurs spécifiques
      if (error && typeof error === 'object' && 'code' in error) {
        if (error.code === 'PGRST116' || error.code === '23505') {
          console.log('Non-retryable error detected, throwing immediately');
          throw error;
        }
      }
      
      if (attempt < maxRetries) {
        const waitTime = delay * attempt;
        console.log(`Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  console.error(`Operation failed after ${maxRetries} attempts:`, lastError);
  throw lastError;
};

// Nouvelle fonction pour vérifier la connectivité Supabase
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.from('news').select('count').limit(1);
    if (error) {
      console.error('Supabase connection check failed:', error);
      return false;
    }
    console.log('Supabase connection OK');
    return true;
  } catch (error) {
    console.error('Supabase connection check error:', error);
    return false;
  }
};

// Fonction pour valider les données avant sauvegarde
export const validateNewsData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
    errors.push('Le titre est requis');
  }
  
  if (!data.description || typeof data.description !== 'string' || data.description.trim().length === 0) {
    errors.push('La description est requise');
  }
  
  if (!data.tag || typeof data.tag !== 'string' || data.tag.trim().length === 0) {
    errors.push('La catégorie est requise');
  }
  
  if (!data.image || typeof data.image !== 'string' || data.image.trim().length === 0) {
    errors.push('L\'URL de l\'image est requise');
  }
  
  if (!data.date) {
    errors.push('La date est requise');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
