import React, { useState, useEffect } from 'react';
import { useSite } from '@/context/SiteContext';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
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
import { ImageUpload } from '@/components/ui/image-upload';
import { Eye, Edit, Trash2, Plus, ArrowLeft } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { CardType } from '@/lib/types';
import Layout from '@/components/Layout';
import { CrudService } from '@/utils/crudUtils';
import { useIsMobile } from '@/hooks/use-mobile';
import CategoryManager from '@/components/admin/CategoryManager';
import { CategoryService } from '@/utils/categoryUtils';

const AdminPrograms = () => {
  const { programs, setPrograms } = useSite();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProgram, setCurrentProgram] = useState<CardType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [formData, setFormData] = useState<{
    id?: string;
    title: string;
    description: string;
    image: string;
    tag: string;
    link: string;
  }>({
    title: '',
    description: '',
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
      const result = await CategoryService.getCategories('programs');
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
      type: 'programs'
    });
    if (result.success) {
      await loadCategories();
    }
  };

  const handleUpdateCategory = async (id: string, data: { name: string; description?: string }) => {
    const result = await CategoryService.updateCategory(id, data);
    if (result.success) {
      await loadCategories();
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const result = await CategoryService.deleteCategory(id);
    if (result.success) {
      await loadCategories();
    }
  };

  const handleOpenDialog = (program?: CardType) => {
    console.log('AdminPrograms: Opening dialog for program:', program?.id || 'new');
    
    if (program) {
      setCurrentProgram(program);
      setFormData({
        id: program.id,
        title: program.title,
        description: program.description,
        image: program.image,
        tag: program.tag,
        link: program.link || '#',
      });
      console.log('AdminPrograms: Form data set for existing program:', program.image);
    } else {
      setCurrentProgram(null);
      setFormData({
        title: '',
        description: '',
        image: '',
        tag: '',
        link: '#',
      });
      console.log('AdminPrograms: Form data reset for new program');
    }
    setIsDialogOpen(true);
  };

  const handleOpenDeleteDialog = (program: CardType) => {
    setCurrentProgram(program);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (value: string) => {
    console.log('AdminPrograms: Image changed to:', value);
    setFormData(prev => {
      const newFormData = { ...prev, image: value };
      console.log('AdminPrograms: Updated form data with new image:', newFormData.image);
      return newFormData;
    });
  };

  const handleSaveProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log('AdminPrograms: Saving program with image:', formData.image);

    try {
      const programData = {
        id: formData.id || crypto.randomUUID(),
        title: formData.title,
        description: formData.description,
        image: formData.image,
        tag: formData.tag,
        link: formData.link,
      };

      console.log('AdminPrograms: Program data to save:', programData);

      let result;
      if (currentProgram) {
        console.log('AdminPrograms: Updating existing program');
        result = await CrudService.update('programs', programData.id, programData);
      } else {
        console.log('AdminPrograms: Creating new program');
        result = await CrudService.create('programs', programData);
      }

      if (result.success) {
        console.log('AdminPrograms: Save successful, result:', result.data);
        
        const updatedProgram: CardType = {
          id: result.data.id,
          title: result.data.title,
          description: result.data.description,
          content: '',
          image: result.data.image,
          tag: result.data.tag,
          date: result.data.created_at || new Date().toISOString(),
          link: result.data.link || '#',
        };

        console.log('AdminPrograms: Updated program object:', updatedProgram);

        // Mise à jour locale immédiate et optimisée pour éviter les conflits
        if (currentProgram) {
          console.log('AdminPrograms: Updating existing program in state');
          setPrograms(prevPrograms => 
            prevPrograms.map(item => 
              item.id === updatedProgram.id ? updatedProgram : item
            )
          );
        } else {
          console.log('AdminPrograms: Adding new program to state');
          setPrograms(prevPrograms => [updatedProgram, ...prevPrograms]);
        }

        // Réinitialiser le formulaire avant de fermer pour éviter les conflits
        setFormData({
          title: '',
          description: '',
          image: '',
          tag: '',
          link: '#',
        });
        
        setIsDialogOpen(false);
        
        toast({
          title: currentProgram ? "Programme mis à jour" : "Programme ajouté",
          description: currentProgram ? "Le programme a été mis à jour avec succès." : "Un nouveau programme a été ajouté.",
        });

        // Charger uniquement les catégories sans refresh global pour éviter les conflits
        setTimeout(() => {
          loadCategories();
        }, 100);
        
        console.log('AdminPrograms: Save process completed successfully');
      } else {
        throw new Error(result.error?.message || 'Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('AdminPrograms: Error saving program:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de l'enregistrement du programme.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProgram = async () => {
    if (!currentProgram) return;
    
    setIsLoading(true);
    try {
      const result = await CrudService.delete('programs', currentProgram.id);
      
      if (result.success) {
        // Mise à jour locale optimisée
        setPrograms(programs.filter(item => item.id !== currentProgram.id));
        
        setIsDeleteDialogOpen(false);
        toast({
          title: "Programme supprimé",
          description: "Le programme a été supprimé avec succès.",
        });

        // Charger uniquement les catégories sans refresh global
        setTimeout(() => {
          loadCategories();
        }, 100);
      } else {
        throw new Error(result.error?.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Error deleting program:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la suppression du programme.",
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
                <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">Gestion des Programmes</CardTitle>
                <CardDescription className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
                  Ajoutez, modifiez ou supprimez des programmes du site
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
                  {programs.map(program => (
                    <div key={program.id} className="border rounded-lg p-3 bg-white hover:bg-gray-50/50">
                      <div className="flex gap-3 mb-3">
                        <img 
                          src={program.image} 
                          alt={program.title} 
                          className="w-16 h-12 object-cover rounded-md border flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate">{program.title}</h3>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                            {program.tag}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild className="flex-1">
                          <Link to={`/programs/${program.id}`}>
                            <Eye className="h-3 w-3 mr-1" />
                            Voir
                          </Link>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleOpenDialog(program)}
                          className="flex-1"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Modifier
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleOpenDeleteDialog(program)}
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
                  <TableCaption className="py-4">Liste des programmes du site</TableCaption>
                  <TableHeader>
                    <TableRow className="border-gray-200">
                      <TableHead className="w-[100px] font-semibold">Image</TableHead>
                      <TableHead className="font-semibold">Titre</TableHead>
                      <TableHead className="hidden md:table-cell font-semibold">Catégorie</TableHead>
                      <TableHead className="text-right font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {programs.map(program => (
                      <TableRow key={program.id} className="hover:bg-gray-50/50">
                        <TableCell className="py-4">
                          <img 
                            src={program.image} 
                            alt={program.title} 
                            className="w-16 h-12 object-cover rounded-md border"
                          />
                        </TableCell>
                        <TableCell className="font-medium py-4">{program.title}</TableCell>
                        <TableCell className="hidden md:table-cell py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {program.tag}
                          </span>
                        </TableCell>
                        <TableCell className="text-right py-4">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/programs/${program.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleOpenDialog(program)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleOpenDeleteDialog(program)}
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
          title="Catégories des programmes"
        />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className={`${isMobile ? 'max-w-[95vw] max-h-[90vh] h-[90vh]' : 'max-w-4xl max-h-[90vh]'} overflow-y-auto`}>
            <DialogHeader className="pb-4 sm:pb-6">
              <DialogTitle className="text-lg sm:text-xl font-semibold">
                {currentProgram ? "Modifier le programme" : "Ajouter un programme"}
              </DialogTitle>
              <DialogDescription className="text-sm sm:text-base text-gray-600">
                {currentProgram ? "Modifiez les informations du programme" : "Remplissez le formulaire pour ajouter un nouveau programme"}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSaveProgram} className={`space-y-6 ${isMobile ? 'space-y-4' : 'space-y-8'}`}>
              <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'lg:grid-cols-2 gap-8'}`}>
                <div className={`space-y-4 ${isMobile ? 'space-y-4' : 'space-y-6'}`}>
                  <div className="space-y-2 sm:space-y-3">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Titre du programme <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      id="title" 
                      name="title" 
                      value={formData.title} 
                      onChange={handleInputChange}
                      required
                      className="w-full text-sm"
                      placeholder="Entrez le titre du programme"
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
                      placeholder="Ex: Éducation, Formation, etc."
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
                      Image du programme <span className="text-red-500">*</span>
                    </label>
                    <ImageUpload
                      value={formData.image}
                      onChange={handleImageChange}
                      placeholder="https://exemple.com/image.jpg ou uploadez un fichier"
                      required
                      previewClassName="aspect-video rounded-lg border"
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
                      Description <span className="text-red-500">*</span>
                    </label>
                    <Textarea 
                      id="description" 
                      name="description" 
                      value={formData.description} 
                      onChange={handleInputChange}
                      required
                      rows={isMobile ? 8 : 12}
                      className="w-full resize-none text-sm"
                      placeholder="Décrivez le programme en détail..."
                    />
                    <p className="text-xs text-gray-500">
                      Décrivez les objectifs, le contenu et les bénéfices du programme
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
                Êtes-vous sûr de vouloir supprimer ce programme ? Cette action est irréversible.
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
                onClick={handleDeleteProgram}
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

export default AdminPrograms;
