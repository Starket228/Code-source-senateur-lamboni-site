import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSite } from '@/context/SiteContext';
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
  CardTitle, 
  CardDescription,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { 
  ArrowLeft, 
  CalendarClock, 
  Plus, 
  Edit, 
  Trash2,
} from 'lucide-react';
import { ActivityType } from '@/lib/types';
import Layout from '@/components/Layout';
import { CrudService } from '@/utils/crudUtils';
import UpcomingEventsManager from '@/components/admin/UpcomingEventsManager';
import { useIsMobile } from '@/hooks/use-mobile';
import EventPhotosManager from '@/components/admin/EventPhotosManager';

const AdminActivities = () => {
  const { activities, setActivities, refreshData } = useSite();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<ActivityType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<{
    id?: string;
    title: string;
    description: string;
    day: string;
    month: string;
  }>({
    title: '',
    description: '',
    day: '',
    month: '',
  });

  const handleOpenDialog = (activity?: ActivityType) => {
    if (activity) {
      setCurrentActivity(activity);
      setFormData({
        id: activity.id,
        title: activity.title,
        description: activity.description,
        day: activity.date.day,
        month: activity.date.month,
      });
    } else {
      setCurrentActivity(null);
      setFormData({
        title: '',
        description: '',
        day: '',
        month: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleOpenDeleteDialog = (activity: ActivityType) => {
    setCurrentActivity(activity);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const activityData = {
        id: formData.id || crypto.randomUUID(),
        title: formData.title,
        description: formData.description,
        day: formData.day,
        month: formData.month,
      };

      let result;
      if (currentActivity) {
        result = await CrudService.update('activities', activityData.id, activityData);
      } else {
        result = await CrudService.create('activities', activityData);
      }

      if (result.success) {
        const updatedActivity: ActivityType = {
          id: result.data.id,
          title: result.data.title,
          description: result.data.description,
          date: {
            day: result.data.day,
            month: result.data.month
          }
        };

        if (currentActivity) {
          setActivities(activities.map(item => 
            item.id === updatedActivity.id ? updatedActivity : item
          ));
        } else {
          setActivities([updatedActivity, ...activities]);
        }

        await refreshData();
        
        setIsDialogOpen(false);
        toast({
          title: currentActivity ? "Activité mise à jour" : "Activité ajoutée",
          description: currentActivity ? "L'activité a été mise à jour avec succès." : "Une nouvelle activité a été ajoutée.",
        });
      } else {
        throw new Error(result.error?.message || 'Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Error saving activity:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de l'enregistrement de l'activité.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteActivity = async () => {
    if (!currentActivity) return;
    
    setIsLoading(true);
    try {
      const result = await CrudService.delete('activities', currentActivity.id);
      
      if (result.success) {
        setActivities(activities.filter(item => item.id !== currentActivity.id));
        await refreshData();
        
        setIsDeleteDialogOpen(false);
        toast({
          title: "Activité supprimée",
          description: "L'activité a été supprimée avec succès.",
        });
      } else {
        throw new Error(result.error?.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Error deleting activity:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la suppression de l'activité.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout hideLoader>
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="mb-4 sm:mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/admin')}
            className="mb-3 sm:mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour
          </Button>
        </div>

        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Gestion des Activités</h1>
          <p className="text-sm sm:text-base text-gray-600">Gérez les activités passées, les événements à venir et les photos</p>
        </div>

        <Tabs defaultValue="activities" className="space-y-4 sm:space-y-6">
          <TabsList className={`grid w-full ${isMobile ? 'grid-cols-1 h-auto gap-1' : 'grid-cols-3'}`}>
            <TabsTrigger value="activities" className={isMobile ? 'justify-start' : ''}>
              {isMobile ? 'Activités' : 'Activités passées'}
            </TabsTrigger>
            <TabsTrigger value="events" className={isMobile ? 'justify-start' : ''}>
              {isMobile ? 'Événements' : 'Événements à venir'}
            </TabsTrigger>
            <TabsTrigger value="photos" className={isMobile ? 'justify-start' : ''}>
              {isMobile ? 'Photos' : 'Photos d\'événements'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="activities">
            <Card>
              <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">Activités passées</CardTitle>
                    <CardDescription className="text-sm">Ajoutez, modifiez ou supprimez des activités passées</CardDescription>
                  </div>
                  <Button onClick={() => handleOpenDialog()} size={isMobile ? "sm" : "default"} className="w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" /> Ajouter
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="overflow-x-auto px-4 sm:px-6">
                {isMobile ? (
                  <div className="space-y-3">
                    {activities.map(activity => (
                      <div key={activity.id} className="border rounded-lg p-3 bg-white">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-sm truncate flex-1 mr-2">{activity.title}</h3>
                          <div className="flex gap-1 flex-shrink-0">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleOpenDialog(activity)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleOpenDeleteDialog(activity)}
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center mb-2">
                          <CalendarClock className="mr-1 h-3 w-3 text-primary" />
                          <span className="text-xs text-gray-600">{activity.date.day} {activity.date.month}</span>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2">{activity.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Table>
                    <TableCaption>Liste des activités passées</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Titre</TableHead>
                        <TableHead className="hidden md:table-cell">Date</TableHead>
                        <TableHead className="hidden lg:table-cell">Description</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activities.map(activity => (
                        <TableRow key={activity.id}>
                          <TableCell className="font-medium">{activity.title}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center">
                              <CalendarClock className="mr-2 h-4 w-4 text-primary" />
                              {activity.date.day} {activity.date.month}
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell max-w-xs truncate">
                            {activity.description}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleOpenDialog(activity)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleOpenDeleteDialog(activity)}
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events">
            <UpcomingEventsManager />
          </TabsContent>

          <TabsContent value="photos">
            <EventPhotosManager />
          </TabsContent>
        </Tabs>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className={`${isMobile ? 'max-w-[95vw] max-h-[90vh] h-[90vh]' : 'max-w-2xl'} overflow-y-auto`}>
            <DialogHeader className="pb-4">
              <DialogTitle className="text-lg sm:text-xl">{currentActivity ? "Modifier l'activité" : "Ajouter une activité"}</DialogTitle>
              <DialogDescription className="text-sm">
                {currentActivity ? "Modifiez les informations de l'activité" : "Remplissez le formulaire pour ajouter une nouvelle activité"}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSaveActivity} className={`space-y-4 ${isMobile ? 'space-y-4' : 'space-y-6'}`}>
              <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'md:grid-cols-2 gap-6'}`}>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-1">Titre</label>
                    <Input 
                      id="title" 
                      name="title" 
                      value={formData.title} 
                      onChange={handleInputChange}
                      required
                      className="text-sm"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label htmlFor="day" className="block text-sm font-medium mb-1">Jour</label>
                      <Input 
                        id="day" 
                        name="day" 
                        value={formData.day} 
                        onChange={handleInputChange}
                        placeholder="15"
                        required
                        className="text-sm"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="month" className="block text-sm font-medium mb-1">Mois</label>
                      <Input 
                        id="month" 
                        name="month" 
                        value={formData.month} 
                        onChange={handleInputChange}
                        placeholder="Juin"
                        required
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
                    <Textarea 
                      id="description" 
                      name="description" 
                      value={formData.description} 
                      onChange={handleInputChange}
                      required
                      rows={isMobile ? 4 : 8}
                      className="text-sm resize-none"
                    />
                  </div>
                </div>
              </div>
              
              <DialogFooter className={`${isMobile ? 'flex-col gap-2' : 'flex-row gap-2'} pt-4`}>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className={isMobile ? 'order-2' : ''}
                >
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className={isMobile ? 'order-1' : ''}
                >
                  {isLoading ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className={isMobile ? 'max-w-[95vw]' : ''}>
            <DialogHeader className="pb-4">
              <DialogTitle className="text-lg">Confirmer la suppression</DialogTitle>
              <DialogDescription className="text-sm">
                Êtes-vous sûr de vouloir supprimer cette activité ? Cette action est irréversible.
              </DialogDescription>
            </DialogHeader>
            
            <DialogFooter className={`${isMobile ? 'flex-col gap-2' : 'flex-row gap-2'} pt-4`}>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDeleteDialogOpen(false)}
                className={isMobile ? 'order-2' : ''}
              >
                Annuler
              </Button>
              <Button 
                type="button" 
                variant="destructive" 
                onClick={handleDeleteActivity}
                disabled={isLoading}
                className={isMobile ? 'order-1' : ''}
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

export default AdminActivities;
