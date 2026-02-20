
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CardType, ActivityType, DocumentType, MediaType, HeroDataType, SiteSettingsType } from '@/lib/types';
import { handleSupabaseError } from '@/utils/supabaseUtils';

interface SiteContextType {
  newsCards: CardType[];
  programs: CardType[];
  activities: ActivityType[];
  documents: DocumentType[];
  mediaItems: MediaType[];
  heroData: HeroDataType | null;
  siteSettings: SiteSettingsType | null;
  isLoading: boolean;
  saveToDatabase: (table: 'programs' | 'activities' | 'documents' | 'hero_section' | 'media' | 'news' | 'site_settings', data: any, operation?: 'insert' | 'update' | 'upsert' | 'delete') => Promise<string>;
  refreshData: () => Promise<void>;
  // Legacy properties for compatibility
  hero: HeroDataType | null;
  settings: SiteSettingsType | null;
  setPrograms: React.Dispatch<React.SetStateAction<CardType[]>>;
  setActivities: React.Dispatch<React.SetStateAction<ActivityType[]>>;
  setDocuments: React.Dispatch<React.SetStateAction<DocumentType[]>>;
  setHero: React.Dispatch<React.SetStateAction<HeroDataType | null>>;
  resetToDefault?: () => void;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [newsCards, setNewsCards] = useState<CardType[]>([]);
  const [programs, setPrograms] = useState<CardType[]>([]);
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaType[]>([]);
  const [heroData, setHeroData] = useState<HeroDataType | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettingsType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const saveToDatabase = async (
    table: 'programs' | 'activities' | 'documents' | 'hero_section' | 'media' | 'news' | 'site_settings', 
    data: any, 
    operation: 'insert' | 'update' | 'upsert' | 'delete' = 'upsert'
  ): Promise<string> => {
    setIsLoading(true);
    try {
      console.log(`SiteContext: Executing ${operation} operation on ${table}:`, data);

      let result: any;

      if (operation === 'delete') {
        const { data: deleteResult, error } = await supabase
          .from(table)
          .delete()
          .eq('id', data.id)
          .select()
          .single();

        if (error) {
          console.error(`Error deleting from ${table}:`, error);
          handleSupabaseError(error, `la suppression dans ${table}`);
          throw error;
        }

        result = deleteResult;
      } else if (operation === 'update') {
        const { data: updateResult, error } = await supabase
          .from(table)
          .update(data)
          .eq('id', data.id)
          .select()
          .single();

        if (error) {
          console.error(`Error updating ${table}:`, error);
          handleSupabaseError(error, `la mise à jour dans ${table}`);
          throw error;
        }

        result = updateResult;
      } else if (operation === 'insert') {
        const { data: insertResult, error } = await supabase
          .from(table)
          .insert([data])
          .select()
          .single();

        if (error) {
          console.error(`Error inserting into ${table}:`, error);
          handleSupabaseError(error, `l'insertion dans ${table}`);
          throw error;
        }

        result = insertResult;
      } else { // operation === 'upsert'
        const { data: upsertResult, error } = await supabase
          .from(table)
          .upsert(data, {
            onConflict: 'id'
          })
          .select()
          .single();

        if (error) {
          console.error(`Error upserting into ${table}:`, error);
          handleSupabaseError(error, `la sauvegarde dans ${table}`);
          throw error;
        }

        result = upsertResult;
      }

      console.log(`SiteContext: ${operation} operation successful:`, result);
      return result?.id || '';
    } catch (error) {
      console.error(`SiteContext: Error during ${operation} operation:`, error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = useCallback(async () => {
    console.log('SiteContext: Starting fetchData...');
    setIsLoading(true);
    try {
      console.log('SiteContext: Fetching all data from Supabase...');
      
      const [
        newsResult,
        programsResult,
        activitiesResult,
        documentsResult,
        mediaResult,
        heroResult,
        settingsResult
      ] = await Promise.all([
        supabase.from('news').select('*').order('date', { ascending: false }),
        supabase.from('programs').select('*').order('created_at', { ascending: false }),
        supabase.from('activities').select('*').order('created_at', { ascending: false }),
        supabase.from('documents').select('*').order('created_at', { ascending: false }),
        supabase.from('media').select('*').order('date', { ascending: false }),
        supabase.from('hero_section').select('*').order('created_at', { ascending: false }).limit(1),
        supabase.from('site_settings').select('*').order('created_at', { ascending: false }).limit(1)
      ]);

      // Handle errors and map data correctly
      if (newsResult.error) {
        console.error('SiteContext: Error fetching news:', newsResult.error);
        handleSupabaseError(newsResult.error, 'la récupération des actualités');
      } else {
        console.log('SiteContext: Raw news data from DB:', newsResult.data);
        // Map Supabase data to CardType format avec validation stricte
        const mappedNews = (newsResult.data || []).map(item => ({
          id: item.id,
          title: item.title || '',
          description: item.description || '',
          content: item.content || '',
          image: item.image || '',
          tag: item.tag || '',
          date: item.date || item.created_at || new Date().toISOString(),
          link: item.link || '#'
        }));
        console.log('SiteContext: Mapped news data:', mappedNews);
        setNewsCards(mappedNews);
      }

      if (programsResult.error) {
        console.error('SiteContext: Error fetching programs:', programsResult.error);
        handleSupabaseError(programsResult.error, 'la récupération des programmes');
      } else {
        console.log('SiteContext: Programs data updated:', programsResult.data?.length || 0, 'items');
        // Map Supabase data to CardType format for programs
        const mappedPrograms = (programsResult.data || []).map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          content: '', // Programs don't have content field in DB
          image: item.image,
          tag: item.tag,
          date: item.created_at,
          link: item.link || '#'
        }));
        console.log('SiteContext: Mapped programs data:', mappedPrograms);
        setPrograms(mappedPrograms);
      }

      if (activitiesResult.error) {
        console.error('SiteContext: Error fetching activities:', activitiesResult.error);
        handleSupabaseError(activitiesResult.error, 'la récupération des activités');
      } else {
        console.log('SiteContext: Activities data updated:', activitiesResult.data?.length || 0, 'items');
        // Map Supabase data to ActivityType format
        const mappedActivities = (activitiesResult.data || []).map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          date: {
            day: item.day,
            month: item.month
          }
        }));
        setActivities(mappedActivities);
      }

