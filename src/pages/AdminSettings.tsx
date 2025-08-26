import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSite } from '@/context/SiteContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft, Settings, Globe, Shield, Bell, Save } from 'lucide-react';
import { CrudService } from '@/utils/crudUtils';
import { Database } from '@/integrations/supabase/types';

// Type pour les données de site_settings
type SiteSettingsRow = Database['public']['Tables']['site_settings']['Row'];

interface SiteSettings {
  siteName: string;
  logoText: string;
  subTitle: string;
  newsTitle: string;
  newsSubtitle: string;
  programsTitle: string;
  programsSubtitle: string;
  activitiesTitle: string;
  activitiesSubtitle: string;
  documentsTitle: string;
  documentsSubtitle: string;
}

const AdminSettings = () => {
  const navigate = useNavigate();
  const { siteSettings, saveToDatabase, refreshData } = useSite();
  const [isLoading, setIsLoading] = useState(false);
  
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'Honorable Député',
    logoText: 'Bureau du Sénateur',
    subTitle: 'Au service du peuple togolais',
    newsTitle: 'Actualités',
    newsSubtitle: 'Restez informé de nos dernières activités',
    programsTitle: 'Nos Programmes',
    programsSubtitle: 'Découvrez nos initiatives et projets',
    activitiesTitle: 'Agenda',
    activitiesSubtitle: 'Nos prochains événements et activités',
    documentsTitle: 'Documents',
    documentsSubtitle: 'Accédez à nos documents officiels'
  });

  useEffect(() => {
    if (siteSettings) {
      setSettings({
        siteName: siteSettings.siteName || 'Honorable Député',
        logoText: siteSettings.logoText || 'Bureau du Sénateur',
        subTitle: siteSettings.subTitle || 'Au service du peuple togolais',
        newsTitle: siteSettings.newsTitle || 'Actualités',
        newsSubtitle: siteSettings.newsSubtitle || 'Restez informé de nos dernières activités',
        programsTitle: siteSettings.programsTitle || 'Nos Programmes',
        programsSubtitle: siteSettings.programsSubtitle || 'Découvrez nos initiatives et projets',
        activitiesTitle: siteSettings.activitiesTitle || 'Agenda',
        activitiesSubtitle: siteSettings.activitiesSubtitle || 'Nos prochains événements et activités',
        documentsTitle: siteSettings.documentsTitle || 'Documents',
        documentsSubtitle: siteSettings.documentsSubtitle || 'Accédez à nos documents officiels'
      });
    }
  }, [siteSettings]);

  const handleInputChange = (field: keyof SiteSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      console.log('AdminSettings: Saving settings:', settings);

      // Préparer les données pour la base de données
      const dbData = {
        site_name: settings.siteName,
        logo_text: settings.logoText,
        sub_title: settings.subTitle,
        news_title: settings.newsTitle,
        news_subtitle: settings.newsSubtitle,
        programs_title: settings.programsTitle,
        programs_subtitle: settings.programsSubtitle,
        activities_title: settings.activitiesTitle,
        activities_subtitle: settings.activitiesSubtitle,
        documents_title: settings.documentsTitle,
        documents_subtitle: settings.documentsSubtitle
      };

      // Utiliser upsert au lieu de create/update pour éviter les conflits
      const result = await CrudService.upsert('site_settings', {
        id: crypto.randomUUID(), // Générer un ID si c'est un nouveau record
        ...dbData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      if (!result.success) {
        throw new Error('Échec de la sauvegarde des paramètres');
      }

      console.log('AdminSettings: Settings saved successfully:', result.data);

      // Rafraîchir les données du contexte
      await refreshData();

      toast({
        title: "✅ Paramètres sauvegardés",
        description: "Les paramètres du site ont été mis à jour avec succès."
      });
    } catch (error) {
      console.error('AdminSettings: Error saving settings:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin')}
            className="mr-4 hover:bg-white/50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Paramètres du Site
              </h1>
              <p className="text-gray-600">Configurez les informations générales de votre site</p>
            </div>
          </div>
        </div>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Paramètres Généraux
            </CardTitle>
            <CardDescription>
              Configurez les informations principales de votre site web
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nom du site</label>
                <Input
                  value={settings.siteName}
                  onChange={(e) => handleInputChange('siteName', e.target.value)}
                  placeholder="Nom de votre site"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Texte du logo</label>
                <Input
                  value={settings.logoText}
                  onChange={(e) => handleInputChange('logoText', e.target.value)}
                  placeholder="Texte affiché avec le logo"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Sous-titre</label>
                <Input
                  value={settings.subTitle}
                  onChange={(e) => handleInputChange('subTitle', e.target.value)}
                  placeholder="Sous-titre du site"
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Titres des sections</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Titre - Actualités</label>
                  <Input
                    value={settings.newsTitle}
                    onChange={(e) => handleInputChange('newsTitle', e.target.value)}
                    placeholder="Titre de la section actualités"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sous-titre - Actualités</label>
                  <Input
                    value={settings.newsSubtitle}
                    onChange={(e) => handleInputChange('newsSubtitle', e.target.value)}
                    placeholder="Sous-titre de la section actualités"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Titre - Programmes</label>
                  <Input
                    value={settings.programsTitle}
                    onChange={(e) => handleInputChange('programsTitle', e.target.value)}
                    placeholder="Titre de la section programmes"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sous-titre - Programmes</label>
                  <Input
                    value={settings.programsSubtitle}
                    onChange={(e) => handleInputChange('programsSubtitle', e.target.value)}
                    placeholder="Sous-titre de la section programmes"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Titre - Activités</label>
                  <Input
                    value={settings.activitiesTitle}
                    onChange={(e) => handleInputChange('activitiesTitle', e.target.value)}
                    placeholder="Titre de la section activités"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sous-titre - Activités</label>
                  <Input
                    value={settings.activitiesSubtitle}
                    onChange={(e) => handleInputChange('activitiesSubtitle', e.target.value)}
                    placeholder="Sous-titre de la section activités"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Titre - Documents</label>
                  <Input
                    value={settings.documentsTitle}
                    onChange={(e) => handleInputChange('documentsTitle', e.target.value)}
                    placeholder="Titre de la section documents"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sous-titre - Documents</label>
                  <Input
                    value={settings.documentsSubtitle}
                    onChange={(e) => handleInputChange('documentsSubtitle', e.target.value)}
                    placeholder="Sous-titre de la section documents"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <Button 
                onClick={handleSaveSettings} 
                disabled={isLoading} 
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sauvegarde en cours...
                  </div>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Sauvegarder les paramètres
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;
