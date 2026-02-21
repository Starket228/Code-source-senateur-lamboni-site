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
import { DocumentUpload } from '@/components/ui/document-upload';
import { Edit, Trash2, Plus, ArrowLeft, FileText, Download } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { CrudService } from '@/utils/crudUtils';
import { useIsMobile } from '@/hooks/use-mobile';
import CategoryManager from '@/components/admin/CategoryManager';
import { CategoryService } from '@/utils/categoryUtils';

// Extended DocumentType to include category
interface ExtendedDocumentType {
  id: string;
  title: string;
  description: string;
  link: string;
  category?: string;
}

const AdminDocuments = () => {
  const { documents, setDocuments, refreshData } = useSite();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<ExtendedDocumentType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [formData, setFormData] = useState<{
    id?: string;
    title: string;
    description: string;
    link: string;
    category: string;
  }>({
    title: '',
    description: '',
    link: '',
    category: '',
  });

  // Convert documents to extended type
  const extendedDocuments: ExtendedDocumentType[] = documents.map(doc => ({
    id: doc.id,
    title: doc.title,
    description: doc.description,
    link: doc.link,
    category: (doc as any).category || ''
  }));

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setIsCategoriesLoading(true);
    try {
      const result = await CategoryService.getCategories('documents');
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
      type: 'documents'
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

  const handleOpenDialog = (document?: ExtendedDocumentType) => {
    if (document) {
      setCurrentDocument(document);
      setFormData({
        id: document.id,
        title: document.title,
        description: document.description,
        link: document.link,
        category: document.category || '',
      });
    } else {
      setCurrentDocument(null);
      setFormData({
        title: '',
        description: '',
        link: '',
        category: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleOpenDeleteDialog = (document: ExtendedDocumentType) => {
    setCurrentDocument(document);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDocumentChange = (value: string) => {
    setFormData(prev => ({ ...prev, link: value }));
  };

  const handleSaveDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const documentData = {
        id: formData.id || crypto.randomUUID(),
        title: formData.title,
        description: formData.description,
        link: formData.link,
        category: formData.category,
      };

      let result;
      if (currentDocument) {
        result = await CrudService.update('documents', documentData.id, documentData);
      } else {
        result = await CrudService.create('documents', documentData);
      }

      if (result.success) {
        const updatedDocument = {
          id: result.data.id,
          title: result.data.title,
          description: result.data.description,
          link: result.data.link,
        };

        if (currentDocument) {
          setDocuments(documents.map(item => 
            item.id === updatedDocument.id ? updatedDocument : item
          ));
        } else {
          setDocuments([updatedDocument, ...documents]);
        }

        await refreshData();
        await loadCategories();
        
        setIsDialogOpen(false);
        toast({
          title: currentDocument ? "Document mis à jour" : "Document ajouté",
          description: currentDocument ? "Le document a été mis à jour avec succès." : "Un nouveau document a été ajouté.",
        });
      } else {
        throw new Error(result.error?.message || 'Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Error saving document:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de l'enregistrement du document.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDocument = async () => {
    if (!currentDocument) return;
    
    setIsLoading(true);
    try {
      const result = await CrudService.delete('documents', currentDocument.id);
      
      if (result.success) {
        setDocuments(documents.filter(item => item.id !== currentDocument.id));
        await refreshData();
        await loadCategories();
        
        setIsDeleteDialogOpen(false);
        toast({
          title: "Document supprimé",
          description: "Le document a été supprimé avec succès.",
        });
      } else {
        throw new Error(result.error?.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la suppression du document.",
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
                <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">Gestion des Documents</CardTitle>
                <CardDescription className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
                  Ajoutez, modifiez ou supprimez des documents du site
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
                  {extendedDocuments.map(document => (
                    <div key={document.id} className="border rounded-lg p-3 bg-white hover:bg-gray-50/50">
                      <div className="flex gap-3 mb-3">
                        <div className="w-16 h-12 bg-gray-100 rounded-md border flex items-center justify-center flex-shrink-0">
                          <FileText className="w-6 h-6 text-gray-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate">{document.title}</h3>
                          {document.category && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                              {document.category}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild className="flex-1">
                          <a href={document.link} target="_blank" rel="noopener noreferrer">
                            <Download className="h-3 w-3 mr-1" />
                            Télécharger
                          </a>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleOpenDialog(document)}
                          className="flex-1"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Modifier
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleOpenDeleteDialog(document)}
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
                  <TableCaption className="py-4">Liste des documents du site</TableCaption>
                  <TableHeader>
                    <TableRow className="border-gray-200">
                      <TableHead className="font-semibold">Titre</TableHead>
                      <TableHead className="hidden md:table-cell font-semibold">Description</TableHead>
                      <TableHead className="hidden lg:table-cell font-semibold">Catégorie</TableHead>
                      <TableHead className="text-right font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {extendedDocuments.map(document => (
                      <TableRow key={document.id} className="hover:bg-gray-50/50">
                        <TableCell className="font-medium py-4">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-500" />
                            {document.title}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell py-4 max-w-xs">
                          <p className="text-gray-600 truncate">{document.description}</p>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell py-4">
                          {document.category && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {document.category}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right py-4">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <a href={document.link} target="_blank" rel="noopener noreferrer">
                                <Download className="h-4 w-4" />
                              </a>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleOpenDialog(document)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleOpenDeleteDialog(document)}
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
          title="Catégories des documents"
        />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className={`${isMobile ? 'max-w-[95vw] max-h-[90vh] h-[90vh]' : 'max-w-2xl max-h-[90vh]'} overflow-y-auto`}>
            <DialogHeader className="pb-4 sm:pb-6">
              <DialogTitle className="text-lg sm:text-xl font-semibold">
                {currentDocument ? "Modifier le document" : "Ajouter un document"}
              </DialogTitle>
              <DialogDescription className="text-sm sm:text-base text-gray-600">
                {currentDocument ? "Modifiez les informations du document" : "Remplissez le formulaire pour ajouter un nouveau document"}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSaveDocument} className={`space-y-6 ${isMobile ? 'space-y-4' : 'space-y-6'}`}>
              <div className="space-y-4">
                <div className="space-y-2 sm:space-y-3">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Titre du document <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    id="title" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleInputChange}
                    required
                    className="w-full text-sm"
                    placeholder="Entrez le titre du document"
                  />
                </div>
                
                <div className="space-y-2 sm:space-y-3">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Catégorie
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">-- Sélectionner une catégorie --</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.name}>{category.name}</option>
                    ))}
                  </select>
                </div>

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
                    rows={isMobile ? 4 : 5}
                    className="w-full resize-none text-sm"
                    placeholder="Décrivez le contenu du document"
                  />
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Fichier du document <span className="text-red-500">*</span>
                  </label>
                  <DocumentUpload
                    value={formData.link}
                    onChange={handleDocumentChange}
                    required
                  />
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
                Êtes-vous sûr de vouloir supprimer ce document ? Cette action est irréversible.
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
                onClick={handleDeleteDocument}
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

export default AdminDocuments;
