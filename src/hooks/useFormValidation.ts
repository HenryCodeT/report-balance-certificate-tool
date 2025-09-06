// hooks/useFormValidation.ts
import { useMemo } from 'react';
import { FormData, FormDataFields, TireData } from '@/models/interface';

export const useFormValidation = (formData: FormData, tireData: TireData[] = []) => {
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
  const isMainFormValid = useMemo(() => {
    return requiredFields.every((field) => formData[field].trim() !== "");
  }, [formData]);

  // Validación de datos de llantas
  const tireValidation = useMemo(() => {
    const numberOfTires = parseInt(formData.numeroLlantas);
    const activeTires = tireData.slice(0, numberOfTires);
    const validationResults = activeTires.map((tire, index) => {

      const hasPhotos = tire.photos && tire.photos.length === 2;
      const hasValidContrapesos = tire.contrapesoInterior >= 0 && tire.contrapesoExterior >= 0;
      
      return {
        tireIndex: index,
        position: tire.position,
        isValid: hasPhotos && hasValidContrapesos,
        errors: {
          noPhotos: !hasPhotos,
          invalidContrapesos: !hasValidContrapesos,
        }
      };
    });
    
    const allTiresValid = validationResults.every(result => result.isValid);
    const invalidTires = validationResults.filter(result => !result.isValid);

    return {
      allTiresValid,
      invalidTires,
      validationResults
    };
  }, [tireData, formData.numeroLlantas]);

  // Validación general completa
  const isFormValid = useMemo(() => {
    return isMainFormValid && tireValidation.allTiresValid;
  }, [isMainFormValid, tireValidation.allTiresValid]);

  const getMissingFields = useMemo(() => {
    return requiredFields.filter((field) => formData[field].trim() === "");
  }, [formData]);

  const getFieldValidation = (fieldName: FormDataFields) => {
    return {
      isValid: formData[fieldName].trim() !== "",
      errorMessage: formData[fieldName].trim() === "" ? "Este campo es obligatorio" : ""
    };
  };

  // Obtener errores de llantas específicos
  const getTireErrors = useMemo(() => {
    const errors: string[] = [];
    
    tireValidation.invalidTires.forEach(tire => {
      if (tire.errors.noPhotos) {
        errors.push(`Llanta ${tire.position}: Debe agregar al menos una foto`);
      }
      if (tire.errors.invalidContrapesos) {
        errors.push(`Llanta ${tire.position}: Los valores de contrapeso deben ser válidos`);
      }
    });

    return errors;
  }, [tireValidation.invalidTires]);

  // Obtener resumen de validación completa
  const getValidationSummary = useMemo(() => {
    const missingMainFields = getMissingFields;
    const tireErrors = getTireErrors;
    
    return {
      isValid: isFormValid,
      mainFormValid: isMainFormValid,
      tiresValid: tireValidation.allTiresValid,
      missingMainFields,
      tireErrors,
      totalErrors: missingMainFields.length + tireErrors.length
    };
  }, [isFormValid, isMainFormValid, tireValidation.allTiresValid, getMissingFields, getTireErrors]);

  return {
    isFormValid,
    isMainFormValid,
    tireValidation,
    getMissingFields,
    getFieldValidation,
    getTireErrors,
    getValidationSummary,
    requiredFields
  };
};