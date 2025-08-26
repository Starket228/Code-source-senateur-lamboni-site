
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Globe, ChevronDown } from 'lucide-react';
import { useSite } from '@/context/SiteContext';
import { useLanguage } from '@/context/LanguageContext';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const location = useLocation();
  const {
    settings
  } = useSite();
  const {
    language,
    setLanguage,
    t
  } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Check if Admin link should be visible
  const showAdminLink = localStorage.getItem('isAdmin') === 'true';

  // Handle loading state when settings is null
  const logoText = settings?.logoText || 'Site Title';
  const subTitle = settings?.subTitle || 'Site Subtitle';

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'py-2 shadow-md bg-white/95 backdrop-blur-sm' 
        : 'py-4 bg-white'
    }`}>
      {/* Togolese flag stripe at top of header */}
      <div className="togo-flag-stripe shadow-sm"></div>
      
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gray-200 rounded-md overflow-hidden transition-transform duration-300 group-hover:scale-105">
              <img alt="Logo" className="w-full h-full object-cover" src="/lovable-uploads/1382ab96-04a4-448a-ab5f-65c7ab7beea4.jpg" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900 transition-colors group-hover:text-primary">{logoText}</h1>
              <p className="text-xs sm:text-sm text-accent">{subTitle}</p>
            </div>
          </Link>

          <button 
            className="lg:hidden p-2 text-gray-800 focus:outline-none hover:bg-gray-100 rounded-md transition-colors" 
            onClick={toggleMobileMenu} 
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>

          <nav className={`absolute lg:static top-full left-0 w-full lg:w-auto bg-white lg:bg-transparent shadow-md lg:shadow-none z-50 transition-all duration-300 ease-in-out transform ${
            mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0 pointer-events-none'
          } lg:transform-none lg:opacity-100 lg:pointer-events-auto`}>
            <ul className={`flex flex-col lg:flex-row items-center p-4 lg:p-0 space-y-4 lg:space-y-0 ${showAdminLink ? 'lg:space-x-1 xl:space-x-2' : 'lg:space-x-2 xl:space-x-3'}`}>
              <li><Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>{t('nav.home')}</Link></li>
              <li><Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>{t('nav.about')}</Link></li>
              <li><Link to="/programs" className={`nav-link ${isActive('/programs') ? 'active' : ''}`}>{t('nav.programs')}</Link></li>
              <li><Link to="/activities" className={`nav-link ${isActive('/activities') ? 'active' : ''}`}>{t('nav.activities')}</Link></li>
              <li><Link to="/news" className={`nav-link ${isActive('/news') ? 'active' : ''}`}>{t('nav.news')}</Link></li>
              <li><Link to="/documents" className={`nav-link ${isActive('/documents') ? 'active' : ''}`}>{t('nav.documents')}</Link></li>
              <li><Link to="/media" className={`nav-link ${isActive('/media') ? 'active' : ''}`}>{t('nav.media')}</Link></li>
              <li><Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>{t('nav.contact')}</Link></li>
              {showAdminLink && <li><Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`}>{t('nav.admin')}</Link></li>}
              
              <li className="lg:hidden flex items-center space-x-2 pt-4 border-t w-full justify-center">
                <button className={`font-medium transition-colors ${language === 'fr' ? 'text-gray-900 font-bold' : 'text-gray-500 hover:text-primary'}`} onClick={() => setLanguage('fr')}>
                  {t('language.fr')}
                </button>
                <span className="text-gray-400">|</span>
                <button className={`font-medium transition-colors ${language === 'en' ? 'text-gray-900 font-bold' : 'text-gray-500 hover:text-primary'}`} onClick={() => setLanguage('en')}>
                  {t('language.en')}
                </button>
              </li>
            </ul>
          </nav>

          <div className="hidden lg:flex items-center space-x-4">
            <div className="relative">
              <button 
                className="flex items-center space-x-1 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              >
                <Globe size={18} className="text-primary" />
                <span className="font-medium text-gray-700">{language === 'fr' ? t('language.fr') : t('language.en')}</span>
                <ChevronDown size={16} className={`text-gray-500 transition-transform ${isLanguageOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg overflow-hidden z-50 animate-in animate-up">
                  <div className="py-1">
                    <button 
                      className={`w-full text-left px-4 py-2 text-sm ${language === 'fr' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-gray-100'}`}
                      onClick={() => {
                        setLanguage('fr');
                        setIsLanguageOpen(false);
                      }}
                    >
                      {t('language.fr')}
                    </button>
                    <button 
                      className={`w-full text-left px-4 py-2 text-sm ${language === 'en' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-gray-100'}`}
                      onClick={() => {
                        setLanguage('en');
                        setIsLanguageOpen(false);
                      }}
                    >
                      {t('language.en')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
