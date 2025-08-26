
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle
} from '@/components/ui/card';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from '@/components/ui/use-toast';
import { 
  Plus, 
  Edit, 
  Trash2,
  Tag,
  Loader2
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface Category {
  id: string;
  name: string;
  description?: string;
  count?: number;
}

interface CategoryManagerProps {
  categories: Category[];
  onCreateCategory: (data: { name: string; description?: string }) => Promise<void>;
  onUpdateCategory: (id: string, data: { name: string; description?: string }) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
  isLoading?: boolean;
  title: string;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
  isLoading = false,
  title
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useIsMobile();
  
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setCurrentCategory(category);
      setFormData({
        name: category.name,
        description: category.description || ''
      });
    } else {
      setCurrentCategory(null);
      setFormData({
        name: '',
        description: ''
      });
    }
    setIsDialogOpen(true);
  };

  const handleOpenDeleteDialog = (category: Category) => {
    setCurrentCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    try {
      if (currentCategory) {
        await onUpdateCategory(currentCategory.id, formData);
        toast({
          title: "Catégorie mise à jour",
          description: "La catégorie a été mise à jour avec succès.",
        });
      } else {
        await onCreateCategory(formData);
        toast({
          title: "Catégorie ajoutée",
          description: "Une nouvelle catégorie a été ajoutée.",
        });
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!currentCategory) return;
    
    try {
      await onDeleteCategory(currentCategory.id);
      toast({
        title: "Catégorie supprimée",
        description: "La catégorie a été supprimée avec succès.",
      });
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="mt-6">
        <CardContent className="p-6 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Chargement des catégories...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            {title}
          </CardTitle>
          <Button onClick={() => handleOpenDialog()} size={isMobile ? "sm" : "default"}>
            <Plus className="mr-2 h-4 w-4" /> Ajouter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {categories.length > 0 ? (
          isMobile ? (
            <div className="space-y-3">
              {categories.map(category => (
                <div key={category.id} className="border rounded-lg p-3 bg-white hover:bg-gray-50/50">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-sm">{category.name}</h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {category.count || 0}
                    </span>
                  </div>
                  {category.description && (
                    <p className="text-xs text-gray-600 mb-3">{category.description}</p>
                  )}
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleOpenDialog(category)}
                      className="flex-1"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Modifier
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleOpenDeleteDialog(category)}
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
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-center">Éléments</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map(category => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-gray-600">
                      {category.description || '-'}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {category.count || 0}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleOpenDialog(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleOpenDeleteDialog(category)}
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
          )
        ) : (
          <div className="text-center py-8">
            <Tag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Aucune catégorie</h3>
            <p className="text-gray-500 mb-4">
              Vous n'avez pas encore créé de catégories.
            </p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une catégorie
            </Button>
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className={`${isMobile ? 'max-w-[95vw]' : 'max-w-md'}`}>
            <DialogHeader className="pb-4">
              <DialogTitle>
                {currentCategory ? "Modifier la catégorie" : "Ajouter une catégorie"}
              </DialogTitle>
              <DialogDescription>
                {currentCategory ? "Modifiez les informations de la catégorie" : "Créez une nouvelle catégorie"}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Nom <span className="text-red-500">*</span>
                </label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange}
                  required
                  placeholder="Nom de la catégorie"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2">
                  Description (optionnel)
                </label>
                <Input 
                  id="description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange}
                  placeholder="Description de la catégorie"
                />
              </div>
              
              <DialogFooter className={`pt-4 ${isMobile ? 'flex-col gap-2' : ''}`}>
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
                  disabled={isSubmitting}
                  className={`${isMobile ? 'order-1 w-full' : 'order-2'}`}
                >
                  {isSubmitting ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className={`${isMobile ? 'max-w-[95vw]' : 'max-w-md'}`}>
            <DialogHeader>
              <DialogTitle className="text-red-600">Confirmer la suppression</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible.
              </DialogDescription>
            </DialogHeader>
            
            <DialogFooter className={`${isMobile ? 'flex-col gap-2' : ''}`}>
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
                onClick={handleDeleteCategory}
                className={`${isMobile ? 'order-1 w-full' : 'order-2'}`}
              >
                Supprimer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default CategoryManager;
