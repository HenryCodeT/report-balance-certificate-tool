"use client";

import React, { useState, ChangeEvent } from "react";
import { FormData, PreviewModalState } from "@/models/interface";

// Importar todos los componentes
import Header from "@/components/Header";
import VehicleForm from "@/components/VehicleForm";
import TireSelector from "@/components/TireSelector";
import TireForm from "@/components/TireForm";
import GenerateButton from "@/components/GenerateButton";
import PreviewModal from "@/components/PreviewModal";

// Importar hooks personalizados
import { useFormValidation } from "@/hooks/useFormValidation";
import { useTireData } from "@/hooks/useTireData";
import { usePhotoUpload } from "@/hooks/usePhotoUpload";
import { usePDFGenerator } from "@/hooks/usePDFGenerator";

const Home: React.FC = () => {
  // Estado del formulario principal
  const [formData, setFormData] = useState<FormData>({
    fecha: "",
    cliente: "",
    placa: "",
    kilometraje: "",
    equipoUsado: "",
    modeloVehiculo: "",
    procedencia: "",
    marca: "",
    codigo: "",
    modeloEquipo: "",
    numeroLlantas: "2",
  });

  // Estado del modal de previsualización
  const [previewModal, setPreviewModal] = useState<PreviewModalState>({
    isOpen: false,
    imageUrl: "",
    title: "",
  });

  // Hooks personalizados
  const { generatePDF } = usePDFGenerator();
  const { isFormValid } = useFormValidation(formData);
  const { 
    tireData, 
    updateTireCount, 
    updateTireField, 
    addPhotos, 
    removePhoto 
  } = useTireData();
  const { handlePhotoUpload } = usePhotoUpload();

  // Manejadores de eventos principales
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTireCountChange = (count: "2" | "4") => {
    setFormData((prev) => ({ ...prev, numeroLlantas: count }));
    updateTireCount(count);
  };

  const handlePhotoUploadWrapper = (
    tireIndex: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const currentPhotoCount = tireData[tireIndex].photos.length;
    
    handlePhotoUpload(
      event,
      currentPhotoCount,
      (newPhotos) => {
        addPhotos(tireIndex, newPhotos);
      },
      (error) => {
        console.error("Error uploading photos:", error);
        alert(`Error al subir las fotos: ${error}`);
      }
    );
  };

  const handlePhotoPreview = (imageUrl: string, title: string) => {
    setPreviewModal({ isOpen: true, imageUrl, title });
  };

  const handleCloseModal = () => {
    setPreviewModal({ isOpen: false, imageUrl: "", title: "" });
  };

  const handleGeneratePDF = async () => {
    try {
      await generatePDF(formData, tireData);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error al generar el PDF. Por favor, inténtelo de nuevo.");
    }
  };

  // Render
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Header />
        
        <VehicleForm 
          formData={formData} 
          onInputChange={handleInputChange} 
        />
        
        <TireSelector 
          selectedCount={formData.numeroLlantas}
          onCountChange={handleTireCountChange}
        />
        
        {tireData
          .slice(0, parseInt(formData.numeroLlantas))
          .map((tire, index) => (
            <TireForm
              key={tire.id}
              tire={tire}
              index={index}
              onDataChange={updateTireField}
              onPhotoUpload={handlePhotoUploadWrapper}
              onPhotoRemove={removePhoto}
              onPhotoPreview={handlePhotoPreview}
            />
          ))}
        
        <GenerateButton 
          isValid={isFormValid}
          onGenerate={handleGeneratePDF}
        />
        
        <PreviewModal 
          modal={previewModal}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
};

export default Home;