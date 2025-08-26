
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink } from 'lucide-react';

interface MediaPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  media: {
    id: string;
    title: string;
    category: string;
    thumbnail: string;
    src?: string;
    date: string;
  } | null;
}

export const MediaPreview: React.FC<MediaPreviewProps> = ({
  isOpen,
  onClose,
  media
}) => {
  if (!media) return null;

  const handleDownload = () => {
    if (media.src || media.thumbnail) {
      const link = document.createElement('a');
      link.href = media.src || media.thumbnail;
      link.download = `${media.title}.${getFileExtension(media.src || media.thumbnail)}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getFileExtension = (url: string) => {
    return url.split('.').pop() || 'jpg';
  };

  const renderMediaContent = () => {
    if (media.category === 'Vidéo') {
      return (
        <video 
          controls 
          className="w-full max-h-96 rounded-lg"
          src={media.src || media.thumbnail}
        >
          Votre navigateur ne supporte pas les vidéos.
        </video>
      );
    } else if (media.category === 'Audio') {
      return (
        <div className="flex flex-col items-center p-8">
          <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <span className="text-4xl">🎵</span>
          </div>
          <audio 
            controls 
            className="w-full"
            src={media.src || media.thumbnail}
          >
            Votre navigateur ne supporte pas l'audio.
          </audio>
        </div>
      );
    } else {
      return (
        <img
          src={media.thumbnail}
          alt={media.title}
          className="w-full max-h-96 object-contain rounded-lg"
        />
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{media.title}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </Button>
              {(media.src || media.thumbnail) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(media.src || media.thumbnail, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ouvrir
                </Button>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-center bg-gray-50 rounded-lg p-4">
            {renderMediaContent()}
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Catégorie:</span>
              <span className="ml-2">{media.category}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Date:</span>
              <span className="ml-2">{new Date(media.date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
