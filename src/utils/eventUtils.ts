
import { supabase } from '@/integrations/supabase/client';
import { handleSupabaseError, retryOperation } from '@/utils/supabaseUtils';
import { UpcomingEventType, EventPhotoType } from '@/lib/eventTypes';

export class EventService {
  // Upcoming Events
  static async getUpcomingEvents(): Promise<{ success: boolean; data?: UpcomingEventType[]; error?: string }> {
    try {
      console.log('EventService: Fetching upcoming events...');
      
      const result = await retryOperation(async () => {
        const { data, error } = await supabase
          .from('upcoming_events')
          .select('*')
          .order('date', { ascending: true });
        
        if (error) throw error;
        return data;
      });

      const formattedData: UpcomingEventType[] = result.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        date: item.date,
        time: item.time,
        location: item.location,
        image: item.image,
        category: item.category
      }));

      console.log('EventService: Successfully fetched events:', formattedData.length);
      return { success: true, data: formattedData };
    } catch (error) {
      console.error('EventService: Error fetching events:', error);
      handleSupabaseError(error, 'la récupération des événements');
      return { success: false, error: 'Erreur lors de la récupération des événements' };
    }
  }

  static async createUpcomingEvent(eventData: Omit<UpcomingEventType, 'id'>): Promise<{ success: boolean; data?: UpcomingEventType; error?: string }> {
    try {
      console.log('EventService: Creating upcoming event:', eventData);
      
      const result = await retryOperation(async () => {
        const { data, error } = await supabase
          .from('upcoming_events')
          .insert([eventData])
          .select()
          .single();
        
        if (error) throw error;
        return data;
      });

      const formattedData: UpcomingEventType = {
        id: result.id,
        title: result.title,
        description: result.description,
        date: result.date,
        time: result.time,
        location: result.location,
        image: result.image,
        category: result.category
      };

      console.log('EventService: Event created successfully:', formattedData);
      return { success: true, data: formattedData };
    } catch (error) {
      console.error('EventService: Error creating event:', error);
      handleSupabaseError(error, 'la création de l\'événement');
      return { success: false, error: 'Erreur lors de la création de l\'événement' };
    }
  }

  static async updateUpcomingEvent(id: string, eventData: Partial<UpcomingEventType>): Promise<{ success: boolean; data?: UpcomingEventType; error?: string }> {
    try {
      console.log('EventService: Updating event:', id, eventData);
      
      const result = await retryOperation(async () => {
        const { data, error } = await supabase
          .from('upcoming_events')
          .update(eventData)
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      });

      const formattedData: UpcomingEventType = {
        id: result.id,
        title: result.title,
        description: result.description,
        date: result.date,
        time: result.time,
        location: result.location,
        image: result.image,
        category: result.category
      };

      console.log('EventService: Event updated successfully:', formattedData);
      return { success: true, data: formattedData };
    } catch (error) {
      console.error('EventService: Error updating event:', error);
      handleSupabaseError(error, 'la mise à jour de l\'événement');
      return { success: false, error: 'Erreur lors de la mise à jour de l\'événement' };
    }
  }

  static async deleteUpcomingEvent(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('EventService: Deleting event:', id);
      
      await retryOperation(async () => {
        const { error } = await supabase
          .from('upcoming_events')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
      });

      console.log('EventService: Event deleted successfully');
      return { success: true };
    } catch (error) {
      console.error('EventService: Error deleting event:', error);
      handleSupabaseError(error, 'la suppression de l\'événement');
      return { success: false, error: 'Erreur lors de la suppression de l\'événement' };
    }
  }

  // Event Photos
  static async getEventPhotos(): Promise<{ success: boolean; data?: EventPhotoType[]; error?: string }> {
    try {
      console.log('EventService: Fetching event photos...');
      
      const result = await retryOperation(async () => {
        const { data, error } = await supabase
          .from('event_photos')
          .select('*')
          .order('date', { ascending: false });
        
        if (error) throw error;
        return data;
      });

      const formattedData: EventPhotoType[] = result.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        image_url: item.image_url,
        event_id: item.event_id,
        date: item.date,
        photographer: item.photographer
      }));

      console.log('EventService: Successfully fetched photos:', formattedData.length);
      return { success: true, data: formattedData };
    } catch (error) {
      console.error('EventService: Error fetching photos:', error);
      handleSupabaseError(error, 'la récupération des photos');
      return { success: false, error: 'Erreur lors de la récupération des photos' };
    }
  }

  static async createEventPhoto(photoData: Omit<EventPhotoType, 'id'>): Promise<{ success: boolean; data?: EventPhotoType; error?: string }> {
    try {
      console.log('EventService: Creating event photo:', photoData);
      
      const result = await retryOperation(async () => {
        const { data, error } = await supabase
          .from('event_photos')
          .insert([photoData])
          .select()
          .single();
        
        if (error) throw error;
        return data;
      });

      const formattedData: EventPhotoType = {
        id: result.id,
        title: result.title,
        description: result.description,
        image_url: result.image_url,
        event_id: result.event_id,
        date: result.date,
        photographer: result.photographer
      };

      console.log('EventService: Photo created successfully:', formattedData);
      return { success: true, data: formattedData };
    } catch (error) {
      console.error('EventService: Error creating photo:', error);
      handleSupabaseError(error, 'la création de la photo');
      return { success: false, error: 'Erreur lors de la création de la photo' };
    }
  }

  static async updateEventPhoto(id: string, photoData: Partial<EventPhotoType>): Promise<{ success: boolean; data?: EventPhotoType; error?: string }> {
    try {
      console.log('EventService: Updating photo:', id, photoData);
      
      const result = await retryOperation(async () => {
        const { data, error } = await supabase
          .from('event_photos')
          .update(photoData)
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      });

      const formattedData: EventPhotoType = {
        id: result.id,
        title: result.title,
        description: result.description,
        image_url: result.image_url,
        event_id: result.event_id,
        date: result.date,
        photographer: result.photographer
      };

      console.log('EventService: Photo updated successfully:', formattedData);
      return { success: true, data: formattedData };
    } catch (error) {
      console.error('EventService: Error updating photo:', error);
      handleSupabaseError(error, 'la mise à jour de la photo');
      return { success: false, error: 'Erreur lors de la mise à jour de la photo' };
    }
  }

  static async deleteEventPhoto(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('EventService: Deleting photo:', id);
      
      await retryOperation(async () => {
        const { error } = await supabase
          .from('event_photos')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
      });

      console.log('EventService: Photo deleted successfully');
      return { success: true };
    } catch (error) {
      console.error('EventService: Error deleting photo:', error);
      handleSupabaseError(error, 'la suppression de la photo');
      return { success: false, error: 'Erreur lors de la suppression de la photo' };
    }
  }
}
