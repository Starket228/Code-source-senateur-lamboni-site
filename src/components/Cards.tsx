
import React from 'react';
import { Link } from 'react-router-dom';
import { useSite } from '@/context/SiteContext';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowRight, Bookmark, Calendar } from 'lucide-react';

// Use the same program images as in Programs components
const programImages = [
  "https://i.postimg.cc/3JtFy30v/Whats-App-Image-2025-03-10-at-00-24-11.jpg",
  "https://i.postimg.cc/vBWWGVVW/Whats-App-Image-2025-03-10-at-00-25-03.jpg", 
  "https://i.postimg.cc/c46rm3LX/Whats-App-Image-2025-03-10-at-00-26-27.jpg",
  "https://i.postimg.cc/g0GpM9Km/Whats-App-Image-2025-03-10-at-00-36-55.jpg",
  "https://i.postimg.cc/6pMK1jbZ/Whats-App-Image-2025-03-10-at-00-36-54.jpg"
];

interface CardsSectionProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

const CardsSection: React.FC<CardsSectionProps> = ({
  title,
  subtitle,
  className
}) => {
  const {
    newsCards,
    settings
  } = useSite();
  const {
    language,
    t
  } = useLanguage();

  const getLocalizedField = (card: any, field: string) => {
    if (language === 'en' && card.translations?.en && card.translations.en[field]) {
      return card.translations.en[field];
    }
    return card[field];
  };

  // Get image for card based on its index using the same program images
  const getCardImage = (index: number) => {
    return programImages[index % programImages.length];
  };

  // Handle loading state when settings is null
  if (!settings) {
    return (
      <section className={`py-16 relative ${className || ''}`}>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold gradient-animate mb-4">
              {title || t('news.title')}
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-primary via-accent to-primary rounded-full mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              {subtitle || t('news.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Loading skeleton or empty state */}
            <div className="text-center text-gray-500">Chargement...</div>
          </div>
        </div>
      </section>
    );
  }

  return <section className={`py-16 relative ${className || ''}`}>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold gradient-animate mb-4">
            {title || settings.newsTitle || t('news.title')}
          </h2>
          
          <div className="w-24 h-1.5 bg-gradient-to-r from-primary via-accent to-primary rounded-full mx-auto mb-6"></div>
          
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            {subtitle || settings.newsSubtitle || t('news.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsCards.map((card, index) => <div key={card.id} className="group animate-in animate-up" style={{
          animationDelay: `${index * 150}ms`
        }}>
              <div className="bg-white rounded-xl overflow-hidden h-full shadow-soft transition-all duration-300 group-hover:shadow-medium">
                <div className="relative h-52 overflow-hidden">
                  <img src={getCardImage(index)} alt={getLocalizedField(card, 'title')} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="absolute top-4 left-4 flex items-center space-x-2">
                    <span className="bg-white/90 backdrop-blur-sm text-primary px-3 py-1 rounded-full text-sm font-medium shadow-sm flex items-center">
                      <Bookmark size={14} className="mr-1.5" />
                      {card.tag}
                    </span>
                  </div>
                  
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm flex items-center">
                      <Calendar size={14} className="mr-1.5" />
                      12 Juin 2024
                    </span>
                  </div>
                </div>
                
                <div className="p-6 border-t border-gray-100 flex flex-col h-[calc(100%-208px)]">
                  <h3 className="text-xl font-semibold mb-3 transition-colors group-hover:text-primary">
                    {getLocalizedField(card, 'title')}
                  </h3>
                  
                  <p className="text-gray-600 mb-5 line-clamp-2 flex-grow">
                    {getLocalizedField(card, 'description')}
                  </p>
                  
                  <div className="mt-auto">
                    <Link to={`/news/${card.id}`} className="inline-flex items-center text-primary font-medium highlight-hover">
                      {t('news.readMore')}
                      <ArrowRight size={16} className="ml-1.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>)}
        </div>
      </div>
    </section>;
};

export default CardsSection;
