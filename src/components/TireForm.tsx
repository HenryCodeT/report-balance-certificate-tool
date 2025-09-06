// components/TireForm.tsx
import React, { ChangeEvent, useEffect, useState } from 'react';
import { TireData } from '@/models/interface';
import PhotoGallery from './PhotoGallery';

interface TireFormProps {
  tire: TireData;
  index: number;
  onDataChange: (index: number, field: keyof Omit<TireData, "id" | "photos" | "position">, value: number) => void;
  onPhotoUpload: (tireIndex: number, event: ChangeEvent<HTMLInputElement>) => void;
  onPhotoRemove: (tireIndex: number, photoId: number) => void;
  onPhotoPreview: (imageUrl: string, title: string) => void;
}

const TireForm: React.FC<TireFormProps> = ({
  tire,
  index,
  onDataChange,
  onPhotoUpload,
  onPhotoRemove,
  onPhotoPreview,
}) => {
  const [contrapesoInterior, setContrapesoInterior] = useState<string>(
    tire.contrapesoInterior === 0 ? '' : String(tire.contrapesoInterior)
  );
  const [contrapesoExterior, setContrapesoExterior] = useState<string>(
    tire.contrapesoExterior === 0 ? '' : String(tire.contrapesoExterior)
  );

  useEffect(() => {
    setContrapesoInterior(tire.contrapesoInterior === 0 ? '' : String(tire.contrapesoInterior));
    setContrapesoExterior(tire.contrapesoExterior === 0 ? '' : String(tire.contrapesoExterior));
  }, [tire.contrapesoInterior, tire.contrapesoExterior]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, field: 'contrapesoInterior' | 'contrapesoExterior') => {
    const { value } = e.target;
    // Solo permitir números y un punto decimal
    if (/^-?\d*\.?\d*$/.test(value) || value === '') {
      if (field === 'contrapesoInterior') {
        setContrapesoInterior(value);
      } else {
        setContrapesoExterior(value);
      }
      const numericValue = parseFloat(value);
      if (!isNaN(numericValue)) {
        onDataChange(index, field, numericValue);
      }
    }
  };

  const fieldData = [
    { key: 'contrapesoInterior' as const, label: 'Contrapeso Interior (gr)', value: contrapesoInterior, placeholder: '0 Gr.' },
    { key: 'contrapesoExterior' as const, label: 'Contrapeso Exterior (gr)', value: contrapesoExterior, placeholder: '0 Gr.' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Parámetros Iniciales {tire.position}
      </h3>

      {/* Campos de entrada para los parámetros de la llanta */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {fieldData.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
            </label>
            <input
              type="text"
              value={field.value}
              onChange={(e) => handleInputChange(e, field.key)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={field.placeholder}
            />
          </div>
        ))}
      </div>

      {/* Galería de fotos */}
      <PhotoGallery
        photos={tire.photos}
        tireIndex={index}
        onPhotoUpload={onPhotoUpload}
        onPhotoRemove={onPhotoRemove}
        onPhotoPreview={onPhotoPreview}
      />
    </div>
  );
};

export default TireForm;