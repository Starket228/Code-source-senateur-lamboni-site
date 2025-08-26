
// Utilities for consistent date handling across the application
export const formatDateForDisplay = (date: string | Date | null): string => {
  if (!date) return new Date().toISOString().split('T')[0];
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toISOString().split('T')[0];
  } catch (error) {
    console.error('Error formatting date for display:', error);
    return new Date().toISOString().split('T')[0];
  }
};

export const formatDateForSupabase = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toISOString();
  } catch (error) {
    console.error('Error formatting date for Supabase:', error);
    return new Date().toISOString();
  }
};

export const formatDateForUI = (date: string | Date | null): string => {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('fr-FR');
  } catch (error) {
    console.error('Error formatting date for UI:', error);
    return 'N/A';
  }
};
