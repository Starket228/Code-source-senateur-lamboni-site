
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/Layout";
import { useLanguage } from "@/context/LanguageContext";

const NotFound = () => {
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-8xl font-bold text-primary mb-4">{t('404.title')}</h1>
        <p className="text-2xl text-gray-700 mb-8">{t('404.subtitle')}</p>
        <p className="text-gray-600 max-w-md mb-8">
          {t('404.description')}
        </p>
        <Link to="/" className="btn">
          {t('404.backToHome')}
        </Link>
      </div>
    </Layout>
  );
};

export default NotFound;
