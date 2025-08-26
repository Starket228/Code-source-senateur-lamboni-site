import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Play, Image as ImageIcon, ArrowRight, Circle, CircleDot } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMediaQuery, type MediaItem } from '@/hooks/useMediaQueries';

const MediaGrid: React.FC = () => {
  
  const { t } = useLanguage();
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  const isMobile = useIsMobile();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: mediaItemsFromDb, isLoading: isLoadingMedia } = useMediaQuery();
  
  // Initialize with fallback media items in case the query is still loading
  const [mediaItems, setMediaItems] = useState([
    {
      type: 'image',
      url: '/lovable-uploads/1382ab96-04a4-448a-ab5f-65c7ab7beea4.jpg',
      title: 'Célébration communautaire',
      supabaseUrl: ''
    },
    {
      type: 'image',
      url: '/lovable-uploads/142fb0af-71f6-4ffd-a4bd-8957e1962c78.jpg',
      title: 'Rencontre citoyenne',
      supabaseUrl: ''
    },
    {
      type: 'image',
      url: '/lovable-uploads/bd23fae5-d7b8-4d3f-97aa-fd3ad3c2a6e2.jpg',
      title: 'Engagement local',
      supabaseUrl: ''
    }
  ]);

  // Update media items when database items are loaded
  useEffect(() => {
    if (mediaItemsFromDb && mediaItemsFromDb.length > 0) {
      // Filter to only include photos
      const photoItems = mediaItemsFromDb
        .filter(item => item.media_type === 'photo')
        .slice(0, 5); // Limit to 5 items to keep the slider manageable
      
      if (photoItems.length > 0) {
        const formattedItems = photoItems.map(item => ({
          type: 'image',
          url: item.thumbnail,
          title: item.title,
          supabaseUrl: item.thumbnail
        }));
        
        setMediaItems(formattedItems);
      }
    }
  }, [mediaItemsFromDb]);

  const fetchVideo = async () => {
    try {
      setIsLoading(true);
      
      const { data: existingFiles, error: fetchError } = await supabase
        .storage
        .from('media')
        .list('videos');
      
      if (fetchError) {
        console.error('Error checking for video:', fetchError);
        throw fetchError;
      }
      
      const senatorVideo = existingFiles?.find(file => 
        file.name === 'senateur-lamboni-video.mp4'
      );
      
      if (senatorVideo) {
        const { data: { publicUrl } } = supabase
          .storage
          .from('media')
          .getPublicUrl('videos/senateur-lamboni-video.mp4');
        
        setVideoUrl(publicUrl);
      } else {
        const response = await fetch('/WhatsApp Video 2025-03-11 at 14.45.53.mp4');
        if (!response.ok) {
          throw new Error('Failed to fetch local video');
        }
        
        const blob = await response.blob();
        const file = new File([blob], 'senateur-lamboni-video.mp4', { type: 'video/mp4' });
        
        await supabase.storage.from('media').upload('videos/.folder', new Blob(['']));
        
        const { error: uploadError } = await supabase
          .storage
          .from('media')
          .upload('videos/senateur-lamboni-video.mp4', file, {
            cacheControl: '3600',
            upsert: true
          });
        
        if (uploadError) {
          console.error('Error uploading video:', uploadError);
          throw uploadError;
        }
        
        const { data: { publicUrl } } = supabase
          .storage
          .from('media')
          .getPublicUrl('videos/senateur-lamboni-video.mp4');
        
        setVideoUrl(publicUrl);
        if (isAdminPage) {
          toast({
            title: "Vidéo enregistrée",
            description: "La vidéo a été téléchargée avec succès sur Supabase",
          });
        }
      }
    } catch (error) {
      console.error('Error in video processing:', error);
      setVideoUrl('/WhatsApp Video 2025-03-11 at 14.45.53.mp4');
      if (isAdminPage) {
        toast({
          title: "Erreur",
          description: "Impossible de télécharger la vidéo. Utilisation de la source locale.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImagesToSupabase = async () => {
    try {
      setIsLoading(true);
      
      const updatedMediaItems = await Promise.all(
        mediaItems.map(async (item) => {
          const fileName = item.url.split('/').pop();
          
          if (!fileName) {
            throw new Error('Invalid file name');
          }

          const { data: existingFiles, error: listError } = await supabase
            .storage
            .from('media')
            .list('images');
          
          if (listError) {
            console.error('Error checking for images:', listError);
            throw listError;
          }
          
          const existingImage = existingFiles?.find(file => 
            file.name === fileName
          );
          
          if (existingImage) {
            const { data: { publicUrl } } = supabase
              .storage
              .from('media')
              .getPublicUrl(`images/${fileName}`);
            
            return { ...item, supabaseUrl: publicUrl };
          } else {
            const response = await fetch(item.url);
            if (!response.ok) {
              throw new Error(`Failed to fetch local image: ${item.url}`);
            }
            
            const blob = await response.blob();
            const file = new File([blob], fileName, { type: 'image/jpeg' });
            
            await supabase.storage.from('media').upload('images/.folder', new Blob(['']));
            
            const { error: uploadError } = await supabase
              .storage
              .from('media')
              .upload(`images/${fileName}`, file, {
                cacheControl: '3600',
                upsert: true
              });
            
            if (uploadError) {
              console.error('Error uploading image:', uploadError);
              throw uploadError;
            }
            
            const { data: { publicUrl } } = supabase
              .storage
              .from('media')
              .getPublicUrl(`images/${fileName}`);
            
            return { ...item, supabaseUrl: publicUrl };
          }
        })
      );
      
      setMediaItems(updatedMediaItems);
      if (isAdminPage) {
        toast({
          title: "Images enregistrées",
          description: "Les images ont été téléchargées avec succès sur Supabase",
        });
      }
    } catch (error) {
      console.error('Error in image processing:', error);
      if (isAdminPage) {
        toast({
          title: "Erreur",
          description: "Impossible de télécharger les images. Utilisation des sources locales.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => 
        prevSlide === mediaItems.length - 1 ? 0 : prevSlide + 1
      );
    }, 5000); // Change slide every 5 seconds
    
    return () => clearInterval(interval);
  }, [mediaItems.length]);

  useEffect(() => {
    fetchVideo();
    uploadImagesToSupabase();
  }, []);

  const handleSliderChange = (values: number[]) => {
    setCurrentSlide(values[0]);
  };

  return (
    <section className="py-12 md:py-24 relative overflow-hidden bg-gradient-to-br from-white to-gray-50">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-32 md:w-64 h-32 md:h-64 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-48 md:w-96 h-48 md:h-96 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/2 w-24 md:w-48 h-24 md:h-48 bg-secondary/10 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 relative inline-block">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary animate-gradient-x">
              Galerie Média
            </span>
            <div className="w-full h-1 md:h-1.5 bg-gradient-to-r from-primary via-accent to-primary rounded-full mt-1 md:mt-2"></div>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-2 md:mt-4 text-base md:text-lg px-2">
            Découvrez nos moments forts en images et vidéos
          </p>
        </div>

        <div className="w-full mb-8 md:mb-16 rounded-xl overflow-hidden shadow-xl transform hover:scale-[1.01] transition-all duration-500 border border-white/20">
          <div className={cn(
            "relative group cursor-pointer",
            isMobile ? "aspect-video" : "aspect-[21/9]"
          )}>
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <video 
                className="w-full h-full object-cover"
                src={videoUrl || '/WhatsApp Video 2025-03-11 at 14.45.53.mp4'}
                controls
                autoPlay
                muted
                loop
                playsInline
              >
                Votre navigateur ne supporte pas la lecture de vidéos.
              </video>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none group-hover:opacity-90 transition-opacity">
              <div className="absolute bottom-0 left-0 p-3 md:p-6 text-white">
                <h3 className="text-lg md:text-2xl font-bold mb-1 md:mb-2 group-hover:translate-y-[-2px] transition-transform line-clamp-2">
                  Les premieres paroles du senateur LAMBONI Mindi
                </h3>
                <p className="text-sm md:text-base text-white/90 group-hover:text-white transition-colors line-clamp-1 md:line-clamp-2">
                  Regardez notre dernière vidéo de présentation
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 md:mb-16">
          <h3 className="text-xl md:text-2xl font-semibold mb-6 md:mb-8 text-center">
            <span className="relative after:content-[''] after:absolute after:w-16 md:after:w-24 after:h-1 after:bg-accent after:left-1/2 after:-translate-x-1/2 after:bottom-[-8px] md:after:bottom-[-10px] after:rounded-full">
              Galerie de photos
            </span>
          </h3>
          
          {/* Multi-image slider display */}
          <div className="relative overflow-hidden rounded-xl shadow-xl mb-4 md:mb-6 border border-white/20">
            <div className="flex gap-2 md:gap-4 h-[200px] md:h-[300px]">
              {!isLoadingMedia && mediaItems.map((item, index) => {
                // Only show current slide and next two slides (or loop back to beginning)
                const isVisible = 
                  index === currentSlide || 
                  index === (currentSlide + 1) % mediaItems.length || 
                  index === (currentSlide + 2) % mediaItems.length;
                
                if (!isVisible) return null;
                
                return (
                  <div 
                    key={index}
                    className={cn(
                      "transition-all duration-500 ease-in-out flex-1 relative overflow-hidden rounded-md",
                      index === currentSlide ? "flex-[1.2]" : "flex-1"
                    )}
                  >
                    <img
                      src={item.supabaseUrl || item.url}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3 text-white bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                      <h3 className="text-sm md:text-base font-semibold line-clamp-1">{item.title}</h3>
                    </div>
                  </div>
                );
              })}
              
              {isLoadingMedia && (
                <div className="flex-1 flex items-center justify-center bg-gray-100 h-full rounded-md">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-center space-x-1 mb-4">
            {mediaItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className="focus:outline-none transition-all"
                aria-label={`Go to slide ${index + 1}`}
              >
                {currentSlide === index ? (
                  <CircleDot className="w-3 h-3 text-primary" />
                ) : (
                  <Circle className="w-3 h-3 text-gray-300 hover:text-gray-400" />
                )}
              </button>
            ))}
          </div>
          
          <div className="text-center text-xs text-gray-500 mb-6">
            <span className="font-medium text-primary">{currentSlide + 1}</span>
            <span> / {mediaItems.length}</span>
          </div>
        </div>

        <div className="text-center">
          <Button asChild variant="outline" className="group relative overflow-hidden hover:border-primary/30 hover:shadow-md transition-all">
            <Link to="/media" className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 text-sm md:text-base">
              <span>Voir plus de médias</span>
              <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 transition-transform group-hover:translate-x-1" />
              <span className="absolute inset-0 w-full h-full bg-primary/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MediaGrid;
