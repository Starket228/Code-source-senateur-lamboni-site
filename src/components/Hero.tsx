import React, { useState, useEffect } from 'react';
import { useSite } from '@/context/SiteContext';
import { useLanguage } from '@/context/LanguageContext';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, ChevronRight, Star, Heart } from 'lucide-react';
const Hero: React.FC = () => {
  const {
    hero,
    isLoading
  } = useSite();
  const {
    t
  } = useLanguage();
  const [welcomeIndex, setWelcomeIndex] = useState(0);
  const [fadeState, setFadeState] = useState('in');
  const welcomeMessages = ['Yensömble...', 'Bienvenue...', 'Welcome...', 'Woezon...', 'Kabitè...'];
  useEffect(() => {
    const fadeOutTimer = setTimeout(() => {
      if (fadeState === 'in') {
        setFadeState('out');
      }
    }, 1200);
    const changeMessageTimer = setTimeout(() => {
      if (fadeState === 'out') {
        setWelcomeIndex(prevIndex => (prevIndex + 1) % welcomeMessages.length);
        setFadeState('in');
      }
    }, 1500);
    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(changeMessageTimer);
    };
  }, [fadeState, welcomeMessages.length]);
  if (isLoading) {
    return <div className="relative h-[600px] flex items-center bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-xl">
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-5/6 mb-8" />
            <Skeleton className="h-12 w-36" />
          </div>
        </div>
      </div>;
  }
  if (!hero) {
    return <div className="relative h-[600px] flex items-center bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">Bienvenue sur notre site</h1>
            <p className="text-lg text-white/90 mb-8">Nous travaillons sur notre contenu. Merci de votre patience.</p>
            <Link to="/" className="btn">Accueil</Link>
          </div>
        </div>
      </div>;
  }
  const heroImage = "https://i.postimg.cc/26M71x5J/Whats-App-Image-2025-03-10-at-00-32-49.jpg";
  return <>
      {/* Flag stripe */}
      
      
      <section className="relative h-[650px] flex items-center bg-center bg-cover" style={{
      backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.7)), url(${heroImage})`
    }}>
        <div className="container mx-auto px-4">
          <div className="max-w-xl animate-in animate-up relative z-10">
            <div className="mb-2">
              <div className="bg-gradient-to-r from-green-600/80 to-green-600/60 text-white px-3 py-1 rounded-full inline-flex items-center text-sm shadow-lg">
                <Star className="w-3 h-3 mr-1" />
                <span className="font-medium">Yensömble</span>
                <Heart className="w-3 h-3 ml-1 text-red-300" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight flex items-center gap-3 shadow-text">
              <span className="relative">
                {hero.title}
                <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-secondary via-secondary/50 to-transparent rounded-full"></span>
              </span>
              <Trophy className="w-8 h-8 text-secondary" />
            </h1>
            
            <p className="text-lg text-white/90 mb-8 backdrop-blur-sm p-4 bg-black/20 rounded-lg border-l-4 border-primary shadow-lg">
              {hero.description}
            </p>
            
            <Link to="/programs" className="btn animate-delay-200 group bg-gradient-to-r from-primary to-primary-hover shadow-lg hover:shadow-xl">
              <span className="flex items-center">{hero.buttonText}</span>
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <h2 className={`text-2xl md:text-3xl font-light text-white transition-opacity duration-300 ${fadeState === 'in' ? 'opacity-100' : 'opacity-0'}`} style={{
          textShadow: '0 2px 10px rgba(0,0,0,0.7)'
        }}>
            {welcomeMessages[welcomeIndex]}
          </h2>
        </div>
      </section>
    </>;
};
export default Hero;