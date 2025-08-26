import React, { useEffect, useRef, useState } from 'react';
import Layout from '@/components/Layout';
import { useSite } from '@/context/SiteContext';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { User, BookOpen, Award, Users, Star, Heart, Shield, TrendingUp, Eye, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
interface AboutPageData {
  id: string;
  title: string;
  subtitle: string;
  biography_title: string;
  biography_content: string;
  biography_image: string;
  values_title: string;
  values_subtitle: string;
  achievements_title: string;
  achievements_subtitle: string;
  cta_title: string;
  cta_subtitle: string;
  election_date: string;
  election_description: string;
}

interface AboutValue {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface AboutAchievement {
  id: string;
  year: string;
  title: string;
  items: string[];
  color: string;
}

const About = () => {
  const { settings } = useSite();
  const { t } = useLanguage();
  const [aboutData, setAboutData] = useState<AboutPageData | null>(null);
  const [values, setValues] = useState<AboutValue[]>([]);
  const [achievements, setAchievements] = useState<AboutAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  // References for scroll animations
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      // Fetch about page data
      const { data: aboutPageData, error: aboutError } = await supabase
        .from('about_page')
        .select('*')
        .single();

      if (aboutError) throw aboutError;
      setAboutData(aboutPageData);

      // Fetch values
      const { data: valuesData, error: valuesError } = await supabase
        .from('about_values')
        .select('*')
        .order('created_at', { ascending: true });

      if (valuesError) throw valuesError;
      setValues(valuesData || []);

      // Fetch achievements
      const { data: achievementsData, error: achievementsError } = await supabase
        .from('about_achievements')
        .select('*')
        .order('created_at', { ascending: true });

      if (achievementsError) throw achievementsError;
      setAchievements(achievementsData || []);

    } catch (error: any) {
      console.error('Error fetching about data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      Shield,
      Heart,
      Star,
      Award,
      User
    };
    return iconMap[iconName] || Shield;
  };

  // Set up intersection observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in', 'animate-up');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, {
      threshold: 0.1
    });
    sectionRefs.current.forEach(section => {
      if (section) {
        // Initially hide sections
        section.classList.add('opacity-0', 'translate-y-10');
        observer.observe(section);
      }
    });
    return () => {
      sectionRefs.current.forEach(section => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  if (loading) {
    return (
      <Layout className="bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-500">Chargement...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!aboutData) {
    return (
      <Layout className="bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-gray-500">Données non disponibles</p>
          </div>
        </div>
      </Layout>
    );
  }
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
              {aboutData.title}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              {aboutData.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Modern Biography Section */}
      <section ref={el => sectionRefs.current[0] = el} className="py-16 transition-all duration-500">
        <div className="container mx-auto px-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-3xl"></div>
            <div className="relative bg-white/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                <div className="order-2 md:order-1 flex flex-col justify-center">
                  
                  
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">{aboutData.biography_title}</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-white/20 shadow-sm">
                      <p className="text-gray-700 leading-relaxed">
                        {aboutData.biography_content}
                      </p>
                    </div>
                    
                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-white/20 shadow-sm">
                      <div className="flex items-center mb-3">
                        <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="font-medium text-gray-800">{aboutData.election_date}</span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {aboutData.election_description}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="order-1 md:order-2">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-xl">
                      <img alt="Sénateur LAMBONI Mindi" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={aboutData.biography_image} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                      <div className="absolute bottom-6 left-6 text-white">
                        <Badge className="bg-white/90 text-blue-600 border-0 shadow-md mb-3">
                          Sénateur de la République
                        </Badge>
                        <h3 className="text-xl font-bold">LAMBONI Mindi</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Values Section */}
      <section ref={el => sectionRefs.current[1] = el} className="py-16 bg-gradient-to-br from-white to-gray-50 relative transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6">
              {aboutData.values_title}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {aboutData.values_subtitle}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const IconComponent = getIcon(value.icon);
              const colorMap: { [key: string]: string } = {
                blue: 'from-blue-600/20 to-purple-600/20',
                red: 'from-red-600/20 to-pink-600/20',
                yellow: 'from-yellow-600/20 to-orange-600/20',
                green: 'from-green-600/20 to-emerald-600/20',
                purple: 'from-purple-600/20 to-indigo-600/20',
                orange: 'from-orange-600/20 to-red-600/20',
                pink: 'from-pink-600/20 to-rose-600/20',
                indigo: 'from-indigo-600/20 to-blue-600/20'
              };
              
              const bgColorMap: { [key: string]: string } = {
                blue: 'bg-blue-50',
                red: 'bg-red-50',
                yellow: 'bg-yellow-50',
                green: 'bg-green-50',
                purple: 'bg-purple-50',
                orange: 'bg-orange-50',
                pink: 'bg-pink-50',
                indigo: 'bg-indigo-50'
              };
              
              const textColorMap: { [key: string]: string } = {
                blue: 'text-blue-600',
                red: 'text-red-600',
                yellow: 'text-yellow-600',
                green: 'text-green-600',
                purple: 'text-purple-600',
                orange: 'text-orange-600',
                pink: 'text-pink-600',
                indigo: 'text-indigo-600'
              };
              
              const hoverColorMap: { [key: string]: string } = {
                blue: 'group-hover:bg-blue-100',
                red: 'group-hover:bg-red-100',
                yellow: 'group-hover:bg-yellow-100',
                green: 'group-hover:bg-green-100',
                purple: 'group-hover:bg-purple-100',
                orange: 'group-hover:bg-orange-100',
                pink: 'group-hover:bg-pink-100',
                indigo: 'group-hover:bg-indigo-100'
              };
              
              const titleHoverColorMap: { [key: string]: string } = {
                blue: 'group-hover:text-blue-600',
                red: 'group-hover:text-red-600',
                yellow: 'group-hover:text-yellow-600',
                green: 'group-hover:text-green-600',
                purple: 'group-hover:text-purple-600',
                orange: 'group-hover:text-orange-600',
                pink: 'group-hover:text-pink-600',
                indigo: 'group-hover:text-indigo-600'
              };
              
              return (
                <div key={value.id} className="group relative">
                  <div className={`absolute inset-0 bg-gradient-to-r ${colorMap[value.color] || colorMap.blue} rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  <div className="relative bg-white/70 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                    <div className={`w-16 h-16 ${bgColorMap[value.color] || bgColorMap.blue} rounded-xl flex items-center justify-center mb-6 ${hoverColorMap[value.color] || hoverColorMap.blue} transition-all duration-300`}>
                      <IconComponent size={32} className={textColorMap[value.color] || textColorMap.blue} />
                    </div>
                    <h3 className={`text-xl font-bold mb-3 ${titleHoverColorMap[value.color] || titleHoverColorMap.blue} transition-colors`}>
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modern Accomplishments Section */}
      <section ref={el => sectionRefs.current[2] = el} className="py-16 relative transition-all duration-500">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6">
              {aboutData.achievements_title}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {aboutData.achievements_subtitle}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {achievements.map((achievement, index) => {
              const colorMap: { [key: string]: string } = {
                blue: 'bg-blue-600/20',
                red: 'bg-red-600/20',
                yellow: 'bg-yellow-600/20',
                green: 'bg-green-600/20',
                purple: 'bg-purple-600/20',
                orange: 'bg-orange-600/20',
                pink: 'bg-pink-600/20',
                indigo: 'bg-indigo-600/20',
                gradient: 'bg-gradient-to-r from-blue-600/20 to-purple-600/20'
              };
              
              const bgColorMap: { [key: string]: string } = {
                blue: 'bg-blue-50/30',
                red: 'bg-red-50/30',
                yellow: 'bg-yellow-50/30',
                green: 'bg-green-50/30',
                purple: 'bg-purple-50/30',
                orange: 'bg-orange-50/30',
                pink: 'bg-pink-50/30',
                indigo: 'bg-indigo-50/30',
                gradient: 'bg-gradient-to-br from-blue-50/50 to-purple-50/50'
              };
              
              const badgeColorMap: { [key: string]: string } = {
                blue: 'bg-blue-600',
                red: 'bg-red-600',
                yellow: 'bg-yellow-600',
                green: 'bg-green-600',
                purple: 'bg-purple-600',
                orange: 'bg-orange-600',
                pink: 'bg-pink-600',
                indigo: 'bg-indigo-600',
                gradient: 'bg-gradient-to-r from-blue-600 to-purple-600'
              };
              
              const dotColorMap: { [key: string]: string } = {
                blue: 'bg-blue-600',
                red: 'bg-red-600',
                yellow: 'bg-yellow-600',
                green: 'bg-green-600',
                purple: 'bg-purple-600',
                orange: 'bg-orange-600',
                pink: 'bg-pink-600',
                indigo: 'bg-indigo-600',
                gradient: 'bg-gradient-to-r from-blue-600 to-purple-600'
              };
              
              return (
                <div key={achievement.id} className="group relative">
                  <div className={`absolute inset-0 ${colorMap[achievement.color] || colorMap.blue} rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  <div className={`relative bg-white/70 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${bgColorMap[achievement.color] || bgColorMap.blue}`}>
                    <div className="flex items-center mb-6">
                      <div className={`w-14 h-14 ${badgeColorMap[achievement.color] || badgeColorMap.blue} rounded-full flex items-center justify-center mr-4 shadow-lg`}>
                        <Award size={28} className="text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        {achievement.title}
                      </h3>
                    </div>
                    
                    <ul className="space-y-4">
                      {achievement.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start">
                          <div className={`w-2 h-2 ${dotColorMap[achievement.color] || dotColorMap.blue} rounded-full mt-2 mr-4 flex-shrink-0`}></div>
                          <p className="text-gray-700 leading-relaxed">
                            {item}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modern CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {aboutData.cta_title}
            </h2>
            <p className="text-xl opacity-90 mb-12 max-w-2xl mx-auto leading-relaxed">
              {aboutData.cta_subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-medium shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <MapPin size={20} className="mr-2" />
                Nous contacter
              </Button>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-xl font-medium transition-all duration-300">
                <BookOpen size={20} className="mr-2" />
                En savoir plus
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>;
};
export default About;