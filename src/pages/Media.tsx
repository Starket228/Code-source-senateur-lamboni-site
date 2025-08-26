import React, { useState, useRef, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Play, Image, Volume2, ChevronRight, ExternalLink, Download, X, Pause, SkipBack, SkipForward, Filter, Maximize, Minimize, Volume, VolumeX, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { formatTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useMediaQuery, type MediaItem } from '@/hooks/useMediaQueries';
const Media = () => {
  const {
    data: mediaData,
    isLoading,
    error
  } = useMediaQuery();
  const [activeTab, setActiveTab] = useState<'photo' | 'video' | 'audio'>('photo');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<{
    id: number;
    title: string;
    src: string;
    thumbnail: string;
    category: string;
    date: string;
    duration: string;
  } | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Video state
  const [selectedVideo, setSelectedVideo] = useState<{
    id: number;
    title: string;
    src?: string;
    thumbnail: string;
    category: string;
    date: string;
    duration: string;
  } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoVolume, setVideoVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [videoIsPlaying, setVideoIsPlaying] = useState(false);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const filters = {
    photo: ['all', 'visites', 'événements', 'séances parlementaires', 'interviews'],
    video: ['all', 'discours', 'conférences', 'reportages', 'entretiens'],
    audio: ['all', 'interviews radio', 'podcasts', 'déclarations']
  };
  const filteredMedia = mediaData ? activeFilter === 'all' ? mediaData.filter(item => item.media_type === activeTab) : mediaData.filter(item => item.media_type === activeTab && item.category === activeFilter) : [];
  const mediaIcons = {
    photo: <Image size={24} />,
    video: <Play size={24} />,
    audio: <Volume2 size={24} />
  };
  const openMediaDetail = item => {
    setSelectedMedia(item);
  };
  const playAudio = audioItem => {
    if (currentAudio && currentAudio.id !== audioItem.id) {
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    }
    setCurrentAudio(audioItem);
    if (audioRef.current) {
      if (!currentAudio || currentAudio.id !== audioItem.id) {
        audioRef.current.src = audioItem.src;
        audioRef.current.load();
      }
      if (currentAudio && currentAudio.id === audioItem.id && isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };
  const openVideoModal = videoItem => {
    // Reset video state
    setVideoCurrentTime(0);
    setVideoDuration(0);
    setVideoIsPlaying(false);

    // Set selected video
    setSelectedVideo(videoItem);
  };
  const handleVideoPlayPause = () => {
    if (videoRef.current) {
      if (videoIsPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setVideoIsPlaying(!videoIsPlaying);
    }
  };
  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      setVideoCurrentTime(videoRef.current.currentTime);
      if (!videoDuration && videoRef.current.duration) {
        setVideoDuration(videoRef.current.duration);
      }
    }
  };
  const handleVideoSliderChange = (value: number[]) => {
    if (videoRef.current) {
      const newTime = value[0];
      videoRef.current.currentTime = newTime;
      setVideoCurrentTime(newTime);
    }
  };
  const handleVideoVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVideoVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };
  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = videoVolume || 1;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };
  const toggleFullscreen = () => {
    if (!videoContainerRef.current) return;
    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };
  const handleVideoEnded = () => {
    setVideoIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setVideoCurrentTime(0);
    }
  };
  const handleCloseVideoModal = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setSelectedVideo(null);
    setVideoIsPlaying(false);
  };
  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };
  const handleSliderChange = (value: number[]) => {
    if (audioRef.current) {
      const newTime = value[0];
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };
  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };
  if (isLoading) {
    return <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Chargement des médias...</span>
        </div>
      </Layout>;
  }
  if (error) {
    return <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-xl font-semibold mb-2">Erreur de chargement</h2>
          <p className="text-gray-600">Une erreur est survenue lors du chargement des médias.</p>
        </div>
      </Layout>;
  }
  return <Layout className="bg-gray-50">
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">Galerie Multimédia</h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Découvrez les photos, vidéos et enregistrements audio des activités et événements du Sénateur LM.
            </p>
          </div>
        </div>
      </section>

      {currentAudio && <div className={`fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50 transition-transform duration-300 ${currentAudio ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center py-3 gap-4">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <img src={currentAudio.thumbnail} alt={currentAudio.title} className="w-12 h-12 rounded-md object-cover" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium truncate">{currentAudio.title}</h4>
                  <p className="text-xs text-gray-500 truncate">{currentAudio.category}</p>
                </div>
              </div>
              
              <div className="flex-1 w-full md:w-auto">
                <div className="flex items-center justify-between gap-4 w-full">
                  <span className="text-xs text-gray-500 w-12 text-right">
                    {formatTime(currentTime)}
                  </span>
                  <div className="flex-1">
                    <Slider value={[currentTime]} max={duration || 100} step={0.1} onValueChange={handleSliderChange} className="cursor-pointer" />
                  </div>
                  <span className="text-xs text-gray-500 w-12">
                    {formatTime(duration)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button onClick={handlePlayPause} className="p-2 rounded-full hover:bg-gray-100">
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
              </div>
            </div>
          </div>
          
          <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} onEnded={handleAudioEnded} onLoadedMetadata={handleTimeUpdate} />
        </div>}

      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white shadow-soft rounded-xl p-6 -mt-20 relative z-10 animate-in animate-up">
            <div className="flex flex-wrap justify-center gap-6">
              {Object.keys(filters).map(tab => <button key={tab} className={`flex items-center px-6 py-3 rounded-lg transition-all duration-300 text-lg ${activeTab === tab ? 'bg-primary text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`} onClick={() => {
              setActiveTab(tab as 'photo' | 'video' | 'audio');
              setActiveFilter('all');
            }}>
                  <div className={`mr-3 ${activeTab === tab ? 'text-white' : 'text-primary'}`}>
                    {mediaIcons[tab]}
                  </div>
                  <span>{tab === 'photo' ? 'Photos' : tab === 'video' ? 'Vidéos' : 'Audio'}</span>
                  <div className="ml-3 bg-white/20 rounded-full px-2 py-1 text-sm">
                    {mediaData?.filter(item => item.media_type === tab).length || 0}
                  </div>
                </button>)}
            </div>
          </div>
        </div>
      </section>

      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center overflow-x-auto pb-2">
            <div className="text-gray-500 flex items-center mr-4">
              <Filter size={18} className="mr-2" />
              <span>Filtrer:</span>
            </div>
            {filters[activeTab].map(filter => <button key={filter} className={`whitespace-nowrap px-4 py-2 rounded-full mr-2 text-sm transition-all ${activeFilter === filter ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`} onClick={() => setActiveFilter(filter)}>
                {filter === 'all' ? 'Tous' : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>)}
          </div>
        </div>
      </section>
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredMedia.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMedia.map((item, index) => <div key={item.id} className="bg-white rounded-xl shadow-soft overflow-hidden transition-all hover:-translate-y-2 hover:shadow-medium group animate-in animate-up" style={{
            animationDelay: `${index * 100}ms`
          }}>
                  <div className="relative h-60 overflow-hidden">
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer" onClick={() => {
                if (item.media_type === 'photo') openMediaDetail(item);else if (item.media_type === 'video') openVideoModal(item);
              }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-white/90 rounded-full p-3 transform translate-y-4 group-hover:translate-y-0 transition-transform cursor-pointer" onClick={() => {
                  if (item.media_type === 'photo') openMediaDetail(item);else if (item.media_type === 'video') openVideoModal(item);else if (item.media_type === 'audio') playAudio(item);
                }}>
                        {item.media_type === 'photo' ? <Image size={28} className="text-primary" /> : item.media_type === 'video' ? <Play size={28} className="text-primary" /> : <Volume2 size={28} className="text-primary" />}
                      </div>
                    </div>
                    {(item.media_type === 'video' || item.media_type === 'audio') && item.duration && <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-sm">
                        {item.duration}
                      </div>}
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                      </span>
                      <span className="text-gray-500 text-sm">{item.date}</span>
                    </div>
                    <h3 className="text-xl font-medium mb-4 transition-colors group-hover:text-primary">{item.title}</h3>
                    <a href="#" className="inline-flex items-center text-primary font-medium hover:underline transition-all" onClick={e => {
                e.preventDefault();
                if (item.media_type === 'photo') {
                  openMediaDetail(item);
                } else if (item.media_type === 'video') {
                  openVideoModal(item);
                } else if (item.media_type === 'audio') {
                  playAudio(item);
                }
              }}>
                      {item.media_type === 'photo' ? 'Voir la photo' : item.media_type === 'video' ? 'Regarder la vidéo' : 'Écouter l\'audio'}
                      <ChevronRight size={18} className="ml-1 transition-transform group-hover:translate-x-1" />
                    </a>
                  </div>
                </div>)}
            </div> : <div className="text-center py-12">
              <div className="text-7xl mb-4">🔍</div>
              <h3 className="text-2xl font-medium mb-2">Aucun contenu trouvé</h3>
              <p className="text-gray-600 mb-6">
                Aucun contenu ne correspond au filtre sélectionné.
              </p>
              <button className="btn" onClick={() => setActiveFilter('all')}>
                Voir tout le contenu
              </button>
            </div>}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title centered">Vidéo à la Une</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mt-6">
              Découvrez la dernière allocation du Sénateur LM concernant les projets de développement rural
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-xl overflow-hidden shadow-medium animate-in animate-up">
              <div className="aspect-w-16 aspect-h-9 bg-gray-900">
                <div className="w-full h-full flex items-center justify-center">
                  <img src="https://placehold.co/1280x720" alt="Vidéo à la une" className="w-full h-full object-cover opacity-70" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center transition-transform hover:scale-110 focus:outline-none" onClick={() => {
                    const featuredVideo = {
                      id: 999,
                      title: "Plan de développement rural 2024-2030",
                      category: "discours",
                      date: "5 juin 2024",
                      thumbnail: "https://placehold.co/1280x720",
                      duration: "18:45",
                      src: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_2MB.mp4"
                    };
                    openVideoModal(featuredVideo);
                  }}>
                      <Play size={40} className="text-primary ml-1" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-white">
                <h3 className="text-2xl font-semibold mb-2">Discours: Plan de développement rural 2024-2030</h3>
                <div className="flex justify-between items-center text-gray-500 text-sm mb-4">
                  <span>Publié le 5 juin 2024</span>
                  <span>Durée: 18:45</span>
                </div>
                <p className="text-gray-600 mb-4">
                  Dans cette allocution, le Sénateur LM présente les grandes lignes du plan de développement rural pour les six prochaines années, avec un focus particulier sur l'accès à l'eau potable et la modernisation des infrastructures agricoles.
                </p>
                <a href="#" className="inline-flex items-center text-primary font-medium hover:underline" onClick={e => {
                e.preventDefault();
                const featuredVideo = {
                  id: 999,
                  title: "Plan de développement rural 2024-2030",
                  category: "discours",
                  date: "5 juin 2024",
                  thumbnail: "https://placehold.co/1280x720",
                  duration: "18:45",
                  src: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_2MB.mp4"
                };
                openVideoModal(featuredVideo);
              }}>
                  Voir la vidéo <ChevronRight size={16} className="ml-2" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      

      {/* Photo Modal */}
      <Dialog open={selectedMedia !== null && activeTab === 'photo'} onOpenChange={open => !open && setSelectedMedia(null)}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden bg-white rounded-xl">
          <div className="relative">
            <div className="absolute top-4 right-4 z-50">
              <DialogClose className="bg-white/80 hover:bg-white p-2 rounded-full">
                <X className="h-6 w-6" />
              </DialogClose>
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-3/4 bg-gray-100">
                {selectedMedia && <img src={selectedMedia.thumbnail} alt={selectedMedia.title} className="w-full object-contain max-h-[80vh]" />}
              </div>
              <div className="w-full md:w-1/4 p-6">
                {selectedMedia && <Card>
                    <CardContent className="pt-6">
                      <h3 className="text-xl font-semibold mb-2">{selectedMedia.title}</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500">Catégorie</p>
                          <p className="font-medium">{selectedMedia.category}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Date</p>
                          <p className="font-medium">{selectedMedia.date}</p>
                        </div>
                        <a href={selectedMedia.thumbnail} download={`${selectedMedia.title}.jpg`} className="inline-flex items-center text-primary font-medium hover:underline">
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

      {/* Video Modal */}
      <Dialog open={selectedVideo !== null} onOpenChange={open => !open && handleCloseVideoModal()}>
        <DialogContent className="max-w-6xl p-0 overflow-hidden bg-black rounded-xl">
          <div className="relative">
            <div ref={videoContainerRef} className="w-full">
              {selectedVideo && <>
                  <video ref={videoRef} className="w-full max-h-[80vh]" onTimeUpdate={handleVideoTimeUpdate} onEnded={handleVideoEnded} onLoadedMetadata={handleVideoTimeUpdate} onPlay={() => setVideoIsPlaying(true)} onPause={() => setVideoIsPlaying(false)} playsInline poster={selectedVideo.thumbnail} src={selectedVideo.src} />
                  
                  {/* Video Controls */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent text-white p-4">
                    <div className="flex flex-col gap-2">
                      {/* Progress bar */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs">{formatTime(videoCurrentTime)}</span>
                        <div className="flex-1">
                          <Slider value={[videoCurrentTime]} max={videoDuration || 100} step={0.1} onValueChange={handleVideoSliderChange} className="cursor-pointer" />
                        </div>
                        <span className="text-xs">{formatTime(videoDuration)}</span>
                      </div>
                      
                      {/* Control buttons */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <Button variant="ghost" size="icon" onClick={handleVideoPlayPause} className="text-white hover:bg-white/20">
                            {videoIsPlaying ? <Pause size={20} /> : <Play size={20} />}
                          </Button>
                          
                          <div className="flex items-center gap-2 w-32">
                            <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white hover:bg-white/20">
                              {isMuted ? <VolumeX size={18} /> : <Volume size={18} />}
                            </Button>
                            
                            <Slider value={[isMuted ? 0 : videoVolume]} max={1} step={0.01} onValueChange={handleVideoVolumeChange} className="cursor-pointer w-20" />
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-white hover:bg-white/20">
                            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                          </Button>
                          
                          <Button variant="ghost" size="icon" onClick={handleCloseVideoModal} className="text-white hover:bg-white/20">
                            <X size={18} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Video title overlay */}
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent text-white p-4">
                    <h3 className="text-xl font-medium">{selectedVideo.title}</h3>
                    <p className="text-sm text-gray-300">{selectedVideo.category} - {selectedVideo.date}</p>
                  </div>
                </>}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>;
};
export default Media;