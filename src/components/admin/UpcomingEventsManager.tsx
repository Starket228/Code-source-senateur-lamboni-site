
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
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ImageUpload } from '@/components/ui/image-upload';
import { toast } from '@/components/ui/use-toast';
import { 
  Plus, 
  Edit, 
  Trash2,
  Calendar,
  MapPin,
  Clock,
  Loader2
} from 'lucide-react';
import { UpcomingEventType } from '@/lib/eventTypes';
import { EventService } from '@/utils/eventUtils';

const UpcomingEventsManager: React.FC = () => {
  const [events, setEvents] = useState<UpcomingEventType[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<UpcomingEventType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  const [formData, setFormData] = useState<{
    id?: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    image: string;
    category: string;
  }>({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    image: '',
    category: '',
  });

  // Charger les événements au montage du composant
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setIsLoadingData(true);
    try {
      const result = await EventService.getUpcomingEvents();
      if (result.success && result.data) {
        setEvents(result.data);
      }
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleOpenDialog = (event?: UpcomingEventType) => {
    if (event) {
      setCurrentEvent(event);
      setFormData({
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        location: event.location,
        image: event.image || '',
        category: event.category,
      });
    } else {
      setCurrentEvent(null);
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        image: '',
        category: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleOpenDeleteDialog = (event: UpcomingEventType) => {
    setCurrentEvent(event);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (value: string) => {
    setFormData(prev => ({ ...prev, image: value }));
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const eventData = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        image: formData.image,
        category: formData.category,
      };

      let result;
      if (currentEvent) {
        result = await EventService.updateUpcomingEvent(currentEvent.id, eventData);
      } else {
        result = await EventService.createUpcomingEvent(eventData);
      }

      if (result.success) {
        await loadEvents();
        setIsDialogOpen(false);
        toast({
          title: currentEvent ? "Événement mis à jour" : "Événement ajouté",
          description: currentEvent ? "L'événement a été mis à jour avec succès." : "Un nouvel événement a été ajouté.",
        });
      }
    } catch (error) {
      console.error('Error saving event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!currentEvent) return;
    
    try {
      const result = await EventService.deleteUpcomingEvent(currentEvent.id);
      
      if (result.success) {
        await loadEvents();
        setIsDeleteDialogOpen(false);
        toast({
          title: "Événement supprimé",
          description: "L'événement a été supprimé avec succès.",
        });
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  if (isLoadingData) {
    return (
      <Card className="mt-6">
        <CardContent className="p-6 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Chargement des événements...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Événements à venir
          </CardTitle>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" /> Ajouter un événement
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {events.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Lieu</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map(event => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-500" />
                      {new Date(event.date).toLocaleDateString('fr-FR')} - {event.time}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      {event.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      {event.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleOpenDialog(event)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleOpenDeleteDialog(event)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun événement</h3>
            <p className="text-gray-500 mb-4">
              Vous n'avez pas encore ajouté d'événements à venir.
            </p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un événement
            </Button>
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="pb-4">
              <DialogTitle>{currentEvent ? "Modifier l'événement" : "Ajouter un événement"}</DialogTitle>
              <DialogDescription>
                {currentEvent ? "Modifiez les informations de l'événement" : "Remplissez le formulaire pour ajouter un nouvel événement"}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSaveEvent} className="space-y-6">
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
                  <label htmlFor="category" className="block text-sm font-medium mb-2">Catégorie</label>
                  <Input 
                    id="category" 
                    name="category" 
                    value={formData.category} 
                    onChange={handleInputChange}
                    placeholder="Conférence, Réunion, etc."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <label htmlFor="time" className="block text-sm font-medium mb-2">Heure</label>
                    <Input 
                      id="time" 
                      name="time" 
                      type="time"
                      value={formData.time} 
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium mb-2">Lieu</label>
                  <Input 
                    id="location" 
                    name="location" 
                    value={formData.location} 
                    onChange={handleInputChange}
                    placeholder="Adresse ou nom du lieu"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-2">Description</label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    value={formData.description} 
                    onChange={handleInputChange}
                    required
                    rows={4}
                  />
                </div>

                <div>
                  <ImageUpload
                    value={formData.image}
                    onChange={handleImageChange}
                    label="Image de l'événement (optionnel)"
                    placeholder="https://exemple.com/image.jpg"
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
                Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est irréversible.
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
                onClick={handleDeleteEvent}
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

export default UpcomingEventsManager;
