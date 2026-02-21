
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSite } from '@/context/SiteContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ImageUpload } from '@/components/ui/image-upload';
import { toast } from '@/components/ui/use-toast';
import { Loader2, Save, ArrowLeft, Sparkles, Eye, Palette, Image as ImageIcon } from 'lucide-react';
import { CrudService } from '@/utils/crudUtils';

const AdminHero = () => {
  const {
    heroData,
    setHero,
    refreshData,
    isLoading
  } = useSite();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    buttonText: '',
    backgroundImage: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (heroData) {
      setFormData({
        title: heroData.title,
        description: heroData.description,
        buttonText: heroData.buttonText,
        backgroundImage: heroData.backgroundImage
      });
    }
  }, [heroData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      backgroundImage: value
    }));
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.description.trim() || !formData.buttonText.trim()) {
      toast({
        title: 'Champs requis manquants',
        description: 'Veuillez remplir tous les champs obligatoires.',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsSaving(true);
      console.log('AdminHero: Saving hero data:', formData);

      // Préparer les données pour la base de données
      const heroDataToSave: any = {
        title: formData.title,
        description: formData.description,
        button_text: formData.buttonText,
        background_image: formData.backgroundImage,
      };

      let result;
      // Check if hero already exists in DB
      const existingCheck = await CrudService.read('hero_section');
      if (existingCheck.success && existingCheck.data && existingCheck.data.length > 0) {
        result = await CrudService.update('hero_section', (existingCheck.data[0] as any).id, heroDataToSave);
      } else {
        result = await CrudService.create('hero_section', heroDataToSave);
      }

      if (result.success) {
        console.log('AdminHero: Hero saved successfully:', result.data);
        
        // Mettre à jour l'état local
        setHero({
          title: formData.title,
          description: formData.description,
          buttonText: formData.buttonText,
          backgroundImage: formData.backgroundImage
        });

        // Rafraîchir les données du contexte
        await refreshData();

        toast({
          title: 'Section hero mise à jour',
          description: 'Les modifications ont été enregistrées avec succès.'
        });
      } else {
        throw new Error(result.error?.message || 'Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('AdminHero: Error saving hero section:', error);
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Une erreur est survenue lors de la sauvegarde. Veuillez réessayer.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin text-white" />
          </div>
          <span className="text-gray-700 font-medium">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3 sm:p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header - Mobile optimized */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 sm:mb-8 gap-3 sm:gap-0">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin')} 
            className="mr-0 sm:mr-4 hover:bg-white/50 text-sm sm:text-base"
            size="sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <div className="flex items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
              <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Gestion de la Section Hero
              </h1>
              <p className="text-sm sm:text-base text-gray-600">Personnalisez l'accueil de votre site</p>
            </div>
          </div>
        </div>

        {/* Content - Responsive grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Edit Form */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl order-2 xl:order-1">
            <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
              <div className="flex items-start sm:items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">Éditer les contenus</CardTitle>
                  <CardDescription className="text-xs sm:text-base text-gray-600 hidden sm:block">
                    Personnalisez le texte et l'image de la section d'accueil
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
              <div className="space-y-2 sm:space-y-3">
                <label htmlFor="title" className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-1 sm:gap-2">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full"></span>
                  Titre principal *
                </label>
                <Input 
                  id="title" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleInputChange} 
                  placeholder="Entrez le titre principal" 
                  className="h-10 sm:h-12 bg-white/70 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base" 
                  required 
                />
              </div>
              
              <div className="space-y-2 sm:space-y-3">
                <label htmlFor="description" className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-1 sm:gap-2">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full"></span>
                  Description *
                </label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  placeholder="Entrez une description engageante" 
                  rows={3}
                  className="bg-white/70 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base" 
                  required 
                />
              </div>
              
              <div className="space-y-2 sm:space-y-3">
                <label htmlFor="buttonText" className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-1 sm:gap-2">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full"></span>
                  Texte du bouton *
                </label>
                <Input 
                  id="buttonText" 
                  name="buttonText" 
                  value={formData.buttonText} 
                  onChange={handleInputChange} 
                  placeholder="Texte du bouton d'action" 
                  className="h-10 sm:h-12 bg-white/70 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base" 
                  required 
                />
              </div>
              
              <ImageUpload
                value={formData.backgroundImage}
                onChange={handleImageChange}
                label="Image d'arrière-plan"
                placeholder="https://exemple.com/image.jpg"
                previewClassName="aspect-video"
              />

              <div className="bg-amber-50 border border-amber-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-amber-800">
                  <strong>Conseil:</strong> Utilisez des images de haute qualité (1920x1080px minimum) pour un rendu optimal sur tous les écrans.
                </p>
              </div>
            </CardContent>
            <CardFooter className="px-4 sm:px-6 pb-4 sm:pb-6">
              <Button 
                onClick={handleSave} 
                disabled={isSaving} 
                className="w-full h-10 sm:h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Enregistrer
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
          
          {/* Preview */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl order-1 xl:order-2">
            <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
              <div className="flex items-start sm:items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">Aperçu en temps réel</CardTitle>
                  <CardDescription className="text-xs sm:text-base text-gray-600 hidden sm:block">
                    Prévisualisation de la section hero
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="aspect-video rounded-lg sm:rounded-xl overflow-hidden relative mb-3 sm:mb-4 shadow-lg">
                {formData.backgroundImage ? (
                  <div className="w-full h-full bg-cover bg-center relative" style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.8)), url(${formData.backgroundImage})`
                  }}>
                    <div className="absolute bottom-0 left-0 p-3 sm:p-6 text-white">
                      <h2 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2 drop-shadow-lg">
                        {formData.title || "Titre principal"}
                      </h2>
                      <p className="text-xs sm:text-sm mb-2 sm:mb-4 opacity-90 drop-shadow line-clamp-2">
                        {formData.description || "Description de votre section hero"}
                      </p>
                      <button className="px-3 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md sm:rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 text-xs sm:text-sm">
                        {formData.buttonText || "Bouton d'action"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-dashed border-gray-300">
                    <div className="text-center p-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        <ImageIcon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Aucune image sélectionnée</h3>
                      <p className="text-gray-500 text-xs sm:text-sm">L'image par défaut sera utilisée</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-blue-800">
                  <strong>Note:</strong> Cet aperçu est une représentation simplifiée. L'apparence réelle peut varier légèrement selon l'appareil utilisé.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminHero;
