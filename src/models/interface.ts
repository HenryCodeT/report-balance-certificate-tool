// models/interface.ts
export interface Photo {
  id: number;
  url: string;
  name: string;
}

export interface TireData {
  id: number;
  position: "LH1" | "RH1" | "LH2" | "RH2";
  contrapesoInterior: number;      
  contrapesoExterior: number;
  photos: Photo[];
}

export interface FormData {
  fecha: string;
  cliente: string;
  placa: string;
  kilometraje: string;
  equipoUsado: string;
  modeloVehiculo: string;
  procedencia: string;
  marca: string;
  codigo: string;
  numeroLlantas: string;
  modeloEquipo: string;
}

export interface PreviewModalState {
  isOpen: boolean;
  imageUrl: string;
  title: string;
}

// Tipos auxiliares para mejor tipado
export type TireFormFields = keyof Omit<TireData, "id" | "photos" | "position" >;
export type FormDataFields = keyof FormData;
export type TireCount = "2" | "4";