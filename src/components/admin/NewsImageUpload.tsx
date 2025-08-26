
import React from 'react';
import { ImageUpload } from '@/components/ui/image-upload';

interface NewsImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  className?: string;
}

export const NewsImageUpload: React.FC<NewsImageUploadProps> = ({
  value,
  onChange,
  label = "Image de l'actualité",
  required = false,
  className = ""
}) => {
  return (
    <ImageUpload
      value={value}
      onChange={onChange}
      label={label}
      placeholder="https://exemple.com/image.jpg"
      required={required}
      className={className}
      previewClassName="aspect-video"
      bucket="images"
    />
  );
};
