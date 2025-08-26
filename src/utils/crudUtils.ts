
import { supabase } from '@/integrations/supabase/client';
import { handleSupabaseError } from './supabaseUtils';

export interface CrudOperationResult<T = any> {
  success: boolean;
  data?: T;
  error?: any;
}

export class CrudService {
  static async create<T = any>(
    table: string, 
    data: any
  ): Promise<CrudOperationResult<T>> {
    try {
      console.log(`CrudService: Creating in ${table}:`, data);
      
      const { data: result, error } = await supabase
        .from(table as any)
        .insert([data])
        .select()
        .maybeSingle();

      if (error) {
        console.error(`CrudService: Create error in ${table}:`, error);
        handleSupabaseError(error, `la création dans ${table}`);
        return { success: false, error };
      }

      console.log(`CrudService: Create successful in ${table}:`, result);
      return { success: true, data: result as T };
    } catch (error) {
      console.error(`CrudService: Unexpected error during create in ${table}:`, error);
      return { success: false, error };
    }
  }

  static async update<T = any>(
    table: string, 
    id: string, 
    data: any
  ): Promise<CrudOperationResult<T>> {
    try {
      console.log(`CrudService: Starting update in ${table} with id ${id}:`, data);
      
      // Vérifier d'abord si l'enregistrement existe
      const { data: existingRecord, error: checkError } = await supabase
        .from(table as any)
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (checkError) {
        console.error(`CrudService: Error checking existence in ${table}:`, checkError);
        handleSupabaseError(checkError, `la vérification dans ${table}`);
        return { success: false, error: checkError };
      }

      if (!existingRecord) {
        const notFoundError = `Enregistrement avec l'ID ${id} non trouvé dans ${table}`;
        console.warn(`CrudService: ${notFoundError}`);
        return { success: false, error: { message: notFoundError } };
      }

      console.log(`CrudService: Record exists, proceeding with update:`, existingRecord);

      // Supprimer updated_at du data car il sera géré automatiquement par le trigger
      const { updated_at, ...updateData } = data;
      
      // Procéder à la mise à jour
      const { data: result, error } = await supabase
        .from(table as any)
        .update(updateData)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) {
        console.error(`CrudService: Update error in ${table}:`, error);
        handleSupabaseError(error, `la mise à jour dans ${table}`);
        return { success: false, error };
      }

      // Vérifier le résultat de la mise à jour
      if (!result) {
        console.warn(`CrudService: Update returned no data for ${table} with id ${id}, fetching updated record`);
        
        // Récupérer l'enregistrement mis à jour séparément
        const { data: updatedRecord, error: fetchError } = await supabase
          .from(table as any)
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (fetchError) {
          console.error(`CrudService: Error fetching updated record:`, fetchError);
          return { success: false, error: fetchError };
        }

        if (!updatedRecord) {
          console.error(`CrudService: Could not retrieve updated record after update`);
          return { success: false, error: { message: 'Mise à jour effectuée mais impossible de récupérer les données' } };
        }

        console.log(`CrudService: Update successful in ${table}, fetched record:`, updatedRecord);
        return { success: true, data: updatedRecord as T };
      }

      console.log(`CrudService: Update successful in ${table}:`, result);
      return { success: true, data: result as T };
    } catch (error) {
      console.error(`CrudService: Unexpected error during update in ${table}:`, error);
      return { success: false, error };
    }
  }

  static async upsert<T = any>(
    table: string, 
    data: any
  ): Promise<CrudOperationResult<T>> {
    try {
      console.log(`CrudService: Upserting in ${table}:`, data);
      
      const { data: result, error } = await supabase
        .from(table as any)
        .upsert(data, {
          onConflict: 'id'
        })
        .select()
        .maybeSingle();

      if (error) {
        console.error(`CrudService: Upsert error in ${table}:`, error);
        handleSupabaseError(error, `la sauvegarde dans ${table}`);
        return { success: false, error };
      }

      console.log(`CrudService: Upsert successful in ${table}:`, result);
      return { success: true, data: result as T };
    } catch (error) {
      console.error(`CrudService: Unexpected error during upsert in ${table}:`, error);
      return { success: false, error };
    }
  }

  static async delete<T = any>(
    table: string, 
    id: string
  ): Promise<CrudOperationResult<T>> {
    try {
      console.log(`CrudService: Deleting from ${table} with id ${id}`);
      
      // Vérifier d'abord si l'enregistrement existe
      const { data: existingRecord, error: checkError } = await supabase
        .from(table as any)
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (checkError) {
        console.error(`CrudService: Error checking existence for delete in ${table}:`, checkError);
        handleSupabaseError(checkError, `la vérification pour suppression dans ${table}`);
        return { success: false, error: checkError };
      }

      if (!existingRecord) {
        const notFoundError = `Enregistrement avec l'ID ${id} non trouvé dans ${table}`;
        console.warn(`CrudService: ${notFoundError}`);
        return { success: false, error: { message: notFoundError } };
      }

      const { data: result, error } = await supabase
        .from(table as any)
        .delete()
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) {
        console.error(`CrudService: Delete error in ${table}:`, error);
        handleSupabaseError(error, `la suppression dans ${table}`);
        return { success: false, error };
      }

      console.log(`CrudService: Delete successful in ${table}:`, result || existingRecord);
      return { success: true, data: (result || existingRecord) as T };
    } catch (error) {
      console.error(`CrudService: Unexpected error during delete in ${table}:`, error);
      return { success: false, error };
    }
  }

  static async read<T = any>(
    table: string, 
    filters?: Record<string, any>
  ): Promise<CrudOperationResult<T[]>> {
    try {
      console.log(`CrudService: Reading from ${table} with filters:`, filters);
      
      let query = supabase.from(table as any).select('*');
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }
      
      const { data: result, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error(`CrudService: Read error in ${table}:`, error);
        handleSupabaseError(error, `la lecture dans ${table}`);
        return { success: false, error };
      }

      console.log(`CrudService: Read successful in ${table}:`, result?.length || 0, 'items');
      return { success: true, data: (result || []) as T[] };
    } catch (error) {
      console.error(`CrudService: Unexpected error during read in ${table}:`, error);
      return { success: false, error };
    }
  }

  static async readOne<T = any>(
    table: string, 
    id: string
  ): Promise<CrudOperationResult<T>> {
    try {
      console.log(`CrudService: Reading one from ${table} with id ${id}`);
      
      const { data: result, error } = await supabase
        .from(table as any)
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error(`CrudService: ReadOne error in ${table}:`, error);
        handleSupabaseError(error, `la lecture dans ${table}`);
        return { success: false, error };
      }

      if (!result) {
        const notFoundError = `Enregistrement avec l'ID ${id} non trouvé dans ${table}`;
        console.warn(`CrudService: ${notFoundError}`);
        return { success: false, error: { message: notFoundError } };
      }

      console.log(`CrudService: ReadOne successful in ${table}:`, result);
      return { success: true, data: result as T };
    } catch (error) {
      console.error(`CrudService: Unexpected error during readOne in ${table}:`, error);
      return { success: false, error };
    }
  }
}
