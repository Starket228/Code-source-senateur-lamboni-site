import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useSite } from '@/context/SiteContext';
import { useLanguage } from '@/context/LanguageContext';
import { ChevronLeft, ArrowRight, Calendar, MapPin, Users, Target, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ProgramType } from '@/lib/types';
const ProgramDetail = () => {
  const {
    id
  } = useParams();
  const {
    programs
  } = useSite();
  const {
    t,
    language
  } = useLanguage();
  const [program, setProgram] = useState<ProgramType | null>(null);
  const [relatedPrograms, setRelatedPrograms] = useState<ProgramType[]>([]);
  useEffect(() => {
    // Find the program with the matching ID
    const programItem = programs.find(item => item.id === id);
    if (programItem) {
      setProgram(programItem);

      // Get 3 related programs from the same category
      const related = programs.filter(item => item.id !== id && item.tag === programItem.tag).slice(0, 3);
      setRelatedPrograms(related);
    }
  }, [id, programs]);
  const getLocalizedField = (item: any, field: string) => {
    if (language === 'en' && item?.translations?.en && item.translations.en[field]) {
      return item.translations.en[field];
    }
    return item[field];
  };
  if (!program) {
    return <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">{t('programs.notFound')}</h1>
          <p className="mb-8">{t('programs.notFoundDescription')}</p>
          <Link to="/programs" className="btn">
            {t('programs.backToPrograms')}
          </Link>
        </div>
      </Layout>;
  }
  const description = getLocalizedField(program, 'description');
  return <Layout>
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center bg-cover bg-center" style={{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${program.image})`
    }}>
        <div className="container mx-auto px-4 text-center">
          <span className="card-tag mb-4">{program.tag}</span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            {getLocalizedField(program, 'title')}
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Main Content */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-xl shadow-soft p-8 mb-8">
                {/* Program Overview */}
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">{t('programs.overview')}</h2>
                  <div className="prose lg:prose-lg max-w-none">
                    {description.split('\n').map((paragraph, idx) => <p key={idx} className="mb-4 text-gray-700 leading-relaxed">
                        {paragraph}
                      </p>)}
                  </div>
                </div>

                {/* Program Details */}
                

                {/* Key Activities */}
                

                {/* Call to Action */}
                
              </div>

              {/* Back Button */}
              <Link to="/programs" className="inline-flex items-center text-primary font-medium hover:underline transition-all">
                <ChevronLeft size={18} className="mr-1" />
                {t('programs.backToPrograms')}
              </Link>
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/3">
              {/* Related Programs */}
              <div className="bg-white rounded-xl shadow-soft p-6 mb-8">
                <h3 className="text-xl font-semibold mb-6">{t('programs.similarPrograms')}</h3>
                <div className="space-y-6">
                  {relatedPrograms.length > 0 ? relatedPrograms.map(item => <div key={item.id} className="flex items-start space-x-4">
                        <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                          <img src={item.image} alt={getLocalizedField(item, 'title')} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <Link to={`/programs/${item.id}`} className="font-medium hover:text-primary transition-colors">
                            {getLocalizedField(item, 'title')}
                          </Link>
                          <div className="flex items-center text-gray-500 mt-2">
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{item.tag}</span>
                          </div>
                        </div>
                      </div>) : <p className="text-gray-500">{t('programs.noSimilar')}</p>}
                </div>
              </div>

              {/* Program Stats */}
              

              {/* Contact Info */}
              <div className="bg-white rounded-xl shadow-soft p-6">
                <h3 className="text-xl font-semibold mb-6">{t('contact.title')}</h3>
                <p className="text-gray-600 mb-4">
                  {t('programs.contactInfo')}
                </p>
                
                <Button variant="outline" className="w-full">
                  {t('contact.send')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>;
};
export default ProgramDetail;