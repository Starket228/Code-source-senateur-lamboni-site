import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSite } from '@/context/SiteContext';
import { useLanguage } from '@/context/LanguageContext';
import { ChevronRight, BookOpen, Sparkles, Award, ArrowRight, Lightbulb, Tag, Calendar, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// Use the same program images consistently across all components
const programImages = ["https://i.postimg.cc/3JtFy30v/Whats-App-Image-2025-03-10-at-00-24-11.jpg", "https://i.postimg.cc/vBWWGVVW/Whats-App-Image-2025-03-10-at-00-25-03.jpg", "https://i.postimg.cc/c46rm3LX/Whats-App-Image-2025-03-10-at-00-26-27.jpg", "https://i.postimg.cc/g0GpM9Km/Whats-App-Image-2025-03-10-at-00-36-55.jpg", "https://i.postimg.cc/6pMK1jbZ/Whats-App-Image-2025-03-10-at-00-36-54.jpg"];

const Programs: React.FC = () => {
  const {
    programs,
    settings,
    setPrograms
  } = useSite();
  const {
    language,
    t
  } = useLanguage();
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  useEffect(() => {
    const fetchPrograms = async () => {
      setIsLoading(true);
      try {
        const {
          data,
          error
        } = await supabase.from('programs').select('*').order('created_at', {
          ascending: false
        });
        if (error) {
          console.error('Error fetching programs:', error);
          return;
        }
        if (data && data.length > 0) {
          const formattedPrograms = data.map((item, index) => {
            const imageIndex = index % programImages.length;
            return {
              id: item.id,
              title: item.title,
              description: item.description,
              content: '', // Programs don't have content in DB
              image: programImages[imageIndex],
              tag: item.tag,
              date: item.created_at,
              link: `/programs/${item.id}`
            };
          });
          setPrograms(formattedPrograms);
        }
      } catch (error) {
        console.error('Error loading programs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrograms();
  }, [setPrograms]);
  
  const categories = ['all', ...Array.from(new Set(programs.map(program => program.tag.toLowerCase())))];
  const filteredPrograms = activeTab === 'all' ? programs : programs.filter(program => program.tag.toLowerCase() === activeTab);
  
  const getLocalizedField = (program: any, field: string) => {
    if (language === 'en' && program.translations?.en && program.translations.en[field]) {
      return program.translations.en[field];
    }
    return program[field];
  };
  
  return <section className="py-24 relative overflow-hidden bg-gradient-to-b from-blue-50/30 to-white">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/80 via-white to-blue-50/60 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 animate-shine"></div>
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{
      animationDuration: '8s'
    }}></div>
      <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{
      animationDuration: '10s'
    }}></div>
      <div className="absolute top-1/3 left-1/2 w-8 h-8 bg-secondary/10 rounded-full animate-float"></div>
      <div className="absolute bottom-1/3 right-1/3 w-6 h-6 bg-primary/10 rounded-full animate-bounce-light" style={{
      animationDuration: '5s'
    }}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block mb-4 relative">
            <span className="absolute -top-6 -right-6 w-12 h-12 bg-primary/10 rounded-full animate-ping opacity-30" style={{
            animationDuration: '4s'
          }}></span>
            
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4 animate-gradient-x">
            {settings?.programsTitle || t('programs.title')}
          </h2>
          
          <div className="w-24 h-1.5 bg-gradient-to-r from-primary via-accent to-primary rounded-full mx-auto mb-6 animate-shine"></div>
          
          <p className="text-gray-600 max-w-2xl mx-auto mt-4 text-lg">
            {settings?.programsSubtitle || t('programs.subtitle')}
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category, index) => <button key={index} className={`px-5 py-2.5 rounded-full transition-all duration-300 relative overflow-hidden ${activeTab === category ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-md scale-105' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 hover:border-primary hover:text-primary'}`} onClick={() => setActiveTab(category)}>
              <span className="relative z-10">
                {category === 'all' ? t('news.categories.all') : category.charAt(0).toUpperCase() + category.slice(1)}
              </span>
              {activeTab === category && <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full animate-shine"></span>}
            </button>)}
        </div>
        
        {isLoading ? <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredPrograms.map((program, index) => <div key={program.id} className="group animate-in animate-up rounded-xl overflow-hidden bg-white shadow-soft hover:shadow-medium transition-all duration-500 hover:-translate-y-2 border border-gray-100/50 hover:border-primary/20" style={{
          animationDelay: `${index * 100}ms`
        }} onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}>
                <div className="relative h-56 overflow-hidden">
                  <img src={program.image} alt={getLocalizedField(program, 'title')} className={`w-full h-full object-cover transition-all duration-700 ${hoveredIndex === index ? 'scale-110 filter brightness-90' : ''}`} />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/5 transition-opacity duration-300 flex items-end p-6 ${hoveredIndex === index ? 'opacity-100' : 'opacity-0'}`}>
                    <Link to={`/programs/${program.id}`} className="text-white font-medium flex items-center">
                      {t('programs.viewDetails')}
                      <ArrowRight size={16} className={`ml-1.5 transition-transform ${hoveredIndex === index ? 'translate-x-1' : ''}`} />
                    </Link>
                  </div>
                  <div className="absolute top-3 right-3">
                    <div className="bg-white/90 backdrop-blur-sm text-primary px-3 py-1 rounded-full text-sm font-medium shadow-sm flex items-center space-x-1">
                      <Tag size={14} />
                      <span>{program.tag}</span>
                    </div>
                  </div>
                </div>
                <div className="p-6 border-t border-gray-100">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold transition-colors group-hover:text-primary">
                      {getLocalizedField(program, 'title')}
                    </h3>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/5 group-hover:bg-primary/10 transition-all">
                      <Lightbulb size={18} className="text-primary" />
                    </div>
                  </div>
                  <p className="text-gray-600 mb-5 line-clamp-2">{getLocalizedField(program, 'description')}</p>
                  <div className="flex justify-between items-center">
                    <Link to={`/programs/${program.id}`} className="inline-flex items-center text-primary font-medium hover:underline transition-all group-hover:font-semibold btn-animated-border">
                      {t('programs.details')}
                      <ArrowRight size={16} className="ml-1.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <div className="text-xs text-gray-400 flex items-center">
                      <Users size={14} className="mr-1" />
                      <span>24</span>
                    </div>
                  </div>
                </div>
              </div>)}
          </div>}
        
        <div className="mt-16 text-center">
          <Link to="/programs" className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-primary-hover text-white rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 relative overflow-hidden">
            <span className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
            <span className="relative z-10">Voir tous les programmes</span>
            <Award className="ml-2 w-5 h-5 relative z-10 transition-transform group-hover:rotate-12" />
          </Link>
        </div>
      </div>
    </section>;
};

export default Programs;
