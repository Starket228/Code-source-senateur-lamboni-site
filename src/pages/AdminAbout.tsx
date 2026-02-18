import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Trash2, Edit, Plus, Save, Upload, User, Star, Trophy, Heart, Shield, Lightbulb, Eye } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AboutPage {
  id: string;
  title: string;
  subtitle: string;
  biography_title: string;
  biography_content: string;
  biography_image: string;
  values_title: string;
  values_subtitle: string;
  achievements_title: string;
  achievements_subtitle: string;
  cta_title: string;
  cta_subtitle: string;
  election_date: string;
  election_description: string;
}

interface AboutValue {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface AboutAchievement {
  id: string;
  year: string;
  title: string;
  items: string[];
  color: string;
}

interface AboutVision {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  icon: string;
}

const AdminAbout = () => {
  const [aboutData, setAboutData] = useState<AboutPage | null>(null);
  const [values, setValues] = useState<AboutValue[]>([]);
  const [achievements, setAchievements] = useState<AboutAchievement[]>([]);
  const [vision, setVision] = useState<AboutVision | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingValue, setEditingValue] = useState<AboutValue | null>(null);
  const [editingAchievement, setEditingAchievement] = useState<AboutAchievement | null>(null);
  const [isValueDialogOpen, setIsValueDialogOpen] = useState(false);
  const [isAchievementDialogOpen, setIsAchievementDialogOpen] = useState(false);

