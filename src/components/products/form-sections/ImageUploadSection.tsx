
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { ProductValidationErrors } from '@/types/product';

interface ImageUploadSectionProps {
  imagePreviews: string[];
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  validationErrors: ProductValidationErrors;
}

const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  imagePreviews,
  onImageUpload,
  onRemoveImage,
  validationErrors
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Imágenes del producto *</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6"
                  onClick={() => onRemoveImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={imagePreviews.length >= 10}
          >
            <Upload className="mr-2 h-4 w-4" />
            Subir imágenes
          </Button>
          <span className="text-sm text-muted-foreground self-center">
            {imagePreviews.length}/10 imágenes
          </span>
        </div>

        <input
          id="file-upload"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={onImageUpload}
        />

        {validationErrors.images && (
          <p className="text-sm text-red-500">{validationErrors.images}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageUploadSection;
