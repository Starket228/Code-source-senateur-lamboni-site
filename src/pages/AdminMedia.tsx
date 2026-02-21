
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSite } from '@/context/SiteContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ImageUpload } from '@/components/ui/image-upload';
import { MediaFilters } from '@/components/admin/MediaFilters';
import { MediaCard } from '@/components/admin/MediaCard';
import { MediaPreview } from '@/components/admin/MediaPreview';
import { toast } from '@/components/ui/use-toast';
import { 
  Loader2, 
  ArrowLeft, 
  Plus, 
  Trash2,
  Save,
  Download,
  Upload
} from 'lucide-react';
import { MediaType } from '@/lib/types';
import { CrudService } from '@/utils/crudUtils';
import { CategoryService } from '@/utils/categoryUtils';

const AdminMedia = () => {
  const navigate = useNavigate();
  const { mediaItems, isLoading, refreshData } = useSite();
  const [mediaCategories, setMediaCategories] = useState<any[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      const result = await CategoryService.getCategories('media');
      if (result.success && result.data) {
        setMediaCategories(result.data);
      }
    };
    loadCategories();
  }, []);
  
  // État pour la gestion des médias
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaType | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  // État pour les filtres et la recherche
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // État pour le formulaire
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    category: 'photo',
    date: '',
    thumbnail: '',
    media_type: 'photo' as 'photo' | 'video' | 'audio',
    src: '',
    duration: ''
  });

  // Filtrage et tri des médias
  const filteredAndSortedMedia = useMemo(() => {
    let filtered = mediaItems.filter(media => {
      const matchesSearch = media.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || media.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [mediaItems, searchTerm, categoryFilter, sortBy]);

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      id: '',
      title: '',
      category: 'photo',
      date: new Date().toISOString().split('T')[0],
      thumbnail: '',
      media_type: 'photo',
      src: '',
      duration: ''
    });
    setIsEditing(false);
    setSelectedMedia(null);
  };

  // Gestion des changements du formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      thumbnail: value,
      src: value // Pour les images, src et thumbnail sont identiques
    }));
  };

  // Gestion de la sélection
  const handleSelectItem = (id: string, selected: boolean) => {
    setSelectedItems(prev => {
      if (selected) {
        return [...prev, id];
      } else {
        return prev.filter(item => item !== id);
      }
    });
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedItems(filteredAndSortedMedia.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  // Actions CRUD
  const handleAdd = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleEdit = (mediaItem: MediaType) => {
    setFormData({
      id: mediaItem.id,
      title: mediaItem.title,
      category: mediaItem.category,
      date: mediaItem.date.split('T')[0],
      thumbnail: mediaItem.thumbnail,
      media_type: mediaItem.media_type || 'photo',
      src: mediaItem.src || mediaItem.thumbnail,
      duration: mediaItem.duration || ''
    });
    setSelectedMedia(mediaItem);
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handlePreview = (mediaItem: MediaType) => {
    setSelectedMedia(mediaItem);
    setPreviewOpen(true);
  };

  const handleDelete = (id: string) => {
    setSelectedMedia(mediaItems.find(item => item.id === id) || null);
    setDeleteDialogOpen(true);
  };

  const handleBulkDelete = () => {
    if (selectedItems.length === 0) {
      toast({
        title: 'Aucune sélection',
        description: 'Veuillez sélectionner au moins un média à supprimer.',
        variant: 'destructive',
      });
      return;
    }
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    setIsProcessing(true);
    try {
      if (selectedItems.length > 0) {
        // Suppression en lot
        for (const id of selectedItems) {
          await CrudService.delete('media', id);
        }
        setSelectedItems([]);
        toast({
          title: 'Médias supprimés',
          description: `${selectedItems.length} médias ont été supprimés avec succès.`,
        });
      } else if (selectedMedia) {
        // Suppression simple
        await CrudService.delete('media', selectedMedia.id);
        toast({
          title: 'Média supprimé',
          description: 'Le média a été supprimé avec succès.',
        });
      }
      
      await refreshData();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting media:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la suppression.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.thumbnail.trim()) {
      toast({
        title: 'Champs manquants',
        description: 'Veuillez remplir le titre et sélectionner un média.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    try {
      const mediaData = {
        id: formData.id || undefined,
        title: formData.title,
        category: formData.category,
        date: formData.date,
        thumbnail: formData.thumbnail,
        media_type: formData.media_type,
        src: formData.src || formData.thumbnail,
        duration: formData.duration || null
      };
      
      if (isEditing) {
        await CrudService.update('media', formData.id, mediaData);
        toast({
          title: 'Média mis à jour',
          description: 'Le média a été mis à jour avec succès.',
        });
      } else {
        await CrudService.create('media', mediaData);
        toast({
          title: 'Média ajouté',
          description: 'Le nouveau média a été ajouté avec succès.',
        });
      }
      
      await refreshData();
      resetForm();
      setDialogOpen(false);
    } catch (error) {
      console.error('Error saving media:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la sauvegarde.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkDownload = () => {
    if (selectedItems.length === 0) {
      toast({
        title: 'Aucune sélection',
        description: 'Veuillez sélectionner au moins un média à télécharger.',
        variant: 'destructive',
      });
      return;
    }

    selectedItems.forEach(id => {
      const media = mediaItems.find(item => item.id === id);
      if (media && (media.src || media.thumbnail)) {
        const link = document.createElement('a');
        link.href = media.src || media.thumbnail;
        link.download = `${media.title}.${(media.src || media.thumbnail).split('.').pop()}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });

    toast({
      title: 'Téléchargement lancé',
      description: `${selectedItems.length} médias en cours de téléchargement.`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin')}
            className="mr-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold">Médiathèque</h1>
        </div>
        
        <div className="flex gap-2">
          {selectedItems.length > 0 && (
            <>
              <Button variant="outline" onClick={handleBulkDownload}>
                <Download className="mr-2 h-4 w-4" />
                Télécharger ({selectedItems.length})
              </Button>
              <Button variant="destructive" onClick={handleBulkDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer ({selectedItems.length})
              </Button>
            </>
          )}
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un média
          </Button>
        </div>
      </div>

      <MediaFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {filteredAndSortedMedia.length > 0 && (
        <div className="flex items-center gap-4 mb-4">
          <Checkbox
            checked={selectedItems.length === filteredAndSortedMedia.length}
            onCheckedChange={handleSelectAll}
          />
          <span className="text-sm text-gray-600">
            {selectedItems.length > 0 
              ? `${selectedItems.length} élément(s) sélectionné(s)`
              : `${filteredAndSortedMedia.length} élément(s) au total`
            }
          </span>
        </div>
      )}

      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6" 
        : "space-y-3"
      }>
        {filteredAndSortedMedia.length > 0 ? (
          filteredAndSortedMedia.map(mediaItem => (
            <MediaCard
              key={mediaItem.id}
              media={mediaItem}
              isSelected={selectedItems.includes(mediaItem.id)}
              onSelect={handleSelectItem}
              onPreview={handlePreview}
              onEdit={handleEdit}
              onDelete={handleDelete}
              viewMode={viewMode}
            />
          ))
        ) : (
          <div className="col-span-full py-10 text-center">
            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-1">
              {searchTerm || categoryFilter !== 'all' ? 'Aucun résultat' : 'Aucun média'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || categoryFilter !== 'all' 
                ? 'Essayez de modifier vos critères de recherche.' 
                : 'Vous n\'avez pas encore ajouté de médias.'
              }
            </p>
            {!searchTerm && categoryFilter === 'all' && (
              <Button onClick={handleAdd}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un média
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Dialog pour ajouter/modifier */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Modifier le média' : 'Ajouter un média'}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Modifiez les détails du média' 
                : 'Complétez les informations pour ajouter un nouveau média'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Titre *
              </label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Titre du média"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Catégorie
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="Photo">Photo</option>
                <option value="Vidéo">Vidéo</option>
                <option value="Audio">Audio</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="media_type" className="text-sm font-medium">
                Type de média
              </label>
              <select
                id="media_type"
                name="media_type"
                value={formData.media_type}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="photo">Photo</option>
                <option value="video">Vidéo</option>
                <option value="audio">Audio</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="date" className="text-sm font-medium">
                Date
              </label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
              />
            </div>
            
            <ImageUpload
              value={formData.thumbnail}
              onChange={handleImageChange}
              label="Fichier média *"
              placeholder="Sélectionnez ou téléchargez un fichier"
              required
              bucket="media"
              previewClassName="aspect-video"
            />

            {(formData.media_type === 'video' || formData.media_type === 'audio') && (
              <div className="space-y-2">
                <label htmlFor="duration" className="text-sm font-medium">
                  Durée (optionnel)
                </label>
                <Input
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="ex: 2:30"
                />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={isProcessing || !formData.thumbnail || !formData.title}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? 'Mise à jour...' : 'Création...'}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isEditing ? 'Mettre à jour' : 'Créer'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedItems.length > 0 
                ? `Êtes-vous sûr de vouloir supprimer ${selectedItems.length} média(s) ? Cette action est irréversible.`
                : `Êtes-vous sûr de vouloir supprimer "${selectedMedia?.title}" ? Cette action est irréversible.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suppression...
                </>
              ) : (
                'Supprimer'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Prévisualisation */}
      <MediaPreview
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        media={selectedMedia}
      />
    </div>
  );
};

export default AdminMedia;
