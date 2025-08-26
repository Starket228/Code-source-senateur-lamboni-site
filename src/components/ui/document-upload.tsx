
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Link as LinkIcon, X, FileText, Loader2, CheckCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { StorageService } from '@/utils/storageUtils';

interface DocumentUploadProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  value,
  onChange,
  label = "Document",
  placeholder = "https://exemple.com/document.pdf",
  required = false,
  className = ""
}) => {
  const [activeTab, setActiveTab] = useState<'url' | 'upload'>('url');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('DocumentUpload: Starting upload for file:', file.name, 'Size:', file.size);
    setUploadProgress('Validation du fichier...');

    // Valider le fichier
    const validation = StorageService.validateFile(file, 'documents');
    if (!validation.valid) {
      console.error('DocumentUpload: File validation failed:', validation.error);
      toast({
        title: 'Erreur de validation',
        description: validation.error,
        variant: 'destructive'
      });
      setUploadProgress('');
      return;
    }

    console.log('DocumentUpload: File validation passed, starting upload...');
    setIsUploading(true);
    setUploadProgress('Téléchargement en cours...');
    
    try {
      // Upload vers Supabase Storage
      const result = await StorageService.uploadFile('documents', file);
      
      console.log('DocumentUpload: Upload result:', result);
      
      if (result.success && result.data) {
        const uploadedUrl = result.data.url;
        console.log('DocumentUpload: Upload successful, URL:', uploadedUrl);
        
        setUploadProgress('Finalisation...');
        
        // Attendre un petit délai pour s'assurer que le fichier est bien disponible
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Vérifier que l'URL est accessible
        console.log('DocumentUpload: Verifying URL accessibility:', uploadedUrl);
        
        // Transmettre immédiatement l'URL au parent
        onChange(uploadedUrl);
        
        // Changer vers l'onglet URL pour montrer le résultat
        setActiveTab('url');
        
        setUploadProgress('Téléchargement terminé !');
        
        toast({
          title: '✅ Document téléchargé',
          description: 'Le document a été téléchargé avec succès et est maintenant disponible.',
        });
        
        console.log('DocumentUpload: Document URL transmitted to parent:', uploadedUrl);
        
        // Clear progress after a short delay
        setTimeout(() => setUploadProgress(''), 2000);
      } else {
        console.error('DocumentUpload: Upload failed with error:', result.error);
        setUploadProgress('');
        throw new Error(result.error || 'Erreur lors de l\'upload');
      }
    } catch (error) {
      console.error('DocumentUpload: Upload exception:', error);
      setUploadProgress('');
      toast({
        title: 'Erreur d\'upload',
        description: error instanceof Error ? error.message : 'Une erreur est survenue lors du téléchargement.',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    console.log('DocumentUpload: Manual URL changed to:', newValue);
    onChange(newValue);
  };

  const clearDocument = () => {
    console.log('DocumentUpload: Clearing document');
    onChange('');
    setUploadProgress('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  const testDocumentAccess = async () => {
    if (!value) return;
    
    console.log('DocumentUpload: Testing document access for URL:', value);
    try {
      const response = await fetch(value, { method: 'HEAD' });
      if (response.ok) {
        toast({
          title: '✅ Document accessible',
          description: 'Le document est bien accessible.',
        });
      } else {
        toast({
          title: '⚠️ Problème d\'accès',
          description: 'Le document pourrait ne pas être accessible.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('DocumentUpload: Error testing document access:', error);
      toast({
        title: '❌ Erreur d\'accès',
        description: 'Impossible de vérifier l\'accès au document.',
        variant: 'destructive'
      });
    }
  };

  console.log('DocumentUpload: Current value:', value, 'Active tab:', activeTab, 'Upload progress:', uploadProgress);

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
          <div className="flex gap-2">
            <Input
              value={value}
              onChange={handleUrlChange}
              placeholder={placeholder}
              className="bg-white/70 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent flex-1"
            />
            {value && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={testDocumentAccess}
                className="px-3"
              >
                Test
              </Button>
            )}
          </div>
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
              PDF, Word, Texte (max 10MB)
            </span>
          </div>
          
          {uploadProgress && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              {uploadProgress === 'Téléchargement terminé !' ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              {uploadProgress}
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="hidden"
          />
        </TabsContent>
      </Tabs>

      {value && (
        <Card className="overflow-hidden">
          <CardContent className="p-4 relative">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  Document attaché
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {value}
                </p>
                <div className="mt-1">
                  <a 
                    href={value} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      console.log('DocumentUpload: Opening document:', value);
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    Ouvrir le document
                  </a>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-400 hover:text-red-500"
                onClick={clearDocument}
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
