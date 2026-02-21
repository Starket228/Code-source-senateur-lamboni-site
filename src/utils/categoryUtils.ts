import { supabase } from '@/integrations/supabase/client';
import { handleSupabaseError } from './supabaseUtils';

export interface Category {
  id: string;
  name: string;
  description?: string;
  type: 'news' | 'programs' | 'documents' | 'media';
  count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CrudOperationResult<T = any> {
  success: boolean;
  data?: T;
  error?: any;
}

export class CategoryService {
  static async getCategories(type: 'news' | 'programs' | 'documents' | 'media'): Promise<CrudOperationResult<Category[]>> {
    try {
      console.log(`CategoryService: Fetching categories for type ${type}`);
      
      const { data: categories, error } = await supabase
        .from('categories')
        .select('*')
        .eq('type', type)
        .order('name', { ascending: true });

      if (error) {
        console.error(`CategoryService: Error fetching categories:`, error);
        handleSupabaseError(error, `la récupération des catégories`);
        return { success: false, error };
      }

      // Get counts for each category with simplified logic
      const categoriesWithCount: Category[] = [];
      
      for (const category of categories || []) {
        let count = 0;
        try {
          if (type === 'news') {
            const { count: itemCount } = await supabase
              .from('news')
              .select('*', { count: 'exact', head: true })
              .eq('tag', category.name);
            count = itemCount || 0;
          } else if (type === 'programs') {
            const { count: itemCount } = await supabase
              .from('programs')
              .select('*', { count: 'exact', head: true })
              .eq('tag', category.name);
            count = itemCount || 0;
          } else if (type === 'documents') {
            const { count: itemCount } = await supabase
              .from('documents')
              .select('*', { count: 'exact', head: true })
              .eq('category', category.name);
            count = itemCount || 0;
          } else if (type === 'media') {
            const { count: itemCount } = await supabase
              .from('media')
              .select('*', { count: 'exact', head: true })
              .eq('category', category.name);
            count = itemCount || 0;
          }
        } catch (error) {
          console.warn(`Error getting count for category ${category.name}:`, error);
        }

        categoriesWithCount.push({
          id: category.id,
          name: category.name,
          description: category.description,
          type: category.type as 'news' | 'programs' | 'documents' | 'media',
          count,
          created_at: category.created_at,
          updated_at: category.updated_at
        });
      }

      console.log(`CategoryService: Found ${categoriesWithCount.length} categories for ${type}`);
      return { success: true, data: categoriesWithCount };
    } catch (error) {
      console.error(`CategoryService: Unexpected error:`, error);
      return { success: false, error };
    }
  }

  static async createCategory(data: { 
    name: string; 
    description?: string; 
    type: 'news' | 'programs' | 'documents' | 'media' 
  }): Promise<CrudOperationResult<Category>> {
    try {
      console.log(`CategoryService: Creating category:`, data);
      
      const { data: result, error } = await supabase
        .from('categories')
        .insert([{
          name: data.name.trim(),
          description: data.description?.trim() || null,
          type: data.type
        }])
        .select()
        .single();

      if (error) {
        console.error(`CategoryService: Create error:`, error);
        handleSupabaseError(error, `la création de la catégorie`);
        return { success: false, error };
      }

      console.log(`CategoryService: Category created successfully:`, result);
      return { 
        success: true, 
        data: {
          id: result.id,
          name: result.name,
          description: result.description,
          type: result.type as 'news' | 'programs' | 'documents' | 'media',
          created_at: result.created_at,
          updated_at: result.updated_at
        } as Category
      };
    } catch (error) {
      console.error(`CategoryService: Unexpected error during create:`, error);
      return { success: false, error };
    }
  }

  static async updateCategory(
    id: string, 
    data: { name: string; description?: string }
  ): Promise<CrudOperationResult<Category>> {
    try {
      console.log(`CategoryService: Updating category ${id}:`, data);
      
      const { data: result, error } = await supabase
        .from('categories')
        .update({
          name: data.name.trim(),
          description: data.description?.trim() || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error(`CategoryService: Update error:`, error);
        handleSupabaseError(error, `la mise à jour de la catégorie`);
        return { success: false, error };
      }

      console.log(`CategoryService: Category updated successfully:`, result);
      return { 
        success: true, 
        data: {
          id: result.id,
          name: result.name,
          description: result.description,
          type: result.type as 'news' | 'programs' | 'documents' | 'media',
          created_at: result.created_at,
          updated_at: result.updated_at
        } as Category
      };
    } catch (error) {
      console.error(`CategoryService: Unexpected error during update:`, error);
      return { success: false, error };
    }
  }

  static async deleteCategory(id: string): Promise<CrudOperationResult<Category>> {
    try {
      console.log(`CategoryService: Deleting category ${id}`);
      
      const { data: result, error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error(`CategoryService: Delete error:`, error);
        handleSupabaseError(error, `la suppression de la catégorie`);
        return { success: false, error };
      }

      console.log(`CategoryService: Category deleted successfully:`, result);
      return { 
        success: true, 
        data: {
          id: result.id,
          name: result.name,
          description: result.description,
          type: result.type as 'news' | 'programs' | 'documents' | 'media',
          created_at: result.created_at,
          updated_at: result.updated_at
        } as Category
      };
    } catch (error) {
      console.error(`CategoryService: Unexpected error during delete:`, error);
      return { success: false, error };
    }
  }

  static async getCategoryOptions(type: 'news' | 'programs' | 'documents' | 'media'): Promise<string[]> {
    try {
      const result = await this.getCategories(type);
      if (result.success && result.data) {
        return result.data.map(cat => cat.name);
      }
      return [];
    } catch (error) {
      console.error('Error getting category options:', error);
      return [];
    }
  }
}
