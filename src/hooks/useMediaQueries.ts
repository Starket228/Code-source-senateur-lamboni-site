
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export type MediaItem = {
  id: string;
  title: string;
  category: string;
  date: string;
  thumbnail: string;
  media_type: 'photo' | 'video' | 'audio';
  duration?: string;
  src?: string;
};

export const useMediaQuery = () => {
  return useQuery({
    queryKey: ['media'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching media:', error);
        throw error;
      }

      return data as MediaItem[];
    }
  });
};
