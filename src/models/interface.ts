// Definición de tipos para las estructuras de datos
// 'Photo' representa una foto subida, con un ID único, URL y nombre de archivo.
export interface Photo {
    id: number;
    url: string;
    name: string;
}

// 'TireData' almacena los datos de balanceo y fotos para cada llanta.
export interface TireData {
    id: number;
    lh: string; // Parámetro LH (del inglés 'left-hand')
    rh: string; // Parámetro RH (del inglés 'right-hand')
    contrapesoInterior: string;
    contrapesoExterior: string;
    photos: Photo[]; // Un array de fotos asociadas a la llanta
}

// 'FormData' contiene la información general del vehículo y el cliente.
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
    numeroLlantas: "2" | "4"; // Opciones para el número de llantas
}

// 'PreviewModalState' gestiona el estado del modal para previsualizar imágenes.
export interface PreviewModalState {
    isOpen: boolean;
    imageUrl: string;
    title: string;
}
