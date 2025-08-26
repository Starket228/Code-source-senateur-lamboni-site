
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { cn } from '@/lib/utils';
import { useSite } from '@/context/SiteContext';
import { Loader2, Sparkles } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  hideLoader?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, className, hideLoader = false }) => {
  const location = useLocation();
  const { isLoading } = useSite();
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const [content, setContent] = useState(children);
  const [prevPathname, setPrevPathname] = useState(location.pathname);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, [location.pathname]);

  useEffect(() => {
    if (prevPathname !== location.pathname) {
      setIsPageTransitioning(true);
      
      const timer = setTimeout(() => {
        setContent(children);
        setIsPageTransitioning(false);
        setPrevPathname(location.pathname);
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      setContent(children);
    }
  }, [location.pathname, children, prevPathname]);

  if (isLoading && !hideLoader) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        <div className="togo-flag-shine-stripe"></div>
        <Header />
        
        <main className="flex-grow pt-[90px] flex items-center justify-center relative">
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(10)].map((_, i) => (
              <div 
                key={i}
                style={{
                  width: `${Math.random() * 150 + 50}px`,
                  height: `${Math.random() * 150 + 50}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${Math.random() * 20 + 10}s`,
                }}
                className="absolute rounded-full bg-primary/5 animate-float"
              ></div>
            ))}
          </div>
          
          <div className="text-center relative z-10">
            <div className="w-20 h-20 relative mx-auto mb-6 glass-card p-4 rounded-xl">
              <div className="w-full h-full relative">
                <Loader2 className="h-12 w-12 animate-spin text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute inset-0 bg-primary/5 rounded-full animate-pulse"></div>
                <div className="absolute -inset-2 border border-primary/20 rounded-full animate-ping opacity-20"></div>
              </div>
            </div>
            
            <div className="glass-card p-6 rounded-xl shadow-soft border border-white/30 backdrop-blur-sm">
              <h3 className="text-xl font-medium text-primary mb-2 flex items-center justify-center">
                <Sparkles className="w-5 h-5 mr-2 text-yellow-400" />
                Chargement en cours
                <Sparkles className="w-5 h-5 ml-2 text-yellow-400" />
              </h3>
              <p className="text-gray-500">Merci de patienter...</p>
              
              <div className="mt-4 h-1.5 w-64 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full loading-progress"></div>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-10 left-10 w-32 h-32 bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-xl"></div>
          <div className="absolute top-20 right-10 w-40 h-40 bg-gradient-to-bl from-secondary/5 to-primary/5 rounded-full blur-xl"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      <div className="absolute inset-0 section-pattern-dots opacity-[0.03] pointer-events-none"></div>
      
      <div className="togo-flag-shine-stripe"></div>
      <Header />
      <main 
        className={cn(
          "flex-grow pt-[90px] transition-all duration-500",
          isPageTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0",
          className
        )}
      >
        <div className="page-transition-enter-active">
          {content}
        </div>
      </main>
      <Footer />
      
      <div className="fixed top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl pointer-events-none"></div>
    </div>
  );
};

export default Layout;
