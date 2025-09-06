// hooks/useFormValidation.ts
import { useMemo } from 'react';
import { FormData, FormDataFields } from '@/models/interface';

export const useFormValidation = (formData: FormData) => {
  const requiredFields: FormDataFields[] = [
    "fecha",
    "cliente",
    "placa",
    "kilometraje",
    "equipoUsado",
    "modeloVehiculo",
    "procedencia",
    "marca",
    "codigo",
    "modeloEquipo"
  ];

  // Validación de campos del formulario principal
  const isFormValid = useMemo(() => {
    return requiredFields.every((field) => formData[field].trim() !== "");
  }, [formData]);

  const getMissingFields = useMemo(() => {
    return requiredFields.filter((field) => formData[field].trim() === "");
  }, [formData]);

  const getFieldValidation = (fieldName: FormDataFields) => {
    return {
      isValid: formData[fieldName].trim() !== "",
      errorMessage: formData[fieldName].trim() === "" ? "Este campo es obligatorio" : ""
    };
  };

  // Obtener resumen de validación completa
  const getValidationSummary = useMemo(() => {
    const missingMainFields = getMissingFields;
    
    return {
      isValid: isFormValid,
      missingMainFields,
      totalErrors: missingMainFields.length
    };
  }, [isFormValid, getMissingFields]);
  
  return {
    isFormValid,
    getMissingFields,
    getFieldValidation,
    getValidationSummary,
    requiredFields
  };
};