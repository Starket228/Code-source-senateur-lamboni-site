
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useSite } from '@/context/SiteContext';
import { useLanguage } from '@/context/LanguageContext';
import { ChevronLeft, Clock, User, Tag, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardType } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';

const NewsDetail = () => {
  const { id } = useParams();
  const { newsCards } = useSite();
  const { t, language } = useLanguage();
  const [news, setNews] = useState<CardType | null>(null);
  const [relatedNews, setRelatedNews] = useState<CardType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewsDetails = async () => {
      setLoading(true);
      
      try {
        // Try to fetch directly from Supabase first
        if (id) {
          const { data, error } = await supabase
            .from('news')
            .select('*')
            .eq('id', id)
            .single();
          
          if (error) {
            console.error('Error fetching news details from Supabase:', error);
            // Fallback to local data
            const newsItem = newsCards.find(item => item.id === id);
            if (newsItem) {
              setNews(newsItem);
              
              // Get 3 related news items from the same category
              const related = newsCards
                .filter(item => item.id !== id && item.tag === newsItem.tag)
                .slice(0, 3);
              
              setRelatedNews(related);
            }
          } else if (data) {
            // Format Supabase data to match CardType
            const formattedNews: CardType = {
              id: data.id,
              image: data.image,
              tag: data.tag,
              title: data.title,
              description: data.description,
              content: data.content,
              link: data.link,
              date: data.date
            };
            
            setNews(formattedNews);
            
            // Fetch related news from the same category
            const { data: relatedData, error: relatedError } = await supabase
              .from('news')
              .select('*')
              .eq('tag', data.tag)
              .neq('id', id)
              .limit(3);
            
            if (relatedError) {
              console.error('Error fetching related news:', relatedError);
            } else if (relatedData) {
              const formattedRelated = relatedData.map(item => ({
                id: item.id,
                image: item.image,
                tag: item.tag,
                title: item.title,
                description: item.description,
                content: item.content,
                link: item.link,
                date: item.date
              }));
              
              setRelatedNews(formattedRelated);
            }
          }
        }
      } catch (error) {
        console.error('Error in news detail fetch:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetails();
  }, [id, newsCards]);

  const getLocalizedField = (item: any, field: string) => {
    if (language === 'en' && item?.translations?.en && item.translations.en[field]) {
      return item.translations.en[field];
    }
    return item[field];
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!news) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">{t('news.notFound')}</h1>
          <p className="mb-8">{t('news.notFoundDescription')}</p>
          <Link to="/news" className="btn">
            {t('news.backToNews')}
          </Link>
        </div>
      </Layout>
    );
  }

  const content = getLocalizedField(news, 'content') || getLocalizedField(news, 'description');
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '15 Juin 2024'; // Default date
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (error) {
      return '15 Juin 2024'; // Fallback to default
    }
  };
  
  const newsDate = formatDate(news.date);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${news.image})`,
        }}>
        <div className="container mx-auto px-4 text-center">
          <span className="card-tag mb-4">{news.tag}</span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            {getLocalizedField(news, 'title')}
          </h1>
          <div className="flex items-center justify-center text-white/80 space-x-6">
            <div className="flex items-center">
              <Clock size={16} className="mr-2" />
              <span>{newsDate}</span>
            </div>
            <div className="flex items-center">
              <User size={16} className="mr-2" />
              <span>{t('news.author')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Main Content */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-xl shadow-soft p-8 mb-8">
                <div className="prose lg:prose-lg max-w-none">
                  {content.split('\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-4 text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Share Buttons */}
              <div className="flex items-center space-x-4 mb-8">
                <span className="text-gray-600 font-medium">{t('news.share')}:</span>
                <Button size="sm" variant="outline" className="rounded-full">
                  <Share2 size={16} />
                </Button>
              </div>

              {/* Back Button */}
              <Link 
                to="/news" 
                className="inline-flex items-center text-primary font-medium hover:underline transition-all"
              >
                <ChevronLeft size={18} className="mr-1" />
                {t('news.backToNews')}
              </Link>
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/3">
              {/* Related News */}
              <div className="bg-white rounded-xl shadow-soft p-6 mb-8">
                <h3 className="text-xl font-semibold mb-6">{t('news.related')}</h3>
                <div className="space-y-6">
                  {relatedNews.length > 0 ? (
                    relatedNews.map(item => (
                      <div key={item.id} className="flex items-start space-x-4">
                        <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                          <img 
                            src={item.image} 
                            alt={getLocalizedField(item, 'title')} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <Link 
                            to={`/news/${item.id}`} 
                            className="font-medium hover:text-primary transition-colors"
                          >
                            {getLocalizedField(item, 'title')}
                          </Link>
                          <div className="flex items-center text-gray-500 mt-2">
                            <Clock size={14} className="mr-1" />
                            <span className="text-xs">{formatDate(item.date)}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">{t('news.noRelated')}</p>
                  )}
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-xl shadow-soft p-6">
                <h3 className="text-xl font-semibold mb-6">{t('news.categories.title')}</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(newsCards.map(card => card.tag))).map((tag, index) => (
                    <Link 
                      key={index} 
                      to={`/news?category=${tag.toLowerCase()}`}
                      className="px-3 py-2 bg-gray-100 hover:bg-primary hover:text-white rounded-md transition-colors flex items-center"
                    >
                      <Tag size={14} className="mr-2" />
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NewsDetail;
