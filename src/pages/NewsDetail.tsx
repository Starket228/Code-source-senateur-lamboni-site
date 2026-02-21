import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useSite } from '@/context/SiteContext';
import { useLanguage } from '@/context/LanguageContext';
import { ChevronLeft, Clock, User, Tag, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardType } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';

// ─── Helper : créer ou mettre à jour une balise <meta> dans le <head> ─────────
const setMetaTag = (attr: 'property' | 'name', key: string, content: string) => {
  let el = document.querySelector(`meta[${attr}='${key}']`) as HTMLMetaElement;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

// ─── Helper : supprimer une balise <meta> du <head> ──────────────────────────
const removeMetaTag = (attr: 'property' | 'name', key: string) => {
  const el = document.querySelector(`meta[${attr}='${key}']`);
  if (el) el.remove();
};

// ─── Injecte les Open Graph / Twitter Card meta tags ─────────────────────────
const injectSocialMeta = (
  title: string,
  description: string,
  image: string,
  url: string,
) => {
  document.title = title;

  // Open Graph — Facebook, WhatsApp, LinkedIn, Telegram…
  setMetaTag('property', 'og:type',        'article');
  setMetaTag('property', 'og:title',       title);
  setMetaTag('property', 'og:description', description);
  setMetaTag('property', 'og:image',       image);
  setMetaTag('property', 'og:url',         url);
  setMetaTag('property', 'og:image:width',  '1200');
  setMetaTag('property', 'og:image:height', '630');

  // Twitter Card
  setMetaTag('name', 'twitter:card',        'summary_large_image');
  setMetaTag('name', 'twitter:title',       title);
  setMetaTag('name', 'twitter:description', description);
  setMetaTag('name', 'twitter:image',       image);
};

// ─── Supprime les meta tags injectés dynamiquement ───────────────────────────
const cleanSocialMeta = (defaultTitle = '') => {
  document.title = defaultTitle;
  ['og:type', 'og:title', 'og:description', 'og:image', 'og:url', 'og:image:width', 'og:image:height'].forEach(
    k => removeMetaTag('property', k),
  );
  ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'].forEach(
    k => removeMetaTag('name', k),
  );
};

// ─── Composant principal ──────────────────────────────────────────────────────
const NewsDetail = () => {
  const { id } = useParams();
  const { newsCards } = useSite();
  const { t, language } = useLanguage();
  const [news, setNews]               = useState<CardType | null>(null);
  const [relatedNews, setRelatedNews] = useState<CardType[]>([]);
  const [loading, setLoading]         = useState(true);

  // ── Fetch de l'article ────────────────────────────────────────────────────
  useEffect(() => {
    const fetchNewsDetails = async () => {
      setLoading(true);

      try {
        if (id) {
          const { data, error } = await supabase
            .from('news')
            .select('*')
            .eq('id', id)
            .single();

          if (error) {
            console.error('Error fetching news details from Supabase:', error);
            // Fallback sur les données locales
            const newsItem = newsCards.find(item => item.id === id);
            if (newsItem) {
              setNews(newsItem);
              const related = newsCards
                .filter(item => item.id !== id && item.tag === newsItem.tag)
                .slice(0, 3);
              setRelatedNews(related);
            }
          } else if (data) {
            const formattedNews: CardType = {
              id:          data.id,
              image:       data.image,
              tag:         data.tag,
              title:       data.title,
              description: data.description,
              content:     data.content,
              link:        data.link,
              date:        data.date,
            };
            setNews(formattedNews);

            const { data: relatedData, error: relatedError } = await supabase
              .from('news')
              .select('*')
              .eq('tag', data.tag)
              .neq('id', id)
              .limit(3);

            if (relatedError) {
              console.error('Error fetching related news:', relatedError);
            } else if (relatedData) {
              setRelatedNews(
                relatedData.map(item => ({
                  id:          item.id,
                  image:       item.image,
                  tag:         item.tag,
                  title:       item.title,
                  description: item.description,
                  content:     item.content,
                  link:        item.link,
                  date:        item.date,
                })),
              );
            }
          }
        }
      } catch (err) {
        console.error('Error in news detail fetch:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetails();
  }, [id, newsCards]);

  // ── Injection des meta tags Open Graph dès que `news` est disponible ─────
  useEffect(() => {
    if (!news) return;

    const title       = getLocalizedField(news, 'title');
    const description = getLocalizedField(news, 'description');
    const url         = window.location.href;

    // S'assure que l'image est une URL absolue (les scrapers sociaux
    // ne savent pas résoudre les chemins relatifs)
    const rawImage = news.image ?? '';
    const image    = rawImage.startsWith('http')
      ? rawImage
      : `${window.location.origin}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`;

    injectSocialMeta(title, description, image, url);

    // Nettoyage au démontage (retour vers une autre page)
    return () => cleanSocialMeta('Nom de votre site');
  }, [news, language]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const getLocalizedField = (item: any, field: string) => {
    if (language === 'en' && item?.translations?.en?.[field]) {
      return item.translations.en[field];
    }
    return item[field];
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '15 Juin 2024';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: 'numeric', month: 'long', year: 'numeric',
      });
    } catch {
      return '15 Juin 2024';
    }
  };

  // ── Partage ───────────────────────────────────────────────────────────────
  const shareOn = (platform: 'whatsapp' | 'facebook' | 'twitter') => {
    const url  = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(news?.title ?? '');
    const urls: Record<typeof platform, string> = {
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter:  `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
    };
    window.open(urls[platform], '_blank');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  // ── États ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8" />
            <div className="h-64 bg-gray-200 rounded mb-6" />
            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-4" />
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

  const content  = getLocalizedField(news, 'content') || getLocalizedField(news, 'description');
  const newsDate = formatDate(news.date);

  // ── Rendu ─────────────────────────────────────────────────────────────────
  return (
    <Layout>
      {/* Hero */}
      <section
        className="relative h-[400px] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${news.image})`,
        }}
      >
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

      {/* Contenu */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-10">

            {/* Article principal */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-xl shadow-soft p-8 mb-8">
                <div className="prose lg:prose-lg max-w-none">
                  {content.split('\n').map((paragraph: string, idx: number) => (
                    <p key={idx} className="mb-4 text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Boutons de partage */}
              <div className="flex items-center flex-wrap gap-2 mb-8">
                <span className="text-gray-600 font-medium">{t('news.share')} :</span>
                <Button size="sm" variant="outline" className="rounded-full" onClick={() => shareOn('whatsapp')}>
                  WhatsApp
                </Button>
                <Button size="sm" variant="outline" className="rounded-full" onClick={() => shareOn('facebook')}>
                  Facebook
                </Button>
                <Button size="sm" variant="outline" className="rounded-full" onClick={() => shareOn('twitter')}>
                  X / Twitter
                </Button>
                <Button size="sm" variant="outline" className="rounded-full" onClick={copyLink}>
                  <Share2 size={16} className="mr-1" /> Copier
                </Button>
              </div>

              {/* Retour */}
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
              {/* Articles liés */}
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

              {/* Catégories */}
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
