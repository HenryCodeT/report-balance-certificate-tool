// components/PhotoGallery.tsx
import React, { useRef, ChangeEvent } from 'react';
import { Camera, Eye, Trash2 } from 'lucide-react';
import { Photo } from '@/models/interface';

interface PhotoGalleryProps {
  photos: Photo[];
  tireIndex: number;
  maxPhotos?: number;
  onPhotoUpload: (tireIndex: number, event: ChangeEvent<HTMLInputElement>) => void;
  onPhotoRemove: (tireIndex: number, photoId: number) => void;
  onPhotoPreview: (imageUrl: string, title: string) => void;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  photos,
  tireIndex,
  maxPhotos = 2,
  onPhotoUpload,
  onPhotoRemove,
  onPhotoPreview,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Fotos (máximo {maxPhotos} por llanta)
      </label>

      {/* Botón para subir fotos */}
      {photos.length < maxPhotos && (
        <div className="mb-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => onPhotoUpload(tireIndex, e)}
            accept="image/*"
            multiple
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500"
          >
            <Camera className="w-4 h-4 mr-2" />
            Subir Fotos ({photos.length}/{maxPhotos})
          </button>
        </div>
      )}

      {/* Galería de fotos */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="relative bg-gray-100 rounded-lg p-2"
            >
              <img
                src={photo.url}
                alt={photo.name}
                className="w-full h-32 object-cover rounded-md cursor-pointer"
                onClick={() =>
                  onPhotoPreview(photo.url, `Llanta ${tireIndex + 1} - ${photo.name}`)
                }
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-600 truncate">
                  {photo.name}
                </span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      onPhotoPreview(photo.url, `Llanta ${tireIndex + 1} - ${photo.name}`)
                    }
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onPhotoRemove(tireIndex, photo.id)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;