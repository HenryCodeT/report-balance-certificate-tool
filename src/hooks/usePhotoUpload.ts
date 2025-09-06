// hooks/usePhotoUpload.ts
import { useCallback, ChangeEvent } from 'react';
import { Photo } from '@/models/interface';

export const usePhotoUpload = () => {
  const processFiles = useCallback(async (
    files: FileList | null,
    currentPhotoCount: number,
    maxPhotos = 2
  ): Promise<Photo[]> => {
    if (!files) return [];

    const validImageFiles = Array.from(files).filter(file => 
      file.type.startsWith("image/")
    );
    
    if (validImageFiles.length === 0) {
      throw new Error("No se encontraron archivos de imagen válidos");
    }

    const photosToAdd: File[] = [];
    
    for (const file of validImageFiles) {
      if (currentPhotoCount + photosToAdd.length >= maxPhotos) {
        alert(`Ya has subido el máximo de ${maxPhotos} fotos para esta llanta.`);
        break;
      }
      photosToAdd.push(file);
    }

    const promises = photosToAdd.map((file) => {
      return new Promise<Photo>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            id: Date.now() + Math.random(),
            url: e.target?.result as string,
            name: file.name,
          });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    return Promise.all(promises);
  }, []);

  const handlePhotoUpload = useCallback(async (
    event: ChangeEvent<HTMLInputElement>,
    currentPhotoCount: number,
    onSuccess: (photos: Photo[]) => void,
    onError?: (error: string) => void,
    maxPhotos = 2
  ) => {
    try {
      const newPhotos = await processFiles(
        event.target.files,
        currentPhotoCount,
        maxPhotos
      );
      
      if (newPhotos.length > 0) {
        onSuccess(newPhotos);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al procesar las imágenes";
      console.error("Error al cargar las fotos:", error);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
      event.target.value = "";
    }
  }, [processFiles]);

  return {
    handlePhotoUpload,
    processFiles,
  };
};