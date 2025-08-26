
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Link as LinkIcon, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { StorageService } from '@/utils/storageUtils';

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  previewClassName?: string;
  bucket?: 'images' | 'media' | 'documents';
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  label = "Image",
  placeholder = "https://exemple.com/image.jpg",
  required = false,
  className = "",
  previewClassName = "aspect-video",
  bucket = 'images'
}) => {
  const [activeTab, setActiveTab] = useState<'url' | 'upload'>('url');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Valider le fichier
    const validation = StorageService.validateFile(file, bucket);
    if (!validation.valid) {
      toast({
        title: 'Erreur de validation',
        description: validation.error,
        variant: 'destructive'
      });
      return;
    }

    setIsUploading(true);
    try {
      console.log('ImageUpload: Starting file upload...');
      
      // Upload vers Supabase Storage
      const result = await StorageService.uploadFile(bucket, file);
      
      if (result.success && result.data) {
        onChange(result.data.url);
        toast({
          title: 'Image téléchargée',
          description: 'L\'image a été téléchargée avec succès.',
        });
        console.log('ImageUpload: Upload successful:', result.data.url);
      } else {
        throw new Error(result.error || 'Erreur lors de l\'upload');
      }
    } catch (error) {
      console.error('ImageUpload: Upload failed:', error);
      toast({
        title: 'Erreur d\'upload',
        description: error instanceof Error ? error.message : 'Une erreur est survenue lors du téléchargement.',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const clearImage = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        {required && <span className="w-2 h-2 bg-red-500 rounded-full"></span>}
        {label}
      </label>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'url' | 'upload')} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="url" className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            URL en ligne
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Télécharger fichier
          </TabsTrigger>
        </TabsList>

        <TabsContent value="url" className="space-y-3">
          <Input
            value={value}
            onChange={handleUrlChange}
            placeholder={placeholder}
            className="bg-white/70 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </TabsContent>

        <TabsContent value="upload" className="space-y-3">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={openFileDialog}
              disabled={isUploading}
              className="flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Upload en cours...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Choisir un fichier
                </>
              )}
            </Button>
            <span className="text-sm text-gray-500">
              {bucket === 'images' && 'PNG, JPG, GIF, WebP (max 5MB)'}
              {bucket === 'media' && 'Images, Vidéos, Audio (max 50MB)'}
              {bucket === 'documents' && 'PDF, Word, Texte (max 10MB)'}
            </span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept={
              bucket === 'images' 
                ? 'image/*' 
                : bucket === 'media' 
                  ? 'image/*,video/*,audio/*' 
                  : '.pdf,.doc,.docx,.txt'
            }
            onChange={handleFileUpload}
            disabled={isUploading}
            className="hidden"
          />
        </TabsContent>
      </Tabs>

      {value && (
        <Card className="overflow-hidden">
          <CardContent className="p-0 relative">
            <div className={`${previewClassName} relative overflow-hidden bg-gray-100 rounded-lg`}>
              <img
                src={value}
                alt="Aperçu"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='0.3em' font-family='sans-serif' font-size='14' fill='%236b7280'%3EImage non disponible%3C/text%3E%3C/svg%3E";
                }}
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-lg"
                onClick={clearImage}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
