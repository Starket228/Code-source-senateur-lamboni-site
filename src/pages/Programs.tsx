import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useSite } from '@/context/SiteContext';
import { useLanguage } from '@/context/LanguageContext';
import { ChevronRight, BookOpen, Award, ArrowRight, Lightbulb, Tag, Calendar, Users, Search, Filter, TrendingUp, Eye, Heart, Share2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
const programImages = ["https://i.postimg.cc/3JtFy30v/Whats-App-Image-2025-03-10-at-00-24-11.jpg", "https://i.postimg.cc/vBWWGVVW/Whats-App-Image-2025-03-10-at-00-25-03.jpg", "https://i.postimg.cc/c46rm3LX/Whats-App-Image-2025-03-10-at-00-26-27.jpg", "https://i.postimg.cc/g0GpM9Km/Whats-App-Image-2025-03-10-at-00-36-55.jpg", "https://i.postimg.cc/6pMK1jbZ/Whats-App-Image-2025-03-10-at-00-36-54.jpg"];
const Programs = () => {
  const {
    programs,
    setPrograms,
    settings
  } = useSite();
  const {
    language,
    t
  } = useLanguage();
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
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
              content: '',
              // Programs don't have content in DB
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
  const getLocalizedField = (program: any, field: string) => {
    if (language === 'en' && program.translations?.en && program.translations.en[field]) {
      return program.translations.en[field];
    }
    return program[field];
  };
  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase()) || program.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeTab === 'all' || program.tag.toLowerCase() === activeTab;
    return matchesSearch && matchesCategory;
  });
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
              {settings?.programsTitle || t('programs.title')}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              {settings?.programsSubtitle || t('programs.subtitle')}
            </p>
            
            {/* Modern search bar */}
            <div className="mt-12 max-w-2xl mx-auto">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-2 border border-white/20 shadow-xl">
                  <div className="flex items-center">
                    <Search className="w-5 h-5 text-gray-400 ml-4" />
                    <input type="text" placeholder="Rechercher dans les programmes..." className="flex-1 px-4 py-4 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-xl shadow-lg transition-all duration-300">
                      Rechercher
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Filter Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              <div className="flex items-center gap-4">
                <Filter className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700">Filtrer par catégorie:</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {categories.map((category, index) => <button key={index} className={`px-6 py-3 rounded-xl transition-all duration-300 font-medium ${activeTab === category ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105' : 'bg-white/80 text-gray-600 border border-gray-200 hover:border-blue-300 hover:bg-blue-50'}`} onClick={() => setActiveTab(category)}>
                    {category === 'all' ? t('news.categories.all') : category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Programs Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading ? <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div> : filteredPrograms.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredPrograms.map((program, index) => <div key={program.id} className="group relative" style={{
            animationDelay: `${index * 100}ms`
          }} onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                    <div className="relative overflow-hidden">
                      <img src={program.image} alt={getLocalizedField(program, 'title')} className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/90 text-blue-600 border-0 shadow-md">
                          <Tag size={14} className="mr-1" />
                          {program.tag}
                        </Badge>
                      </div>
                      
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-white/80 hover:bg-white text-gray-700 rounded-full">
                            <Eye size={14} />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-white/80 hover:bg-white text-gray-700 rounded-full">
                            <Heart size={14} />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-white/80 hover:bg-white text-gray-700 rounded-full">
                            <Share2 size={14} />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Link to={`/programs/${program.id}`} className="inline-flex items-center text-white font-medium bg-black/50 backdrop-blur-sm px-3 py-2 rounded-lg hover:bg-black/70 transition-colors">
                          {t('programs.viewDetails')}
                          <ArrowRight size={16} className="ml-1" />
                        </Link>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold transition-colors group-hover:text-blue-600 line-clamp-2">
                          {getLocalizedField(program, 'title')}
                        </h3>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-50 group-hover:bg-blue-100 transition-all">
                          <Lightbulb size={18} className="text-blue-600" />
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                        {getLocalizedField(program, 'description')}
                      </p>
                      
                      <div className="flex justify-between items-center">
                        <Link to={`/programs/${program.id}`} className="inline-flex items-center text-blue-600 font-medium hover:text-purple-600 transition-colors">
                          {t('programs.details')}
                          <ChevronRight size={16} className={`ml-1 transition-transform duration-300 ${hoveredIndex === index ? 'translate-x-1' : ''}`} />
                        </Link>
                        
                        
                      </div>
                    </div>
                  </div>
                </div>)}
            </div> : <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucun programme trouvé</h3>
              <p className="text-gray-600 mb-8">Essayez de modifier vos critères de recherche</p>
              <Button onClick={() => {
            setSearchTerm('');
            setActiveTab('all');
          }} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl">
                Réinitialiser la recherche
              </Button>
            </div>}
        </div>
      </section>

      {/* Modern CTA Section */}
      
    </Layout>;
};
export default Programs;