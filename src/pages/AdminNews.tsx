import React, { useState, useEffect } from 'react';
import { useSite } from '@/context/SiteContext';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription
} from '@/components/ui/card';
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { NewsImageUpload } from '@/components/admin/NewsImageUpload';
import { Eye, Edit, Trash2, Plus, ArrowLeft } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { CardType } from '@/lib/types';
import Layout from '@/components/Layout';
import { CrudService } from '@/utils/crudUtils';
import { useIsMobile } from '@/hooks/use-mobile';
import CategoryManager from '@/components/admin/CategoryManager';
import { CategoryService } from '@/utils/categoryUtils';

const AdminNews = () => {
  const { newsCards, refreshData } = useSite();
  const [news, setNews] = useState<CardType[]>(newsCards);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentNews, setCurrentNews] = useState<CardType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Sync local news state with context
  useEffect(() => {
    setNews(newsCards);
  }, [newsCards]);

  const [formData, setFormData] = useState<{
    id?: string;
    title: string;
    description: string;
    content: string;
    image: string;
    tag: string;
    link: string;
  }>({
    title: '',
    description: '',
    content: '',
    image: '',
    tag: '',
    link: '#',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setIsCategoriesLoading(true);
    try {
      const result = await CategoryService.getCategories('news');
      if (result.success && result.data) {
        setCategories(result.data);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setIsCategoriesLoading(false);
    }
  };

  const handleCreateCategory = async (data: { name: string; description?: string }) => {
    const result = await CategoryService.createCategory({
      ...data,
      type: 'news'
    });
    if (result.success) {
      await loadCategories();
      await refreshData();
    }
  };

  const handleUpdateCategory = async (id: string, data: { name: string; description?: string }) => {
    const result = await CategoryService.updateCategory(id, data);
    if (result.success) {
      await loadCategories();
      await refreshData();
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const result = await CategoryService.deleteCategory(id);
    if (result.success) {
      await loadCategories();
      await refreshData();
    }
  };

  const handleOpenDialog = (newsItem?: CardType) => {
    if (newsItem) {
      setCurrentNews(newsItem);
      setFormData({
        id: newsItem.id,
        title: newsItem.title,
        description: newsItem.description,
        content: newsItem.content || '',
        image: newsItem.image,
        tag: newsItem.tag,
        link: newsItem.link || '#',
      });
    } else {
      setCurrentNews(null);
      setFormData({
        title: '',
        description: '',
        content: '',
        image: '',
        tag: '',
        link: '#',
      });
    }
    setIsDialogOpen(true);
  };

  const handleOpenDeleteDialog = (newsItem: CardType) => {
    setCurrentNews(newsItem);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (value: string) => {
    setFormData(prev => ({ ...prev, image: value }));
  };

  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const newsData = {
        id: formData.id || crypto.randomUUID(),
        title: formData.title,
        description: formData.description,
        content: formData.content,
        image: formData.image,
        tag: formData.tag,
        link: formData.link,
      };

      let result;
      if (currentNews) {
        result = await CrudService.update('news', newsData.id, newsData);
      } else {
        result = await CrudService.create('news', newsData);
      }

      if (result.success) {
        const updatedNews: CardType = {
          id: result.data.id,
          title: result.data.title,
          description: result.data.description,
          content: result.data.content || '',
          image: result.data.image,
          tag: result.data.tag,
          date: result.data.created_at || new Date().toISOString(),
          link: result.data.link || '#',
        };

        if (currentNews) {
          setNews(news.map(item => 
            item.id === updatedNews.id ? updatedNews : item
          ));
        } else {
          setNews([updatedNews, ...news]);
        }

        await refreshData();
        await loadCategories();
        
        setIsDialogOpen(false);
        toast({
          title: currentNews ? "Actualité mise à jour" : "Actualité ajoutée",
          description: currentNews ? "L'actualité a été mise à jour avec succès." : "Une nouvelle actualité a été ajoutée.",
        });
      } else {
        throw new Error(result.error?.message || 'Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Error saving news:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de l'enregistrement de l'actualité.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNews = async () => {
    if (!currentNews) return;
    
    setIsLoading(true);
    try {
      const result = await CrudService.delete('news', currentNews.id);
      
      if (result.success) {
        setNews(news.filter(item => item.id !== currentNews.id));
        await refreshData();
        await loadCategories();
        
        setIsDeleteDialogOpen(false);
        toast({
          title: "Actualité supprimée",
          description: "L'actualité a été supprimée avec succès.",
        });
      } else {
        throw new Error(result.error?.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Error deleting news:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la suppression de l'actualité.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout hideLoader>
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-7xl">
        <div className="mb-6 sm:mb-8">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/admin')}
            className="mb-4 sm:mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour
          </Button>
        </div>
        
        <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4 sm:pb-6 px-4 sm:px-6 pt-4 sm:pt-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
              <div>
                <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">Gestion des Actualités</CardTitle>
                <CardDescription className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
                  Ajoutez, modifiez ou supprimez des actualités du site
                </CardDescription>
              </div>
              <Button onClick={() => handleOpenDialog()} className="bg-primary hover:bg-primary/90 w-full sm:w-auto" size={isMobile ? "sm" : "default"}>
                <Plus className="mr-2 h-4 w-4" /> Ajouter
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              {isMobile ? (
                <div className="space-y-3 p-4">
                  {news.map(newsItem => (
                    <div key={newsItem.id} className="border rounded-lg p-3 bg-white hover:bg-gray-50/50">
                      <div className="flex gap-3 mb-3">
                        <img 
                          src={newsItem.image} 
                          alt={newsItem.title} 
                          className="w-16 h-12 object-cover rounded-md border flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate">{newsItem.title}</h3>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-1">
                            {newsItem.tag}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild className="flex-1">
                          <Link to={`/news/${newsItem.id}`}>
                            <Eye className="h-3 w-3 mr-1" />
                            Voir
                          </Link>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleOpenDialog(newsItem)}
                          className="flex-1"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Modifier
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleOpenDeleteDialog(newsItem)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 px-2"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Table>
                  <TableCaption className="py-4">Liste des actualités du site</TableCaption>
                  <TableHeader>
                    <TableRow className="border-gray-200">
                      <TableHead className="w-[100px] font-semibold">Image</TableHead>
                      <TableHead className="font-semibold">Titre</TableHead>
                      <TableHead className="hidden md:table-cell font-semibold">Catégorie</TableHead>
                      <TableHead className="text-right font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {news.map(newsItem => (
                      <TableRow key={newsItem.id} className="hover:bg-gray-50/50">
                        <TableCell className="py-4">
                          <img 
                            src={newsItem.image} 
                            alt={newsItem.title} 
                            className="w-16 h-12 object-cover rounded-md border"
                          />
                        </TableCell>
                        <TableCell className="font-medium py-4">{newsItem.title}</TableCell>
                        <TableCell className="hidden md:table-cell py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {newsItem.tag}
                          </span>
                        </TableCell>
                        <TableCell className="text-right py-4">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/news/${newsItem.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleOpenDialog(newsItem)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleOpenDeleteDialog(newsItem)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>

        <CategoryManager
          categories={categories}
          onCreateCategory={handleCreateCategory}
          onUpdateCategory={handleUpdateCategory}
          onDeleteCategory={handleDeleteCategory}
          isLoading={isCategoriesLoading}
          title="Catégories des actualités"
        />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className={`${isMobile ? 'max-w-[95vw] max-h-[90vh] h-[90vh]' : 'max-w-4xl max-h-[90vh]'} overflow-y-auto`}>
            <DialogHeader className="pb-4 sm:pb-6">
              <DialogTitle className="text-lg sm:text-xl font-semibold">
                {currentNews ? "Modifier l'actualité" : "Ajouter une actualité"}
              </DialogTitle>
              <DialogDescription className="text-sm sm:text-base text-gray-600">
                {currentNews ? "Modifiez les informations de l'actualité" : "Remplissez le formulaire pour ajouter une nouvelle actualité"}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSaveNews} className={`space-y-6 ${isMobile ? 'space-y-4' : 'space-y-8'}`}>
              <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'lg:grid-cols-2 gap-8'}`}>
                <div className={`space-y-4 ${isMobile ? 'space-y-4' : 'space-y-6'}`}>
                  <div className="space-y-2 sm:space-y-3">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Titre de l'actualité <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      id="title" 
                      name="title" 
                      value={formData.title} 
                      onChange={handleInputChange}
                      required
                      className="w-full text-sm"
                      placeholder="Entrez le titre de l'actualité"
                    />
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3">
                    <label htmlFor="tag" className="block text-sm font-medium text-gray-700">
                      Catégorie <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      id="tag" 
                      name="tag" 
                      value={formData.tag} 
                      onChange={handleInputChange}
                      required
                      className="w-full text-sm"
                      placeholder="Ex: Information, Événement, etc."
                      list="categories-list"
                    />
                    <datalist id="categories-list">
                      {categories.map(category => (
                        <option key={category.id} value={category.name} />
                      ))}
                    </datalist>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Image de l'actualité <span className="text-red-500">*</span>
                    </label>
                    <NewsImageUpload
                      value={formData.image}
                      onChange={handleImageChange}
                      required
                    />
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <label htmlFor="link" className="block text-sm font-medium text-gray-700">
                      Lien externe (optionnel)
                    </label>
                    <Input 
                      id="link" 
                      name="link" 
                      value={formData.link} 
                      onChange={handleInputChange}
                      className="w-full text-sm"
                      placeholder="https://exemple.com"
                    />
                  </div>
                </div>
                
                <div className={`space-y-4 ${isMobile ? 'space-y-4' : 'space-y-6'}`}>
                  <div className="space-y-2 sm:space-y-3">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description courte <span className="text-red-500">*</span>
                    </label>
                    <Textarea 
                      id="description" 
                      name="description" 
                      value={formData.description} 
                      onChange={handleInputChange}
                      required
                      rows={isMobile ? 4 : 5}
                      className="w-full resize-none text-sm"
                      placeholder="Résumé de l'actualité..."
                    />
                    <p className="text-xs text-gray-500">
                      Description qui apparaîtra dans la liste des actualités
                    </p>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3">
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                      Contenu complet <span className="text-red-500">*</span>
                    </label>
                    <Textarea 
                      id="content" 
                      name="content" 
                      value={formData.content} 
                      onChange={handleInputChange}
                      required
                      rows={isMobile ? 8 : 10}
                      className="w-full resize-none text-sm"
                      placeholder="Contenu détaillé de l'actualité..."
                    />
                    <p className="text-xs text-gray-500">
                      Contenu complet qui sera affiché sur la page de l'actualité
                    </p>
                  </div>
                </div>
              </div>
              
              <DialogFooter className={`pt-4 sm:pt-6 border-t border-gray-200 ${isMobile ? 'flex-col gap-2' : ''}`}>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className={`${isMobile ? 'order-2 w-full' : 'order-1'}`}
                >
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className={`bg-primary hover:bg-primary/90 ${isMobile ? 'order-1 w-full' : 'order-2'}`}
                >
                  {isLoading ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className={`${isMobile ? 'max-w-[95vw]' : 'max-w-md'}`}>
            <DialogHeader className="pb-4">
              <DialogTitle className="text-lg text-red-600">Confirmer la suppression</DialogTitle>
              <DialogDescription className="text-sm sm:text-base text-gray-600">
                Êtes-vous sûr de vouloir supprimer cette actualité ? Cette action est irréversible.
              </DialogDescription>
            </DialogHeader>
            
            <DialogFooter className={`pt-4 ${isMobile ? 'flex-col gap-2' : ''}`}>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDeleteDialogOpen(false)}
                className={`${isMobile ? 'order-2 w-full' : 'order-1'}`}
              >
                Annuler
              </Button>
              <Button 
                type="button" 
                variant="destructive" 
                onClick={handleDeleteNews}
                disabled={isLoading}
                className={`${isMobile ? 'order-1 w-full' : 'order-2'}`}
              >
                {isLoading ? "Suppression..." : "Supprimer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default AdminNews;
