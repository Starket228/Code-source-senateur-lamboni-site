
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2, Download } from 'lucide-react';

interface MediaCardProps {
  media: {
    id: string;
    title: string;
    category: string;
    thumbnail: string;
    date: string;
    src?: string;
  };
  isSelected: boolean;
  onSelect: (id: string, selected: boolean) => void;
  onPreview: (media: any) => void;
  onEdit: (media: any) => void;
  onDelete: (id: string) => void;
  viewMode: 'grid' | 'list';
}

export const MediaCard: React.FC<MediaCardProps> = ({
  media,
  isSelected,
  onSelect,
  onPreview,
  onEdit,
  onDelete,
  viewMode
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Vidéo': return '🎬';
      case 'Audio': return '🎵';
      default: return '📷';
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (media.src || media.thumbnail) {
      const link = document.createElement('a');
      link.href = media.src || media.thumbnail;
      link.download = `${media.title}.${(media.src || media.thumbnail).split('.').pop()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (viewMode === 'list') {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => onSelect(media.id, checked as boolean)}
            />
            
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
              {media.category === 'Audio' ? (
                <span className="text-2xl">{getCategoryIcon(media.category)}</span>
              ) : (
                <img
                  src={media.thumbnail}
                  alt={media.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{media.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {getCategoryIcon(media.category)} {media.category}
                </Badge>
                <span className="text-sm text-gray-500">
                  {new Date(media.date).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => onPreview(media)}>
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onEdit(media)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete(media.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden group">
      <div className="relative">
        <div className="absolute top-2 left-2 z-10">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelect(media.id, checked as boolean)}
            className="bg-white/80 backdrop-blur-sm"
          />
        </div>
        
        <div className="absolute top-2 right-2 z-10">
          <Badge variant="secondary" className="bg-white/80 backdrop-blur-sm">
            {getCategoryIcon(media.category)} {media.category}
          </Badge>
        </div>
        
        <div 
          className="aspect-video cursor-pointer bg-gray-100 flex items-center justify-center"
          onClick={() => onPreview(media)}
        >
          {media.category === 'Audio' ? (
            <span className="text-4xl">{getCategoryIcon(media.category)}</span>
          ) : (
            <img
              src={media.thumbnail}
              alt={media.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          )}
        </div>
      </div>
      
      <CardContent className="p-3">
        <h3 className="font-medium text-sm mb-1 line-clamp-2">{media.title}</h3>
        <p className="text-xs text-gray-500">
          {new Date(media.date).toLocaleDateString()}
        </p>
      </CardContent>
      
      <CardFooter className="p-2 pt-0 flex justify-between">
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => onPreview(media)}>
            <Eye className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDownload}>
            <Download className="h-3 w-3" />
          </Button>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => onEdit(media)}>
            <Edit className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(media.id)}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