      if (documentsResult.error) {
        console.error('SiteContext: Error fetching documents:', documentsResult.error);
        handleSupabaseError(documentsResult.error, 'la récupération des documents');
      } else {
        console.log('SiteContext: Documents data updated:', documentsResult.data?.length || 0, 'items');
        const mappedDocuments = (documentsResult.data || []).map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          link: item.link,
          created_at: item.created_at || undefined,
        }));
        setDocuments(mappedDocuments);
      }

      if (mediaResult.error) {
        console.error('SiteContext: Error fetching media:', mediaResult.error);
        handleSupabaseError(mediaResult.error, 'la récupération des médias');
      } else {
        console.log('SiteContext: Media data updated:', mediaResult.data?.length || 0, 'items');
        // Map Supabase data to MediaType format with proper type casting
        const mappedMedia = (mediaResult.data || []).map(item => ({
          id: item.id,
          title: item.title,
          category: item.category,
          date: item.date,
          thumbnail: item.thumbnail,
          media_type: (item.media_type as 'photo' | 'video' | 'audio') || 'photo',
          src: item.src || item.thumbnail,
          duration: item.duration
        }));
        setMediaItems(mappedMedia);
      }

      if (heroResult.error) {
        console.error('SiteContext: Error fetching hero:', heroResult.error);
        handleSupabaseError(heroResult.error, 'la récupération de la section hero');
      } else if (heroResult.data && heroResult.data.length > 0) {
        console.log('SiteContext: Hero data updated');
        const heroItem = heroResult.data[0];
        setHeroData({
          title: heroItem.title,
          description: heroItem.description,
          buttonText: heroItem.button_text,
          backgroundImage: heroItem.background_image
        });
      }

      if (settingsResult.error) {
        console.error('SiteContext: Error fetching settings:', settingsResult.error);
        handleSupabaseError(settingsResult.error, 'la récupération des paramètres');
      } else if (settingsResult.data && settingsResult.data.length > 0) {
        console.log('SiteContext: Settings data updated');
        const settingsItem = settingsResult.data[0];
        setSiteSettings({
          siteName: settingsItem.site_name,
          logoText: settingsItem.logo_text,
          subTitle: settingsItem.sub_title,
          newsTitle: settingsItem.news_title,
          newsSubtitle: settingsItem.news_subtitle,
          programsTitle: settingsItem.programs_title,
          programsSubtitle: settingsItem.programs_subtitle,
          activitiesTitle: settingsItem.activities_title,
          activitiesSubtitle: settingsItem.activities_subtitle,
          documentsTitle: settingsItem.documents_title,
          documentsSubtitle: settingsItem.documents_subtitle,
          // Add default values for other required properties
          general: {
            siteName: settingsItem.site_name || '',
            siteDescription: '',
            siteUrl: '',
            contactEmail: '',
            contactPhone: '',
            address: '',
            logo: '',
            favicon: ''
          },
          social: {
            facebook: '',
            twitter: '',
            instagram: '',
            youtube: '',
            linkedin: ''
          },
          notifications: {
            emailNotifications: false,
            smsNotifications: false,
            pushNotifications: false,
            adminAlerts: false
          },
          security: {
            maintenanceMode: false,
            forceHttps: false,
            loginAttempts: 3,
            sessionTimeout: 30
          },
          appearance: {
            primaryColor: '#000000',
            secondaryColor: '#ffffff',
            fontFamily: 'Inter',
            darkMode: false
          },
          backup: {
            autoBackup: false,
            backupFrequency: 'daily',
            lastBackup: ''
          }
        });
      }

    } catch (error) {
      console.error('SiteContext: Unexpected error during fetchData:', error);
      handleSupabaseError(error, 'la récupération générale des données');
    } finally {
      setIsLoading(false);
      console.log('SiteContext: fetchData completed');
    }
  }, []);

  // Function to force data refresh - optimisée pour éviter les conflits
  const refreshData = useCallback(async () => {
    console.log('SiteContext: Selective refresh requested');
    // Ne plus faire de refresh automatique, laisser les composants gérer leur état localement
  }, []);

  useEffect(() => {
    fetchData();

    // Optimisation des subscriptions en temps réel pour éviter les conflits
    const setupRealtimeSubscriptions = () => {
      console.log('SiteContext: Setting up optimized realtime subscriptions...');

      // Désactiver temporairement les subscriptions temps réel pour éviter les conflits
      // Les composants individuels peuvent gérer leur propre état sans conflicts
      
      return () => {
        console.log('SiteContext: Cleaning up subscriptions...');
      };
    };

    const cleanup = setupRealtimeSubscriptions();
    return cleanup;
  }, [fetchData]);

  const contextValue: SiteContextType = {
    newsCards,
    programs,
    activities,
    documents,
    mediaItems,
    heroData,
    siteSettings,
    isLoading,
    saveToDatabase,
    refreshData,
    // Legacy compatibility
    hero: heroData,
    settings: siteSettings,
    setPrograms,
    setActivities,
    setDocuments,
    setHero: setHeroData,
    resetToDefault: () => {} // Placeholder function
  };

  return (
    <SiteContext.Provider value={contextValue}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error("useSite must be used within a SiteProvider");
  }
  return context;
};
