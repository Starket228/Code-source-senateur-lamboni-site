import React, { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import { useSite } from '@/context/SiteContext';
import { useLanguage } from '@/context/LanguageContext';
import { Calendar, Clock, MapPin, Users, ChevronRight, X, Download, Info, User, CalendarDays, Sparkles, MapPinned, UserRound, PartyPopper, TrendingUp, Filter, Eye, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogClose, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { UpcomingEventType, EventPhotoType } from '@/lib/eventTypes';
import { EventService } from '@/utils/eventUtils';
const Activities = () => {
  const {
    activities
  } = useSite();
  const {
    t
  } = useLanguage();
  const {
    toast
  } = useToast();

  // State pour les événements à venir et photos depuis Supabase
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEventType[]>([]);
  const [eventPhotos, setEventPhotos] = useState<EventPhotoType[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(true);

  // Charger les données depuis Supabase
  useEffect(() => {
    const loadUpcomingEvents = async () => {
      setIsLoadingEvents(true);
      try {
        const result = await EventService.getUpcomingEvents();
        if (result.success && result.data) {
          setUpcomingEvents(result.data);
        }
      } catch (error) {
        console.error('Error loading upcoming events:', error);
      } finally {
        setIsLoadingEvents(false);
      }
    };
    const loadEventPhotos = async () => {
      setIsLoadingPhotos(true);
      try {
        const result = await EventService.getEventPhotos();
        if (result.success && result.data) {
          setEventPhotos(result.data);
        }
      } catch (error) {
        console.error('Error loading event photos:', error);
      } finally {
        setIsLoadingPhotos(false);
      }
    };
    loadUpcomingEvents();
    loadEventPhotos();
  }, []);

  // Transformer les photos pour la galerie
  const galleryImages = eventPhotos.map(photo => ({
    id: photo.id,
    src: photo.image_url,
    alt: photo.title,
    title: photo.title,
    description: photo.description || new Date(photo.date).toLocaleDateString('fr-FR'),
    isMain: false
  }));

  // Définir la première image comme principale
  if (galleryImages.length > 0) {
    galleryImages[0].isMain = true;
  }
  const [images, setImages] = useState(galleryImages);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedMedia, setSelectedMedia] = useState<{
    id: string;
    title: string;
    src: string;
    description: string;
  } | null>(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const rotationInterval = useRef<number | null>(null);

  // Mettre à jour les images quand les photos sont chargées
  useEffect(() => {
    const updatedImages = eventPhotos.map((photo, index) => ({
      id: photo.id,
      src: photo.image_url,
      alt: photo.title,
      title: photo.title,
      description: photo.description || new Date(photo.date).toLocaleDateString('fr-FR'),
      isMain: index === 0
    }));
    setImages(updatedImages);
  }, [eventPhotos]);
  const rotateImages = () => {
    setImages(prevImages => {
      const mainImageIndex = prevImages.findIndex(img => img.isMain);
      const nextMainIndex = (mainImageIndex + 1) % prevImages.length;
      return prevImages.map((img, index) => ({
        ...img,
        isMain: index === nextMainIndex
      }));
    });
  };
  useEffect(() => {
    if (images.length > 0) {
      rotationInterval.current = window.setInterval(() => {
        rotateImages();
      }, 5000);
    }
    return () => {
      if (rotationInterval.current) {
        clearInterval(rotationInterval.current);
      }
    };
  }, [images.length]);
  useEffect(() => {
    if (selectedMedia && rotationInterval.current) {
      clearInterval(rotationInterval.current);
      rotationInterval.current = null;
    } else if (!selectedMedia && !rotationInterval.current && images.length > 0) {
      rotationInterval.current = window.setInterval(() => {
        rotateImages();
      }, 5000);
    }
  }, [selectedMedia, images.length]);
  const handleImageClick = (image: {
    id: string;
    title: string;
    src: string;
    description: string;
  }) => {
    setSelectedMedia(image);
  };
  const closeEnlargedImage = () => {
    setSelectedMedia(null);
  };
  const handleRegisterForEvent = (eventId: string) => {
    toast({
      title: t('activities.registrationSuccess'),
      description: t('activities.registrationSuccessDescription')
    });
  };
  const mainImage = images.find(img => img.isMain) || images[0];
  const otherImages = images.filter(img => !img.isMain);
  return <Layout className="bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Modern Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/5 to-pink-600/10"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-pink-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse" style={{
        animationDelay: '1s'
      }}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6 leading-tight">
              {t('activities.title')}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              {t('activities.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Modern Calendar Section */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-3xl"></div>
            <div className="relative bg-white/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/20 shadow-2xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mr-4">
                      <Calendar size={32} className="text-primary" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-primary mb-2">{t('activities.calendar')}</h2>
                      <p className="text-gray-600">Consultez les événements à venir</p>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Découvrez les prochaines interventions publiques, débats parlementaires et cérémonies officielles auxquels participera le Sénateur LM.
                  </p>
                </div>
                <div className="relative">
                  <div className="bg-gradient-to-br from-primary to-accent p-8 rounded-2xl text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold mb-4">{t('activities.upcoming')}</h3>
                      <div className="flex items-center space-x-4">
                        <div className="w-3 h-3 rounded-full bg-white/30 animate-pulse"></div>
                        <div className="w-3 h-3 rounded-full bg-white/60 animate-pulse" style={{
                        animationDelay: '0.5s'
                      }}></div>
                        <div className="w-3 h-3 rounded-full bg-white animate-pulse" style={{
                        animationDelay: '1s'
                      }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Upcoming Activities */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/30 to-white opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6">
              {t('activities.upcoming')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Les prochaines interventions publiques et événements officiels au programme
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoadingEvents ?
          // Skeleton loading
          Array.from({
            length: 3
          }).map((_, index) => <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 shadow-lg">
                  <div className="h-2 bg-gradient-to-r from-primary via-accent to-secondary animate-pulse"></div>
                  <div className="p-8">
                    <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-4"></div>
                    <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>) : upcomingEvents.map((event, index) => <div key={event.id} className="group relative" style={{
            animationDelay: `${index * 100}ms`
          }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                    <div className="h-2 bg-gradient-to-r from-primary via-accent to-secondary"></div>
                    
                    <div className="p-8">
                      <div className="flex items-center mb-6">
                        <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center mr-4">
                          {index === 0 ? <PartyPopper size={28} className="text-accent" /> : index === 1 ? <MapPinned size={28} className="text-primary" /> : <UserRound size={28} className="text-secondary-foreground" />}
                        </div>
                        <Badge className={`${index === 0 ? "bg-primary/10 text-primary border-primary/20" : index === 1 ? "bg-accent/10 text-accent border-accent/20" : "bg-secondary/20 text-secondary-foreground border-secondary/30"}`}>
                          {event.category}
                        </Badge>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex items-start">
                          <Clock size={18} className="text-accent mt-0.5 mr-3 flex-shrink-0" />
                          <span className="text-gray-600">{new Date(event.date).toLocaleDateString('fr-FR')}, {event.time}</span>
                        </div>
                        <div className="flex items-start">
                          <MapPin size={18} className="text-primary mt-0.5 mr-3 flex-shrink-0" />
                          <span className="text-gray-600">{event.location}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-6">{event.description}</p>
                      
                      <div className="flex justify-between items-center">
                        <Button variant="link" className="text-primary font-medium hover:underline" onClick={() => setSelectedActivity(event)}>
                          {t('activities.details')}
                          <ChevronRight size={18} className="ml-1 transition-transform group-hover:translate-x-1" />
                        </Button>
                        
                        <div className="flex gap-2">
                          
                          
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-green-50">
                            <Share2 size={14} className="text-green-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>)}
          </div>
        </div>
      </section>

      {/* Modern Recent Activities */}
      <section className="py-16 bg-gradient-to-br from-white to-gray-50 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6">
              {t('activities.recent')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {t('activities.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {activities.map((activity, index) => <div key={activity.id} className="group bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2" style={{
            animationDelay: `${index * 100}ms`
          }}>
                <div className="flex">
                  <div className={`${index % 3 === 0 ? "bg-gradient-to-br from-primary to-primary-hover" : index % 3 === 1 ? "bg-gradient-to-br from-accent to-accent/80" : "bg-gradient-to-br from-secondary to-secondary/80"} text-white p-6 flex flex-col items-center justify-center min-w-[100px] relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-white/10 transform -skew-x-12"></div>
                    <span className="text-3xl font-bold relative z-10">{activity.date.day}</span>
                    <span className="text-sm uppercase tracking-wider relative z-10">{activity.date.month}</span>
                  </div>
                  <div className="p-6 flex-1">
                    <h3 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-primary transition-colors">
                      {activity.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{activity.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Users size={16} className="text-primary/70 mr-2" />
                        <span className="text-sm text-gray-500">Participation publique</span>
                      </div>
                      <div className="flex gap-2">
                        
                        
                      </div>
                    </div>
                  </div>
                </div>
              </div>)}
          </div>
        </div>
      </section>

      {/* Modern Photo Gallery */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6">
              {t('media.photos')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Retour en images sur les moments forts des activités récentes
            </p>
          </div>
          
          {isLoadingPhotos ? <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="col-span-2 row-span-2">
                <div className="h-80 bg-gray-200 rounded-2xl animate-pulse"></div>
              </div>
              {Array.from({
            length: 4
          }).map((_, index) => <div key={index} className="h-40 bg-gray-200 rounded-2xl animate-pulse"></div>)}
            </div> : images.length > 0 ? <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="col-span-2 row-span-2">
                <div className="h-full rounded-2xl overflow-hidden shadow-xl relative group transition-all duration-500 cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <img src={mainImage?.src} alt={mainImage?.alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" onClick={() => mainImage && handleImageClick(mainImage)} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <div className="text-white">
                      <h3 className="text-xl font-medium mb-2">{mainImage?.title}</h3>
                      <p className="text-white/90">{mainImage?.description}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {otherImages.map((image, index) => <div key={image.id} className="cursor-pointer transform transition-all duration-300 hover:scale-105 hover:z-10" style={{
            animationDelay: `${(index + 1) * 100}ms`
          }} onClick={() => handleImageClick(image)}>
                  <div className="h-full rounded-2xl overflow-hidden shadow-lg relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <img src={image.src} alt={image.alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <div className="text-white">
                        <h3 className="text-sm font-medium">{image.title}</h3>
                        <p className="text-xs text-white/90">{image.description}</p>
                      </div>
                    </div>
                  </div>
                </div>)}
            </div> : <div className="text-center py-16">
              <p className="text-gray-500">Aucune photo disponible pour le moment.</p>
            </div>}
        </div>
      </section>

      <Dialog open={selectedActivity !== null} onOpenChange={open => !open && setSelectedActivity(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white rounded-xl">
          {selectedActivity && <div className="relative">
              <div className="absolute top-4 right-4 z-50">
                <DialogClose className="bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all hover:scale-105">
                  <X className="h-6 w-6 text-gray-700" />
                </DialogClose>
              </div>
              <div className="flex flex-col">
                <div className="bg-gradient-to-r from-primary to-accent p-8 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold mb-4">{selectedActivity.title}</DialogTitle>
                    <DialogDescription className="text-white/90 text-base">
                      {selectedActivity.description}
                    </DialogDescription>
                  </DialogHeader>
                </div>
                
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="col-span-2">
                      <div className="mb-6">
                        <h3 className="text-lg font-medium mb-4 text-primary">{t('activities.eventDetails')}</h3>
                        <p className="text-gray-700 mb-6">{selectedActivity.description}</p>
                      </div>
                      
                      <Button onClick={() => handleRegisterForEvent(selectedActivity.id)} className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary transition-all duration-300">
                        {t('activities.join')}
                      </Button>
                    </div>
                    
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 shadow-inner-sm">
                      <h3 className="text-lg font-medium mb-4 text-primary">{t('activities.info')}</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <Badge className="bg-primary/10 text-primary border-primary/20">
                            {selectedActivity.category}
                          </Badge>
                        </div>
                        
                        <div className="flex items-start">
                          <CalendarDays size={20} className="text-primary mr-3 flex-shrink-0" />
                          <div>
                            <h4 className="text-sm font-medium text-gray-700">{t('activities.datetime')}</h4>
                            <p className="text-gray-600">{new Date(selectedActivity.date).toLocaleDateString('fr-FR')}, {selectedActivity.time}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <MapPin size={20} className="text-accent mr-3 flex-shrink-0" />
                          <div>
                            <h4 className="text-sm font-medium text-gray-700">{t('activities.location')}</h4>
                            <p className="text-gray-600">{selectedActivity.location}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>}
        </DialogContent>
      </Dialog>

      <Dialog open={selectedMedia !== null} onOpenChange={open => !open && setSelectedMedia(null)}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden bg-white rounded-xl">
          <div className="relative">
            <div className="absolute top-4 right-4 z-50">
              <DialogClose className="bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all hover:scale-105">
                <X className="h-6 w-6 text-gray-700" />
              </DialogClose>
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-3/4 bg-gray-900 relative">
                {selectedMedia && <img src={selectedMedia.src} alt={selectedMedia.title} className="w-full object-contain max-h-[80vh]" />}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent h-20 md:hidden"></div>
              </div>
              <div className="w-full md:w-1/4 p-6 bg-white">
                {selectedMedia && <Card className="border-0 shadow-none">
                    <CardContent className="p-0">
                      <h3 className="text-xl font-semibold mb-4 text-primary">{selectedMedia.title}</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500">Description</p>
                          <p className="font-medium text-gray-700">{selectedMedia.description}</p>
                        </div>
                        <a href={selectedMedia.src} download={`${selectedMedia.title}.jpg`} className="inline-flex items-center text-primary font-medium hover:underline bg-primary/5 px-4 py-2 rounded-lg transition-colors hover:bg-primary/10">
                          <Download size={16} className="mr-2" />
                          Télécharger l'image
                        </a>
                      </div>
                    </CardContent>
                  </Card>}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>;
};
export default Activities;