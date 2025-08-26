import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';
import { useSite } from '@/context/SiteContext';
import { useLanguage } from '@/context/LanguageContext';

const Footer: React.FC = () => {
  const { settings } = useSite();
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  
  // Handle loading state when settings is null
  const logoText = settings?.logoText || 'Site Title';
  const subTitle = settings?.subTitle || 'Site Subtitle';
  const siteName = settings?.siteName || 'Site Name';
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-12 w-12 bg-white/10 rounded-full flex items-center justify-center">
                <img alt="Logo" className="h-8 w-8" src="/lovable-uploads/bd23fae5-d7b8-4d3f-97aa-fd3ad3c2a6e2.jpg" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{logoText}</h2>
                <p className="text-sm text-accent">{subTitle}</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6">
              Bureau du Sénateur dédié au développement et à la prospérité du Togo. Ensemble, construisons un avenir meilleur.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Youtube size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6 relative inline-block">
              {t('footer.quickLinks')}
              <span className="absolute bottom-[-8px] left-0 h-[2px] w-10 bg-primary"></span>
            </h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">{t('nav.home')}</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">{t('nav.about')}</Link></li>
              <li><Link to="/programs" className="text-gray-400 hover:text-white transition-colors">{t('nav.programs')}</Link></li>
              <li><Link to="/activities" className="text-gray-400 hover:text-white transition-colors">{t('nav.activities')}</Link></li>
              <li><Link to="/news" className="text-gray-400 hover:text-white transition-colors">{t('nav.news')}</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6 relative inline-block">
              {t('footer.resources')}
              <span className="absolute bottom-[-8px] left-0 h-[2px] w-10 bg-primary"></span>
            </h3>
            <ul className="space-y-3">
              <li><Link to="/documents" className="text-gray-400 hover:text-white transition-colors">{t('nav.documents')}</Link></li>
              <li><Link to="/media" className="text-gray-400 hover:text-white transition-colors">{t('nav.media')}</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">{t('nav.contact')}</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Politique de confidentialité</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6 relative inline-block">
              {t('footer.newsletter')}
              <span className="absolute bottom-[-8px] left-0 h-[2px] w-10 bg-primary"></span>
            </h3>
            <p className="text-gray-400 mb-4">{t('footer.newsletterDesc')}</p>
            <form className="flex mb-6">
              <input type="email" placeholder={t('footer.emailPlaceholder')} className="bg-white/10 px-4 py-2 rounded-l-md flex-1 focus:outline-none focus:ring-1 focus:ring-primary text-white" />
              <button type="submit" className="bg-primary hover:bg-primary-hover px-4 rounded-r-md transition-colors">
                <Mail size={20} />
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-6 text-center">
          <p className="text-gray-500">
            &copy; {currentYear} {siteName}. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
