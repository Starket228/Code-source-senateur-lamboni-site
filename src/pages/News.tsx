import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useSite } from '@/context/SiteContext';
import { useLanguage } from '@/context/LanguageContext';
import { ChevronRight, Search, Tag, Clock, User, ArrowRight, ChevronLeft, Calendar, Heart, Share2, Bookmark, Filter, TrendingUp, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CategoryService } from '@/utils/categoryUtils';

const News = () => {
  const {
    newsCards,
    settings
  } = useSite();
  const {
    t,
    language
  } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const [isHoveredIndex, setIsHoveredIndex] = useState<number | null>(null);
  const [categories, setCategories] = useState<string[]>(['all']);

  // Load categories from CategoryManager
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const result = await CategoryService.getCategories('news');
        if (result.success && result.data && result.data.length > 0) {
          setCategories(['all', ...result.data.map((cat: any) => cat.name)]);
        } else {
          // Fallback: generate from existing tags if no categories defined
          setCategories(['all', ...Array.from(new Set(newsCards.map(card => card.tag)))]);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
        // Fallback on error
        setCategories(['all', ...Array.from(new Set(newsCards.map(card => card.tag)))]);
      }
    };

    loadCategories();
  }, [newsCards]);

  // Filter news cards based on search term and category
  const filteredNews = newsCards.filter(card => {
    const matchesSearch = card.title.toLowerCase().includes(searchTerm.toLowerCase()) || card.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || card.tag.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // Auto slide featured news
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentFeaturedIndex(prevIndex => prevIndex === newsCards.length - 1 ? 0 : prevIndex + 1);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [newsCards.length]);

  // Manual navigation functions
  const goToPrevious = () => {
    setCurrentFeaturedIndex(prevIndex => prevIndex === 0 ? newsCards.length - 1 : prevIndex - 1);
  };
  const goToNext = () => {
    setCurrentFeaturedIndex(prevIndex => prevIndex === newsCards.length - 1 ? 0 : prevIndex + 1);
  };
  const featuredNews = newsCards[currentFeaturedIndex] || newsCards[0];
  const programImages = ['/lovable-uploads/1382ab96-04a4-448a-ab5f-65c7ab7beea4.jpg', '/lovable-uploads/142fb0af-71f6-4ffd-a4bd-8957e1962c78.jpg', '/lovable-uploads/bd23fae5-d7b8-4d3f-97aa-fd3ad3c2a6e2.jpg'];
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
              {t('news.title')}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              {t('news.subtitle')}
            </p>
            
            {/* Modern search bar */}
            <div className="mt-12 max-w-2xl mx-auto">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-2 border border-white/20 shadow-xl">
                  <div className="flex items-center">
                    <Search className="w-5 h-5 text-gray-400 ml-4" />
                    <input type="text" placeholder="Rechercher dans les actualités..." className="flex-1 px-4 py-4 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
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

      {/* Featured News - Modern Carousel */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-3xl"></div>
            <div className="relative bg-white/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-3/5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 z-10"></div>
                  <img src={featuredNews.image || programImages[currentFeaturedIndex % programImages.length]} alt={featuredNews.title} className="w-full h-80 lg:h-full object-cover transition-transform duration-700 hover:scale-105" />
                  <div className="absolute top-6 left-6 z-20">
                    <Badge className="bg-white/90 text-blue-600 border-0 shadow-lg">
                      <Tag className="w-3 h-3 mr-1" />
                      {featuredNews.tag}
                    </Badge>
                  </div>
                </div>
                
                <div className="lg:w-2/5 p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center text-gray-500 text-sm bg-gray-100 px-3 py-1 rounded-full">
                      <Calendar size={14} className="mr-2" />
                      <span>15 Juin 2024</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-red-50">
                        <Heart size={16} className="text-gray-400 hover:text-red-500 transition-colors" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-blue-50">
                        <Share2 size={16} className="text-gray-400 hover:text-blue-500 transition-colors" />
                      </Button>
                    </div>
                  </div>
                  
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                    {featuredNews.title}
                  </h2>
                  <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                    {featuredNews.description}
                  </p>
                  
                  <Link to={`/news/${featuredNews.id}`} className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-medium">
                    {t('news.readFull')}
                    <ArrowRight size={20} className="ml-2" />
                  </Link>
                </div>
              </div>
              
              {/* Modern Navigation */}
              <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
                <button onClick={goToPrevious} className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110">
                  <ChevronLeft size={20} />
                </button>
              </div>
              <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
                <button onClick={goToNext} className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110">
                  <ChevronRight size={20} />
                </button>
              </div>
              
              {/* Modern Indicators */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
                {newsCards.map((_, index) => <button key={index} onClick={() => setCurrentFeaturedIndex(index)} className={`transition-all duration-300 rounded-full ${currentFeaturedIndex === index ? 'bg-white w-8 h-3' : 'bg-white/50 w-3 h-3 hover:bg-white/70'}`} />)}
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
                {categories.map((category, index) => <button key={index} className={`px-6 py-3 rounded-xl transition-all duration-300 font-medium ${selectedCategory === category ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105' : 'bg-white/80 text-gray-600 border border-gray-200 hover:border-blue-300 hover:bg-blue-50'}`} onClick={() => setSelectedCategory(category)}>
                    {category === 'all' ? t('news.categories.all') : category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern News Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredNews.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((news, index) => <div key={news.id} className="group relative" style={{
            animationDelay: `${index * 100}ms`
          }} onMouseEnter={() => setIsHoveredIndex(index)} onMouseLeave={() => setIsHoveredIndex(null)}>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                    <div className="relative overflow-hidden">
                      <img src={news.image || programImages[index % programImages.length]} alt={news.title} className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/90 text-blue-600 border-0 shadow-md">
                          {news.tag}
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
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center text-gray-500 mb-3">
                        <Clock size={14} className="mr-2" />
                        <span className="text-sm">12 Juin 2024</span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {news.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                        {news.description}
                      </p>
                      
                      <Link to={`/news/${news.id}`} className="inline-flex items-center text-blue-600 font-medium hover:text-purple-600 transition-colors">
                        {t('news.readMore')}
                        <ChevronRight size={16} className={`ml-1 transition-transform duration-300 ${isHoveredIndex === index ? 'translate-x-1' : ''}`} />
                      </Link>
                    </div>
                  </div>
                </div>)}
            </div> : <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('news.noResults')}</h3>
              <p className="text-gray-600 mb-8">{t('news.noResultsDescription')}</p>
              <Button onClick={() => {
            setSearchTerm('');
            setSelectedCategory('all');
          }} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl">
                {t('news.resetSearch')}
              </Button>
            </div>}
        </div>
      </section>

      {/* Modern Newsletter Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t('news.stayInformed')}
            </h2>
            <p className="text-xl opacity-90 mb-12 max-w-2xl mx-auto leading-relaxed">
              {t('news.newsletterDescription')}
            </p>
            
            <div className="max-w-md mx-auto">
              <div className="relative group">
                <div className="absolute inset-0 bg-white/20 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-white/20">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input type="email" placeholder={t('news.emailPlaceholder')} className="flex-1 px-4 py-3 bg-white/90 text-gray-800 rounded-xl border-0 outline-none placeholder-gray-500" />
                    <Button className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-xl font-medium shadow-lg transition-all duration-300">
                      {t('news.subscribe')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>;
};
export default News;
