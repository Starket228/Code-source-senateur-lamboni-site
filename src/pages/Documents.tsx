import React, { useState, useMemo } from 'react';
import Layout from '@/components/Layout';
import { useSite } from '@/context/SiteContext';
import { useLanguage } from '@/context/LanguageContext';
import { FileText, Download, Search, Clock, FilePlus2, File, FileSpreadsheet, FileImage, Filter, Tag, ArrowDown, Eye, Star, TrendingUp, Archive, Calendar, ExternalLink, AlertTriangle } from 'lucide-react';
import { formatDateForUI } from '@/utils/dateUtils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const Documents = () => {
  const { documents } = useSite();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'type'>('date');

  // Improved link validation logic
  const isValidDocumentLink = (link: string): boolean => {
    if (!link || link.trim() === '' || link === '#') {
      return false;
    }

    try {
      const url = new URL(link);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const filteredDocuments = documents.filter((doc) =>
  doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  doc.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Build categories dynamically from actual documents
  const categories = useMemo(() => {
    const iconMap: Record<string, any> = {
      'rapports': FileText,
      'lois': FilePlus2,
      'communiqués': File,
      'études': FileSpreadsheet,
      'médias': FileImage,
    };
    const colorMap: Record<string, { gradient: string; bg: string }> = {
      'rapports': { gradient: 'from-blue-500 to-blue-600', bg: 'bg-blue-50' },
      'lois': { gradient: 'from-green-500 to-green-600', bg: 'bg-green-50' },
      'communiqués': { gradient: 'from-yellow-500 to-yellow-600', bg: 'bg-yellow-50' },
      'études': { gradient: 'from-purple-500 to-purple-600', bg: 'bg-purple-50' },
      'médias': { gradient: 'from-pink-500 to-pink-600', bg: 'bg-pink-50' },
    };
    const defaultColors = [
      { gradient: 'from-blue-500 to-blue-600', bg: 'bg-blue-50' },
      { gradient: 'from-green-500 to-green-600', bg: 'bg-green-50' },
      { gradient: 'from-yellow-500 to-yellow-600', bg: 'bg-yellow-50' },
      { gradient: 'from-purple-500 to-purple-600', bg: 'bg-purple-50' },
      { gradient: 'from-pink-500 to-pink-600', bg: 'bg-pink-50' },
    ];

    // Count documents per category (using a simple grouping on the first word or type)
    const catCounts = new Map<string, number>();
    documents.forEach(doc => {
      // Use category field if available, fallback to "Général"
      const cat = (doc as any).category || 'Général';
      catCounts.set(cat, (catCounts.get(cat) || 0) + 1);
    });

    // If no categories found, show a single "Tous les documents" category
    if (catCounts.size === 0) {
      return [{
        id: 'all',
        name: 'Tous les documents',
        icon: FileText,
        count: 0,
        color: defaultColors[0].gradient,
        bgColor: defaultColors[0].bg,
      }];
    }

    let colorIdx = 0;
    return Array.from(catCounts.entries()).map(([name, count]) => {
      const key = name.toLowerCase();
      const colors = colorMap[key] || defaultColors[colorIdx++ % defaultColors.length];
      return {
        id: key,
        name,
        icon: iconMap[key] || FileText,
        count,
        color: colors.gradient,
        bgColor: colors.bg,
      };
    });
  }, [documents]);


  const handleDownload = (link: string, title: string) => {
    console.log('Documents: Attempting to download document:', title, 'from URL:', link);

    if (!isValidDocumentLink(link)) {
      console.error('Documents: Invalid download link:', link);
      alert('Ce document n\'est pas disponible en téléchargement.');
      return;
    }

    // Open in new tab instead of direct download to avoid CORS issues
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <Layout className="bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Modern Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/5 to-green-600/10"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
        
        {/* Floating elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-br from-green-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-green-800 bg-clip-text text-transparent mb-6 leading-tight">
              {t('documents.title')}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              {t('documents.subtitle')}
            </p>
            
            {/* Modern search bar */}
            <div className="mt-12 max-w-2xl mx-auto">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-2 border border-white/20 shadow-xl">
                  <div className="flex items-center">
                    <Search className="w-5 h-5 text-gray-400 ml-4" />
                    <input
                      type="text"
                      placeholder="Rechercher des documents..."
                      className="flex-1 px-4 py-4 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)} />

                    <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-6 py-2 rounded-xl shadow-lg transition-all duration-300">
                      Rechercher
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Categories Grid */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Catégories de documents</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Explorez notre collection organisée par type de document</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category, index) =>
            <div
              key={category.id}
              className="group relative cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}>

                <div className={`absolute inset-0 bg-gradient-to-r ${category.color} rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                
                <div className={`relative ${category.bgColor} rounded-2xl p-6 text-center border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2`}>
                  <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <category.icon size={28} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{category.name}</h3>
                  <Badge className="bg-white/80 text-gray-700 border-0 shadow-md">
                    {category.count} documents
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Modern Filter Controls */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <span className="font-medium text-gray-700">Mode d'affichage:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`rounded-xl transition-all duration-300 ${
                    viewMode === 'grid' ?
                    'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-lg' :
                    'bg-white/80 border-gray-200 hover:border-blue-300'}`
                    }
                    onClick={() => setViewMode('grid')}>

                    <div className="grid grid-cols-2 gap-1 w-4 h-4 mr-2">
                      {[...Array(4)].map((_, i) =>
                      <div key={i} className="bg-current w-full h-full rounded-sm"></div>
                      )}
                    </div>
                    Grille
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`rounded-xl transition-all duration-300 ${
                    viewMode === 'list' ?
                    'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-lg' :
                    'bg-white/80 border-gray-200 hover:border-blue-300'}`
                    }
                    onClick={() => setViewMode('list')}>

                    <div className="flex flex-col gap-1 w-4 h-4 mr-2">
                      {[...Array(3)].map((_, i) =>
                      <div key={i} className="bg-current w-full h-1 rounded-sm"></div>
                      )}
                    </div>
                    Liste
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" className="bg-white/80 border-gray-200 hover:border-blue-300 rounded-xl transition-all duration-300">
                  <Filter size={16} className="mr-2" />
                  <span>Filtrer</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/80 border-gray-200 hover:border-blue-300 rounded-xl transition-all duration-300"
                  onClick={() => setSortBy(sortBy === 'date' ? 'name' : 'date')}>

                  <ArrowDown size={16} className="mr-2" />
                  <span>Trier par: {sortBy === 'date' ? 'Date' : 'Nom'}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Documents List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredDocuments.length > 0 ?
          <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "flex flex-col gap-4"}>
              {filteredDocuments.map((document, index) => {
              const hasValidLink = isValidDocumentLink(document.link);

              return viewMode === 'grid' ?
              <div key={document.id} className="group relative" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-green-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                      <div className="text-blue-600 mb-4 group-hover:text-green-600 transition-colors">
                        <FileText size={40} />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {document.title}
                      </h3>
                      <p className="text-gray-600 mb-4 text-sm line-clamp-3 leading-relaxed">
                        {document.description}
                      </p>
                      
                      <div className="flex items-center text-gray-500 mb-4">
                        <Calendar size={14} className="mr-2" />
                        <span className="text-sm">{formatDateForUI(document.created_at || null)}</span>
                        <div className="ml-auto">
                          {hasValidLink ?
                      <Star size={14} className="text-green-500" /> :

                      <AlertTriangle size={14} className="text-orange-500" />
                      }
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {hasValidLink ?
                    <button
                      onClick={() => handleDownload(document.link, document.title)}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl text-sm hover:from-blue-700 hover:to-green-700 transition-all duration-300 shadow-lg">

                            <ExternalLink size={14} className="mr-2" />
                            Ouvrir le document
                          </button> :

                    <div className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gray-300 text-gray-500 rounded-xl text-sm cursor-not-allowed">
                            <AlertTriangle size={14} className="mr-2" />
                            Non disponible
                          </div>
                    }
                        


                      </div>
                    </div>
                  </div> :

              <div key={document.id} className="group bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center" style={{ animationDelay: `${index * 50}ms` }}>
                    <div className="text-blue-600 mr-6 flex-shrink-0 group-hover:text-green-600 transition-colors">
                      <FileText size={32} />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 truncate group-hover:text-blue-600 transition-colors">
                        {document.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-1">{document.description}</p>
                    </div>
                    <div className="flex items-center text-gray-500 mr-6 flex-shrink-0">
                      <Calendar size={14} className="mr-2" />
                      <span className="text-sm whitespace-nowrap">{formatDateForUI(document.created_at || null)}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {hasValidLink ?
                  <button
                    onClick={() => handleDownload(document.link, document.title)}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl text-sm hover:from-blue-700 hover:to-green-700 transition-all duration-300 shadow-lg">

                          <ExternalLink size={14} className="mr-2" />
                          Ouvrir
                        </button> :

                  <div className="inline-flex items-center px-4 py-2 bg-gray-300 text-gray-500 rounded-xl text-sm cursor-not-allowed">
                          <AlertTriangle size={14} className="mr-2" />
                          Non disponible
                        </div>
                  }
                    </div>
                  </div>;

            })}
            </div> :

          <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="text-6xl mb-6">📂</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('documents.noResults')}</h3>
              <p className="text-gray-600 mb-8">{t('documents.noResultsDesc')}</p>
              <Button
              onClick={() => setSearchTerm('')}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-3 rounded-xl">

                {t('documents.resetSearch')}
              </Button>
            </div>
          }
        </div>
      </section>

      {/* Modern Featured Document */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-green-600 to-purple-600"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/3 p-8 lg:p-12 text-white flex flex-col justify-center">
                <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                  {t('documents.featured')}
                </h2>
                <p className="text-white/90 mb-8 leading-relaxed text-lg">
                  Le dernier rapport d'activité du Sénateur LM avec un résumé complet des réalisations et projets en cours.
                </p>
                <a href="#" className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-xl font-medium transition-all duration-300 hover:bg-gray-100 self-start shadow-lg transform hover:scale-105">
                  <Download size={18} className="mr-2" />
                  {t('documents.downloadReport')}
                </a>
              </div>
              
              <div className="lg:w-2/3 p-8 lg:p-12 bg-white/5 backdrop-blur-sm">
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-6">
                  Rapport Annuel d'Activité 2023-2024
                </h3>
                <p className="text-white/90 mb-8 leading-relaxed">
                  Ce rapport détaille l'ensemble des activités, interventions parlementaires et projets menés par le Sénateur LM durant l'année écoulée.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {[
                  {
                    number: '45+',
                    label: 'Sessions parlementaires',
                    color: 'from-blue-400 to-blue-600'
                  },
                  {
                    number: '12',
                    label: 'Projets de loi proposés',
                    color: 'from-green-400 to-green-600'
                  },
                  {
                    number: '30+',
                    label: 'Visites de terrain',
                    color: 'from-purple-400 to-purple-600'
                  }].
                  map((stat, index) =>
                  <div key={index} className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 transition-transform duration-300 hover:scale-105">
                      <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                        {stat.number}
                      </div>
                      <div className="text-white/80 text-sm">{stat.label}</div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center text-white/70">
                  <Calendar size={16} className="mr-2" />
                  <span className="text-sm">Publié le 30 Mai 2024 • 48 pages • PDF (8.5 MB)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>);

};

export default Documents;