import React, { useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import CardsSection from '@/components/Cards';
import Programs from '@/components/Programs';
import MediaGrid from '@/components/MediaGrid';
import { useSite } from '@/context/SiteContext';
import { useLanguage } from '@/context/LanguageContext';
import { Calendar, Download, FileText, Star, ArrowRight, Users, TrendingUp, Globe, Target, Eye, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
const Index = () => {
  const {
    activities,
    documents
  } = useSite();
  const {
    t
  } = useLanguage();
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animate-in')) {
          entry.target.classList.add('animate-in', 'animate-up');
          entry.target.classList.remove('opacity-0', 'translate-y-8');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    sectionsRef.current.forEach(section => {
      if (section) {
        if (!section.classList.contains('animate-in')) {
          section.classList.add('opacity-0', 'translate-y-8');
        }
        observer.observe(section);
      }
    });
    return () => {
      sectionsRef.current.forEach(section => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);
  return <Layout>
      <Hero />
      
      {/* News Section */}
      <section ref={el => sectionsRef.current[0] = el} className="relative transition-all duration-700 py-16">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white"></div>
        <div className="relative z-10">
          <CardsSection className="relative z-10" />
        </div>
      </section>
      
      {/* Programs Section */}
      <section ref={el => sectionsRef.current[1] = el} className="relative transition-all duration-700 py-16">
        <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50"></div>
        <Programs />
      </section>
      
      {/* Activities Section */}
      <section ref={el => sectionsRef.current[2] = el} className="relative bg-gradient-to-br from-white to-blue-50/30 transition-all duration-700 py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/3 to-purple-600/3"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              
              
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-700 to-purple-700 bg-clip-text text-transparent mb-6 mt-6">
                {t('activities.title')}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
            </div>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">{t('activities.subtitle')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activities.map((activity, index) => <div key={activity.id} className="group animate-in animate-up" style={{
            animationDelay: `${index * 150}ms`
          }}>
                <div className="bg-white/70 backdrop-blur-lg border border-white/30 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="flex h-full">
                    <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white p-6 flex flex-col items-center justify-center min-w-[100px]">
                      <span className="text-3xl font-bold">{activity.date.day}</span>
                      <span className="text-sm uppercase tracking-wider opacity-90">{activity.date.month}</span>
                    </div>
                    
                    <div className="p-6 flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{activity.title}</h3>
                        
                      </div>
                      
                      <p className="text-gray-600 mb-6">{activity.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <a href={`/activities/${activity.id}`} className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                          En savoir plus
                          <ArrowRight size={16} className="ml-2" />
                        </a>
                        
                        
                      </div>
                    </div>
                  </div>
                </div>
              </div>)}
          </div>
          
          <div className="text-center mt-16">
            <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <a href="/activities" className="inline-flex items-center gap-2">
                <Calendar size={18} />
                <span className="font-semibold">{t('activities.viewAll')}</span>
              </a>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Media Section */}
      <section ref={el => sectionsRef.current[3] = el} className="relative transition-all duration-700">
        <MediaGrid />
      </section>
      
      {/* Documents Section */}
      <section ref={el => sectionsRef.current[4] = el} className="py-20 relative transition-all duration-700">
        <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              
              
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-700 to-purple-700 bg-clip-text text-transparent mb-6 mt-6">
                <div className="flex items-center justify-center gap-3">
                  
                  {t('documents.title')}
                  
                </div>
                <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mx-auto mt-4"></div>
              </h2>
            </div>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              {t('documents.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {documents.map((document, index) => <div key={document.id} className="group animate-in animate-up" style={{
            animationDelay: `${index * 100}ms`
          }}>
                <div className="bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-3 h-full">
                  <div className="p-6 flex flex-col h-full">
                    <div className="mb-6">
                      <div className="bg-gradient-to-br from-blue-50 to-green-50 p-4 rounded-xl border border-white/50">
                        <FileText size={40} className="text-blue-600 mx-auto" />
                      </div>
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">{document.title}</h3>
                      <p className="text-gray-600 mb-6 line-clamp-3">{document.description}</p>
                    </div>
                    
                    <div className="mt-auto space-y-4">
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>PDF</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye size={14} />
                          <span>{Math.floor(Math.random() * 500) + 100}</span>
                        </div>
                      </div>
                      
                      <a href={document.link} className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl font-medium transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                        <Download size={16} />
                        <span className="font-semibold">{t('documents.download')}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>)}
          </div>
        </div>
      </section>
    </Layout>;
};
export default Index;