  const iconOptions = ['Shield', 'Heart', 'Star', 'Trophy', 'Lightbulb', 'User'];
  const colorOptions = ['blue', 'red', 'yellow', 'green', 'purple', 'orange', 'pink', 'indigo'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch about page data
      const { data: aboutPageData, error: aboutError } = await supabase
        .from('about_page')
        .select('*')
        .single();

      if (aboutError) throw aboutError;
      setAboutData(aboutPageData);

      // Fetch values
      const { data: valuesData, error: valuesError } = await supabase
        .from('about_values')
        .select('*')
        .order('created_at', { ascending: true });

      if (valuesError) throw valuesError;
      setValues(valuesData || []);

      // Fetch achievements
      const { data: achievementsData, error: achievementsError } = await supabase
        .from('about_achievements')
        .select('*')
        .order('created_at', { ascending: true });

      if (achievementsError) throw achievementsError;
      setAchievements(achievementsData || []);

      // Fetch vision
      const { data: visionData } = await supabase
        .from('about_vision')
        .select('*')
        .single();
      if (visionData) setVision(visionData);

    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données de la page À propos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAboutPage = async () => {
    if (!aboutData) return;

    try {
      const { error } = await supabase
        .from('about_page')
        .update(aboutData)
        .eq('id', aboutData.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Les données de la page À propos ont été mises à jour"
      });
    } catch (error: any) {
      console.error('Error updating about page:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les données",
        variant: "destructive"
      });
    }
  };

  const handleSaveValue = async (value: Omit<AboutValue, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (editingValue?.id) {
        const { error } = await supabase
          .from('about_values')
          .update(value)
          .eq('id', editingValue.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('about_values')
          .insert([value]);
        if (error) throw error;
      }

      await fetchData();
      setIsValueDialogOpen(false);
      setEditingValue(null);
      
      toast({
        title: "Succès",
        description: editingValue?.id ? "Valeur mise à jour" : "Valeur ajoutée"
      });
    } catch (error: any) {
      console.error('Error saving value:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la valeur",
        variant: "destructive"
      });
    }
  };

  const handleDeleteValue = async (id: string) => {
    try {
      const { error } = await supabase
        .from('about_values')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchData();
      toast({
        title: "Succès",
        description: "Valeur supprimée"
      });
    } catch (error: any) {
      console.error('Error deleting value:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la valeur",
        variant: "destructive"
      });
    }
  };

  const handleSaveAchievement = async (achievement: Omit<AboutAchievement, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (editingAchievement?.id) {
        const { error } = await supabase
          .from('about_achievements')
          .update(achievement)
          .eq('id', editingAchievement.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('about_achievements')
          .insert([achievement]);
        if (error) throw error;
      }

      await fetchData();
      setIsAchievementDialogOpen(false);
      setEditingAchievement(null);
      
      toast({
        title: "Succès",
        description: editingAchievement?.id ? "Réalisation mise à jour" : "Réalisation ajoutée"
      });
    } catch (error: any) {
      console.error('Error saving achievement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la réalisation",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAchievement = async (id: string) => {
    try {
      const { error } = await supabase
        .from('about_achievements')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchData();
      toast({
        title: "Succès",
        description: "Réalisation supprimée"
      });
    } catch (error: any) {
      console.error('Error deleting achievement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la réalisation",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Page À propos</h1>
          <p className="text-gray-600">Gérez le contenu de la page À propos</p>
        </div>
      </div>

      <Tabs defaultValue="content" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content">Contenu principal</TabsTrigger>
          <TabsTrigger value="vision">Notre Vision</TabsTrigger>
          <TabsTrigger value="values">Valeurs</TabsTrigger>
          <TabsTrigger value="achievements">Réalisations</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          {aboutData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Contenu principal
                </CardTitle>
                <CardDescription>
                  Modifiez le contenu principal de la page À propos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre principal</Label>
                    <Input
                      id="title"
                      value={aboutData.title}
                      onChange={(e) => setAboutData({...aboutData, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subtitle">Sous-titre</Label>
                    <Input
                      id="subtitle"
                      value={aboutData.subtitle}
                      onChange={(e) => setAboutData({...aboutData, subtitle: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="biography_title">Titre de la biographie</Label>
                  <Input
                    id="biography_title"
                    value={aboutData.biography_title}
                    onChange={(e) => setAboutData({...aboutData, biography_title: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="biography_content">Contenu de la biographie</Label>
                  <Textarea
                    id="biography_content"
                    rows={6}
                    value={aboutData.biography_content}
                    onChange={(e) => setAboutData({...aboutData, biography_content: e.target.value})}
                  />
                </div>


                <div className="space-y-2">
                  <Label htmlFor="biography_image">Image de la biographie</Label>
                  {aboutData.biography_image && (
                    <div className="mb-2">
                      <img
                        src={aboutData.biography_image}
                        alt="Aperçu"
                        className="h-32 w-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Input
                      id="biography_image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const fileExt = file.name.split('.').pop();
                        const filePath = `biography/about-${Date.now()}.${fileExt}`;
                        const { error: uploadError } = await supabase.storage
                          .from('images')
                          .upload(filePath, file, { upsert: true });
                        if (uploadError) {
                          toast({ title: "Erreur", description: "Impossible d'uploader l'image", variant: "destructive" });
                          return;
                        }
                        const { data: urlData } = supabase.storage.from('images').getPublicUrl(filePath);
                        setAboutData({ ...aboutData, biography_image: urlData.publicUrl });
                        toast({ title: "Succès", description: "Image uploadée, pensez à sauvegarder" });
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => document.getElementById('biography_image')?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choisir une image
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">Ou entrez une URL directement :</p>
                  <Input
                    placeholder="https://..."
                    value={aboutData.biography_image}
                    onChange={(e) => setAboutData({...aboutData, biography_image: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="election_date">Date d'élection</Label>
                    <Input
                      id="election_date"
                      value={aboutData.election_date}
                      onChange={(e) => setAboutData({...aboutData, election_date: e.target.value})}
                    />
                  </div>
                </div>


                <div className="space-y-2">
                  <Label htmlFor="election_description">Description de l'élection</Label>
                  <Textarea
                    id="election_description"
                    rows={3}
                    value={aboutData.election_description}
                    onChange={(e) => setAboutData({...aboutData, election_description: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cta_title">Titre d'appel à l'action</Label>
                    <Input
                      id="cta_title"
                      value={aboutData.cta_title}
                      onChange={(e) => setAboutData({...aboutData, cta_title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cta_subtitle">Sous-titre d'appel à l'action</Label>
                    <Textarea
                      id="cta_subtitle"
                      rows={2}
                      value={aboutData.cta_subtitle}
                      onChange={(e) => setAboutData({...aboutData, cta_subtitle: e.target.value})}
                    />
                  </div>
                </div>

                <Button onClick={handleSaveAboutPage} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder les modifications
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="vision" className="space-y-6">
          {vision && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Notre Vision
                </CardTitle>
                <CardDescription>Modifiez la section "Notre Vision" affichée après la biographie</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vision_title">Titre</Label>
                  <Input
                    id="vision_title"
                    value={vision.title}
                    onChange={(e) => setVision({...vision, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vision_subtitle">Sous-titre</Label>
                  <Input
                    id="vision_subtitle"
                    value={vision.subtitle}
                    onChange={(e) => setVision({...vision, subtitle: e.target.value})}
                    placeholder="Ex : Une vision pour le Togo de demain"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vision_content">Contenu de la vision</Label>
                  <Textarea
                    id="vision_content"
                    rows={6}
                    value={vision.content}
                    onChange={(e) => setVision({...vision, content: e.target.value})}
                    placeholder="Décrivez la vision du sénateur..."
                  />
                </div>
                <Button onClick={async () => {
                  try {
                    const { error } = await supabase
                      .from('about_vision')
                      .update({ title: vision.title, subtitle: vision.subtitle, content: vision.content })
                      .eq('id', vision.id);
                    if (error) throw error;
                    toast({ title: "Succès", description: "Vision mise à jour" });
                  } catch (err: any) {
                    toast({ title: "Erreur", description: "Impossible de mettre à jour la vision", variant: "destructive" });
                  }
                }} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder la vision
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="values" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Valeurs</h2>
            <Dialog open={isValueDialogOpen} onOpenChange={setIsValueDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setEditingValue(null);
                  setIsValueDialogOpen(true);
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une valeur
                </Button>
              </DialogTrigger>
              <ValueDialog
                value={editingValue}
                onSave={handleSaveValue}
                iconOptions={iconOptions}
                colorOptions={colorOptions}
              />
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {values.map((value) => (
              <Card key={value.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{value.title}</span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setEditingValue(value);
                          setIsValueDialogOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteValue(value.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">{value.description}</p>
                  <div className="flex gap-2">
                    <Badge variant="outline">{value.icon}</Badge>
                    <Badge variant="outline">{value.color}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Réalisations</h2>
            <Dialog open={isAchievementDialogOpen} onOpenChange={setIsAchievementDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setEditingAchievement(null);
                  setIsAchievementDialogOpen(true);
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une réalisation
                </Button>
              </DialogTrigger>
              <AchievementDialog
                achievement={editingAchievement}
                onSave={handleSaveAchievement}
                colorOptions={colorOptions}
              />
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{achievement.title}</span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setEditingAchievement(achievement);
                          setIsAchievementDialogOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteAchievement(achievement.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Badge variant="outline">{achievement.year}</Badge>
                      <Badge variant="outline">{achievement.color}</Badge>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {achievement.items.map((item, index) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface ValueDialogProps {
  value: AboutValue | null;
  onSave: (value: Omit<AboutValue, 'id' | 'created_at' | 'updated_at'>) => void;
  iconOptions: string[];
  colorOptions: string[];
}

const ValueDialog: React.FC<ValueDialogProps> = ({ value, onSave, iconOptions, colorOptions }) => {
  const [formData, setFormData] = useState({
    title: value?.title || '',
    description: value?.description || '',
    icon: value?.icon || iconOptions[0],
    color: value?.color || colorOptions[0]
  });

  // Sync form data when editing a different value
  useEffect(() => {
    setFormData({
      title: value?.title || '',
      description: value?.description || '',
      icon: value?.icon || iconOptions[0],
      color: value?.color || colorOptions[0]
    });
  }, [value]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    if (!value) {
      setFormData({ title: '', description: '', icon: iconOptions[0], color: colorOptions[0] });
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{value ? 'Modifier la valeur' : 'Ajouter une valeur'}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Titre</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="icon">Icône</Label>
            <Select value={formData.icon} onValueChange={(value) => setFormData({...formData, icon: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map((icon) => (
                  <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">Couleur</Label>
            <Select value={formData.color} onValueChange={(value) => setFormData({...formData, color: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {colorOptions.map((color) => (
                  <SelectItem key={color} value={color}>{color}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button type="submit" className="w-full">
          <Save className="w-4 h-4 mr-2" />
          Sauvegarder
        </Button>
      </form>
    </DialogContent>
  );
};

interface AchievementDialogProps {
  achievement: AboutAchievement | null;
  onSave: (achievement: Omit<AboutAchievement, 'id' | 'created_at' | 'updated_at'>) => void;
  colorOptions: string[];
}

const AchievementDialog: React.FC<AchievementDialogProps> = ({ achievement, onSave, colorOptions }) => {
  const [formData, setFormData] = useState({
    year: achievement?.year || '',
    title: achievement?.title || '',
    items: achievement?.items?.join('\n') || '',
    color: achievement?.color || colorOptions[0]
  });

  // Sync form data when editing a different achievement
  useEffect(() => {
    setFormData({
      year: achievement?.year || '',
      title: achievement?.title || '',
      items: achievement?.items?.join('\n') || '',
      color: achievement?.color || colorOptions[0]
    });
  }, [achievement]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const items = formData.items.split('\n').filter(item => item.trim() !== '');
    onSave({ year: formData.year, title: formData.title, items, color: formData.color });
    if (!achievement) {
      setFormData({ year: '', title: '', items: '', color: colorOptions[0] });
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{achievement ? 'Modifier la réalisation' : 'Ajouter une réalisation'}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="year">Année</Label>
            <Input
              id="year"
              value={formData.year}
              onChange={(e) => setFormData({...formData, year: e.target.value})}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">Couleur</Label>
            <Select value={formData.color} onValueChange={(value) => setFormData({...formData, color: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {colorOptions.map((color) => (
                  <SelectItem key={color} value={color}>{color}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">Titre</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="items">Éléments (un par ligne)</Label>
          <Textarea
            id="items"
            rows={5}
            value={formData.items}
            onChange={(e) => setFormData({...formData, items: e.target.value})}
            placeholder="Élément 1&#10;Élément 2&#10;Élément 3"
            required
          />
        </div>
        <Button type="submit" className="w-full">
          <Save className="w-4 h-4 mr-2" />
          Sauvegarder
        </Button>
      </form>
    </DialogContent>
  );
};

export default AdminAbout;