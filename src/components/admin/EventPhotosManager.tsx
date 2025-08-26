
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { ImageUpload } from '@/components/ui/image-upload';
import { toast } from '@/components/ui/use-toast';
import { 
  Plus, 
  Edit, 
  Trash2,
  Image as ImageIcon,
  Camera,
  Loader2
} from 'lucide-react';
import { EventPhotoType } from '@/lib/eventTypes';
import { EventService } from '@/utils/eventUtils';

const EventPhotosManager: React.FC = () => {
  const [photos, setPhotos] = useState<EventPhotoType[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState<EventPhotoType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  const [formData, setFormData] = useState<{
    id?: string;
    title: string;
    description: string;
    image_url: string;
    date: string;
    photographer: string;
  }>({
    title: '',
    description: '',
    image_url: '',
    date: '',
    photographer: '',
  });

  // Charger les photos au montage du composant
  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    setIsLoadingData(true);
    try {
      const result = await EventService.getEventPhotos();
      if (result.success && result.data) {
        setPhotos(result.data);
      }
    } catch (error) {
      console.error('Error loading photos:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleOpenDialog = (photo?: EventPhotoType) => {
    if (photo) {
      setCurrentPhoto(photo);
      setFormData({
        id: photo.id,
        title: photo.title,
        description: photo.description || '',
        image_url: photo.image_url,
        date: photo.date,
        photographer: photo.photographer || '',
      });
    } else {
      setCurrentPhoto(null);
      setFormData({
        title: '',
        description: '',
        image_url: '',
        date: new Date().toISOString().split('T')[0],
        photographer: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleOpenDeleteDialog = (photo: EventPhotoType) => {
    setCurrentPhoto(photo);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (value: string) => {
    setFormData(prev => ({ ...prev, image_url: value }));
  };

  const handleSavePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const photoData = {
        title: formData.title,
        description: formData.description,
        image_url: formData.image_url,
        date: formData.date,
        photographer: formData.photographer,
      };

      let result;
      if (currentPhoto) {
        result = await EventService.updateEventPhoto(currentPhoto.id, photoData);
      } else {
        result = await EventService.createEventPhoto(photoData);
      }

      if (result.success) {
        await loadPhotos();
        setIsDialogOpen(false);
        toast({
          title: currentPhoto ? "Photo mise à jour" : "Photo ajoutée",
          description: currentPhoto ? "La photo a été mise à jour avec succès." : "Une nouvelle photo a été ajoutée.",
        });
      }
    } catch (error) {
      console.error('Error saving photo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePhoto = async () => {
    if (!currentPhoto) return;
    
    try {
      const result = await EventService.deleteEventPhoto(currentPhoto.id);
      
      if (result.success) {
        await loadPhotos();
        setIsDeleteDialogOpen(false);
        toast({
          title: "Photo supprimée",
          description: "La photo a été supprimée avec succès.",
        });
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };

  if (isLoadingData) {
    return (
      <Card className="mt-6">
        <CardContent className="p-6 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Chargement des photos...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Photos d'événements
          </CardTitle>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" /> Ajouter une photo
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {photos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {photos.map(photo => (
              <Card key={photo.id} className="overflow-hidden">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={photo.image_url} 
                    alt={photo.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm mb-1">{photo.title}</h3>
                  {photo.description && (
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{photo.description}</p>
                  )}
                  <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                    <span>{new Date(photo.date).toLocaleDateString('fr-FR')}</span>
                    {photo.photographer && <span>Par {photo.photographer}</span>}
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleOpenDialog(photo)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleOpenDeleteDialog(photo)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Aucune photo</h3>
            <p className="text-gray-500 mb-4">
              Vous n'avez pas encore ajouté de photos d'événements.
            </p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une photo
            </Button>
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="pb-4">
              <DialogTitle>{currentPhoto ? "Modifier la photo" : "Ajouter une photo"}</DialogTitle>
              <DialogDescription>
                {currentPhoto ? "Modifiez les informations de la photo" : "Remplissez le formulaire pour ajouter une nouvelle photo"}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSavePhoto} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-2">Titre</label>
                  <Input 
                    id="title" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="date" className="block text-sm font-medium mb-2">Date</label>
                  <Input 
                    id="date" 
                    name="date" 
                    type="date"
                    value={formData.date} 
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="photographer" className="block text-sm font-medium mb-2">Photographe (optionnel)</label>
                  <Input 
                    id="photographer" 
                    name="photographer" 
                    value={formData.photographer} 
                    onChange={handleInputChange}
                    placeholder="Nom du photographe"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-2">Description (optionnel)</label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    value={formData.description} 
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Description de la photo ou de l'événement"
                  />
                </div>

                <div>
                  <ImageUpload
                    value={formData.image_url}
                    onChange={handleImageChange}
                    label="Photo"
                    placeholder="https://exemple.com/photo.jpg"
                    required
                    previewClassName="aspect-video"
                  />
                </div>
              </div>
              
              <DialogFooter className="flex-col sm:flex-row gap-3 pt-6 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="order-2 sm:order-1"
                >
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="order-1 sm:order-2"
                >
                  {isLoading ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmer la suppression</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer cette photo ? Cette action est irréversible.
              </DialogDescription>
            </DialogHeader>
            
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button 
                type="button" 
                variant="destructive" 
                onClick={handleDeletePhoto}
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

export default EventPhotosManager;
