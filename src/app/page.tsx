"use client";

import React, { useState, useRef, ChangeEvent } from "react";
// Importación de íconos para la interfaz de usuario
import { Camera, Download, Trash2, Eye } from "lucide-react";
import { TireData, FormData, PreviewModalState, Photo } from "@/models/interface";

type jsPDF = typeof import("jspdf").jsPDF;

const Home: React.FC = () => {
  // Estado para la información del vehículo y cliente
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
    numeroLlantas: "2", // Valor inicial por defecto
  });

  // Estado para los datos de las llantas
  const [tireData, setTireData] = useState<TireData[]>([
    {
      id: 1,
      lh: "",
      rh: "",
      contrapesoInterior: "",
      contrapesoExterior: "",
      photos: [],
    },
    {
      id: 2,
      lh: "",
      rh: "",
      contrapesoInterior: "",
      contrapesoExterior: "",
      photos: [],
    },
  ]);

  // Estado para controlar el modal de previsualización de fotos
  const [previewModal, setPreviewModal] = useState<PreviewModalState>({
    isOpen: false,
    imageUrl: "",
    title: "",
  });

  // 'useRef' se usa para acceder a los elementos <input type="file"> de forma imperativa
  // para poder activar el cuadro de diálogo de carga de archivos mediante un botón.
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Manejador de cambios para los campos de entrada de texto
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejador para cambiar el número de llantas (2 o 4)
  const handleTireCountChange = (count: "2" | "4") => {
    setFormData((prev) => ({ ...prev, numeroLlantas: count }));

    if (count === "2") {
      // Si se selecciona 2, se recorta el array a solo las dos primeras llantas
      setTireData((prev) => prev.slice(0, 2));
    } else {
      // Si se selecciona 4, se agregan dos objetos de llanta adicionales si no existen
      setTireData((prev) => {
        const newData = [...prev];
        while (newData.length < 4) {
          newData.push({
            id: newData.length + 1,
            lh: "",
            rh: "",
            contrapesoInterior: "",
            contrapesoExterior: "",
            photos: [],
          });
        }
        return newData;
      });
    }
  };

  // Manejador para los campos de datos de cada llanta
  const handleTireDataChange = (
    index: number,
    field: keyof Omit<TireData, "id" | "photos">,
    value: string
  ) => {
    setTireData((prev) => {
      const newData = [...prev];
      newData[index][field] = value;
      return newData;
    });
  };


  // Manejador para la carga de fotos
  const handlePhotoUpload = (
    tireIndex: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);

    const validImageFiles = files.filter(file => file.type.startsWith("image/"));
    if (validImageFiles.length === 0) return;

    const maxPhotos = 2;
    const currentPhotos = [...tireData[tireIndex].photos];
    const photosToAdd = [];

    // Recorre los nuevos archivos y crea un array con las fotos a agregar
    for (const file of validImageFiles) {
      if (currentPhotos.length + photosToAdd.length >= maxPhotos) {
        alert("Ya has subido el máximo de 2 fotos para esta llanta.");
        break; // Detiene el bucle si se alcanza el límite
      }
      photosToAdd.push(file);
    }

    // Utiliza Promise.all para manejar múltiples lecturas de archivos de forma asíncrona
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

    // Una vez que todas las promesas se resuelven, actualiza el estado una sola vez
    Promise.all(promises)
      .then((newPhotos) => {
        setTireData((prev) => {
          const newData = [...prev];
          // Combina las fotos existentes con las nuevas, respetando el límite
          const updatedPhotos = [...newData[tireIndex].photos, ...newPhotos].slice(0, maxPhotos);
          newData[tireIndex] = {
            ...newData[tireIndex],
            photos: updatedPhotos,
          };
          return newData;
        });
      })
      .catch((error) => {
        console.error("Error al leer los archivos:", error);
      });

    // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
    event.target.value = "";
  };

  // Función para eliminar una foto
  const removePhoto = (tireIndex: number, photoId: number) => {
    setTireData((prev) => {
      const newData = [...prev];
      // Filtra el array de fotos para eliminar la que coincide con el 'photoId'
      newData[tireIndex].photos = newData[tireIndex].photos.filter(
        (photo) => photo.id !== photoId
      );
      return newData;
    });
  };

  // Función para abrir el modal de previsualización de la imagen
  const openPreview = (imageUrl: string, title: string) => {
    setPreviewModal({ isOpen: true, imageUrl, title });
  };

  // Función principal para generar el documento PDF
  const generatePDF = async () => {
    // Importación dinámica del módulo 'jspdf'
    const { jsPDF } = await import("jspdf");

    // Inicializa un nuevo documento PDF con formato A4
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = 210;
    // const pageHeight = 297; // Comentado ya que no se usa directamente

    // Función auxiliar para agregar texto con salto de línea
    const addWrappedText = (
      pdfInstance: typeof jsPDF.prototype,
      text: string,
      x: number,
      y: number,
      maxWidth: number,
      lineHeight = 6
    ) => {
      // Divide el texto en líneas que encajen en el ancho especificado
      const lines = pdfInstance.splitTextToSize(text, maxWidth);
      // Itera sobre las líneas y las agrega al PDF
      lines.forEach((line: string, index: number) => { // 'index: number' es una corrección para TypeScript
        pdfInstance.text(line, x, y + index * lineHeight);
      });
      // Devuelve la nueva posición 'y' después de agregar el texto
      return y + lines.length * lineHeight;
    };

    // --- SECCIÓN DE ENCABEZADO DEL PDF ---
    pdf.setFillColor(41, 128, 185); // Establece el color de fondo a azul
    pdf.rect(0, 0, pageWidth, 25, "F"); // Dibuja el rectángulo del encabezado
    pdf.setTextColor(255, 255, 255); // Establece el color del texto a blanco
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("Certificado de Balance de Neumáticos", pageWidth / 2, 15, {
      align: "center",
    });

    // Dibuja los rectángulos para los logos (espacio reservado)
    pdf.setFillColor(255, 255, 255);
    // pdf.rect(10, 5, 15, 15, "F");
    // pdf.rect(30, 5, 15, 15, "F");
    // pdf.rect(50, 5, 15, 15, "F");
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(8);
    // Agrega el texto "LOGO" en los espacios
    pdf.addImage("/logo_hs_talleres.png", "PNG", 10, 8, 10, 10);
    pdf.addImage("/logo_1.png", "PNG", 20, 8, 10, 10);
    pdf.addImage("/logo_2.png", "PNG", 30, 8, 10, 10);
    pdf.addImage("/logo_3.png", "PNG", 40, 8, 10, 10);

    // --- SECCIÓN DE DATOS DEL VEHÍCULO ---
    let yPosition = 35; // Posición 'y' inicial para el contenido
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");

    // Datos para la columna izquierda
    const leftColumnData = [
      ["Fecha:", formData.fecha],
      ["Cliente:", formData.cliente],
      ["Placa:", formData.placa],
      ["Kilometraje:", formData.kilometraje],
      ["Equipo Usado:", formData.equipoUsado],
      ["Modelo:", formData.modeloVehiculo],
      ["Procedencia:", formData.procedencia],
    ];

    // Datos para la columna derecha
    const rightColumnData = [
      ["Marca:", formData.marca],
      ["Código:", formData.codigo],
    ];

    // Agrega la columna izquierda al PDF
    let leftY = yPosition;
    leftColumnData.forEach(([label, value]) => {
      pdf.setFont("helvetica", "bold");
      pdf.text(label, 15, leftY);
      pdf.setFont("helvetica", "normal");
      addWrappedText(pdf, value || "", 45, leftY, 60);
      leftY += 5;
    });

    // Agrega la columna derecha al PDF
    let rightY = yPosition;
    rightColumnData.forEach(([label, value]) => {
      pdf.setFont("helvetica", "bold");
      pdf.text(label, 110, rightY);
      pdf.setFont("helvetica", "normal");
      addWrappedText(pdf, value || "", 135, rightY, 60);
      rightY += 5;
    });

    // Actualiza la posición 'y' a la más baja de las dos columnas
    yPosition = Math.max(leftY, rightY) + 10;

    // Obtiene solo las llantas que se van a incluir en el PDF (2 o 4)
    const activeTires = tireData.slice(0, parseInt(formData.numeroLlantas));

    // --- SECCIÓN DE DATOS POR LLANTA ---
    activeTires.forEach((tire, index) => {
      // Agrega una nueva página si el contenido excede el espacio disponible
      if (yPosition > 200) {
        pdf.addPage();
        yPosition = 20;
      }

      // Dibuja el encabezado de cada sección de llanta
      pdf.setFillColor(52, 152, 219);
      pdf.rect(15, yPosition - 5, 180, 10, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text(`Llanta ${index + 1}`, 20, yPosition + 2);
      yPosition += 15;
      pdf.setTextColor(0, 0, 0);

      // Agrega los datos de los parámetros LH y RH
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      pdf.rect(15, yPosition, 85, 20, "S");
      pdf.text("Parámetros Iniciales LH", 20, yPosition + 5);
      pdf.setFont("helvetica", "normal");
      pdf.text(`LH${index + 1}: ${tire.lh || "N/A"}`, 20, yPosition + 12);
      pdf.rect(110, yPosition, 85, 20, "S");
      pdf.setFont("helvetica", "bold");
      pdf.text("Parámetros Iniciales RH", 115, yPosition + 5);
      pdf.setFont("helvetica", "normal");
      pdf.text(`RH${index + 1}: ${tire.rh || "N/A"}`, 115, yPosition + 12);
      yPosition += 30;

      // Agrega los datos de los contrapesos
      pdf.rect(15, yPosition, 85, 20, "S");
      pdf.setFont("helvetica", "bold");
      pdf.text("Contrapeso Requerido Interior", 20, yPosition + 5);
      pdf.setFont("helvetica", "normal");
      pdf.text(`${tire.contrapesoInterior || "0"} gr`, 20, yPosition + 12);
      pdf.rect(110, yPosition, 85, 20, "S");
      pdf.setFont("helvetica", "bold");
      pdf.text("Contrapeso Requerido Exterior", 115, yPosition + 5);
      pdf.setFont("helvetica", "normal");
      pdf.text(`${tire.contrapesoExterior || "0"} gr`, 115, yPosition + 12);
      yPosition += 30;

      // Agrega la sección de fotos si hay fotos subidas
      if (tire.photos.length > 0) {
        pdf.setFont("helvetica", "bold");
        pdf.text("Fotos:", 15, yPosition);
        yPosition += 10;

        tire.photos.forEach((photo, photoIndex) => {
          if (yPosition > 220) {
            pdf.addPage();
            yPosition = 20;
          }

          try {
            const imgWidth = 80;
            const imgHeight = 60;
            const xPos = 15 + (photoIndex % 2) * 90;

            // Intenta agregar la imagen
            pdf.addImage(photo.url, "JPEG", xPos, yPosition, imgWidth, imgHeight);
            pdf.setFontSize(8);
            pdf.text(`Foto ${photoIndex + 1}`, xPos, yPosition + imgHeight + 5);

            if (photoIndex % 2 === 1) {
              yPosition += imgHeight + 15;
            }
          } catch (error) {
            // Manejo de errores si la imagen no se puede cargar (por ejemplo, si la URL es inválida)
            console.warn("Error adding image to PDF:", error);
            pdf.setFontSize(8);
            pdf.text(
              `[Imagen no disponible: ${photo.name}]`,
              15 + (photoIndex % 2) * 90,
              yPosition + 5
            );
            if (photoIndex % 2 === 1) {
              yPosition += 15;
            }
          }
        });

        if (tire.photos.length % 2 === 1) {
          yPosition += 70;
        }
      }

      yPosition += 10;
    });

    // Agrega el pie de página de la última página si es necesario
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = 20;
    }

    // --- SECCIÓN DE PIE DE PÁGINA ---
    pdf.setFillColor(41, 128, 185);
    pdf.rect(0, 280, pageWidth, 17, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(8);
    // Agrega el texto de la certificación
    pdf.text(
      "HS Talleres SRL a través de la ejecución del balanceo, certifica que el vehículo sometido a este",
      15,
      288
    );
    pdf.text(
      "procedimiento ha quedado dentro de los parámetros técnicos establecidos, garantizando que el",
      15,
      292
    );
    pdf.text(
      "balanceo de sus neumáticos cumple con los estándares requeridos para un óptimo desempeño,",
      15,
      296
    );





    // Genera el nombre del archivo y lo descarga
    const fileName = `Certificado_Balance_${formData.placa || "Vehiculo"
      }_${new Date().getTime()}.pdf`;
    pdf.save(fileName);
  };



  // Función de validación del formulario
  const isFormValid = (): boolean => {
    const requiredFields: (keyof FormData)[] = [
      "fecha",
      "cliente",
      "placa",
      "kilometraje",
      "equipoUsado",
      "modeloVehiculo",
      "procedencia",
      "marca",
      "codigo",
    ];
    // Retorna 'true' si todos los campos requeridos no están vacíos
    return requiredFields.every((field) => formData[field].trim() !== "");
  };

  // --- RENDERIZADO DE LA INTERFAZ DE USUARIO ---
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Encabezado del formulario */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-blue-800 mb-2">
              Certificado de Balance de Neumáticos
            </h1>
            <p className="text-gray-600">Sistema de Generación de Reportes</p>
          </div>
        </div>

        {/* Sección de datos del vehículo */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">
            Datos del Vehículo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Campos de entrada para los datos del vehículo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha *
              </label>
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente *
              </label>
              <input
                type="text"
                name="cliente"
                value={formData.cliente}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nombre del cliente"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Placa *
              </label>
              <input
                type="text"
                name="placa"
                value={formData.placa}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ABC-123"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kilometraje *
              </label>
              <input
                type="text"
                name="kilometraje"
                value={formData.kilometraje}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="120,000 km"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Equipo Usado *
              </label>
              <input
                type="text"
                name="equipoUsado"
                value={formData.equipoUsado}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Balanceadora Modelo X"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modelo del Vehículo *
              </label>
              <input
                type="text"
                name="modeloVehiculo"
                value={formData.modeloVehiculo}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Toyota Hilux"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Procedencia *
              </label>
              <input
                type="text"
                name="procedencia"
                value={formData.procedencia}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Lima, Perú"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marca *
              </label>
              <input
                type="text"
                name="marca"
                value={formData.marca}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Toyota"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código *
              </label>
              <input
                type="text"
                name="codigo"
                value={formData.codigo}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="VEH-001"
                required
              />
            </div>
          </div>
        </div>

        {/* Sección para seleccionar el número de llantas */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Número de Llantas
          </h2>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => handleTireCountChange("2")}
              // Clases condicionales para el estilo del botón
              className={`px-6 py-3 rounded-md font-medium ${formData.numeroLlantas === "2"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              2 Llantas
            </button>
            <button
              type="button"
              onClick={() => handleTireCountChange("4")}
              className={`px-6 py-3 rounded-md font-medium ${formData.numeroLlantas === "4"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              4 Llantas
            </button>
          </div>
        </div>

        {/* Mapea y renderiza los campos para cada llanta seleccionada */}
        {tireData
          .slice(0, parseInt(formData.numeroLlantas))
          .map((tire, index) => (
            <div key={tire.id} className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Llanta {index + 1}
              </h3>

              {/* Campos de entrada para los parámetros de la llanta */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parámetro LH{index + 1}
                  </label>
                  <input
                    type="text"
                    value={tire.lh}
                    onChange={(e) => handleTireDataChange(index, "lh", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parámetro RH{index + 1}
                  </label>
                  <input
                    type="text"
                    value={tire.rh}
                    onChange={(e) => handleTireDataChange(index, "rh", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contrapeso Interior (gr)
                  </label>
                  <input
                    type="text"
                    value={tire.contrapesoInterior}
                    onChange={(e) =>
                      handleTireDataChange(index, "contrapesoInterior", e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contrapeso Exterior (gr)
                  </label>
                  <input
                    type="text"
                    value={tire.contrapesoExterior}
                    onChange={(e) =>
                      handleTireDataChange(index, "contrapesoExterior", e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Sección para subir y gestionar fotos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fotos (máximo 2 por llanta)
                </label>

                {/* Botón para subir fotos (se oculta si ya hay 2) */}
                {tire.photos.length < 2 && (
                  <div className="mb-4">
                    <input
                      type="file"
                      ref={(el) => {
                        fileInputRefs.current[`tire-${index}`] = el;
                      }}
                      onChange={(e) => handlePhotoUpload(index, e)}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      // Simula un clic en el input de archivo oculto
                      onClick={() =>
                        fileInputRefs.current[`tire-${index}`]?.click()
                      }
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Subir Fotos ({tire.photos.length}/2)
                    </button>
                  </div>
                )}

                {/* Muestra las miniaturas de las fotos subidas */}
                {tire.photos.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    {tire.photos.map((photo: Photo) => (
                      <div
                        key={photo.id}
                        className="relative bg-gray-100 rounded-lg p-2"
                      >
                        <img
                          src={photo.url}
                          alt={photo.name}
                          className="w-full h-32 object-cover rounded-md cursor-pointer"
                          // Abre el modal de previsualización al hacer clic
                          onClick={() =>
                            openPreview(photo.url, `Llanta ${index + 1} - ${photo.name}`)
                          }
                        />
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-600 truncate">
                            {photo.name}
                          </span>
                          <div className="flex gap-1">
                            {/* Botón para abrir el modal de previsualización */}
                            <button
                              type="button"
                              onClick={() =>
                                openPreview(photo.url, `Llanta ${index + 1} - ${photo.name}`)
                              }
                              className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {/* Botón para eliminar la foto */}
                            <button
                              type="button"
                              onClick={() => removePhoto(index, photo.id)}
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
            </div>
          ))}

        {/* Sección del botón para generar el PDF */}
        <div className="text-center">
          <button
            onClick={generatePDF}
            // El botón está deshabilitado si el formulario no es válido
            disabled={!isFormValid()}
            className={`inline-flex items-center px-8 py-4 text-lg font-medium rounded-lg ${isFormValid()
              ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
              : "bg-gray-400 text-gray-200 cursor-not-allowed"
              }`}
          >
            <Download className="w-5 h-5 mr-2" />
            Generar y Descargar Certificado PDF
          </button>

          {/* Mensaje de error si el formulario no es válido */}
          {!isFormValid() && (
            <p className="text-red-600 text-sm mt-2">
              Complete todos los campos obligatorios (*) para generar el
              certificado
            </p>
          )}
        </div>

        {/* Modal de previsualización de imágenes */}
        {previewModal.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl max-h-full overflow-auto">
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    {previewModal.title}
                  </h3>
                  {/* Botón para cerrar el modal */}
                  <button
                    onClick={() =>
                      setPreviewModal({ isOpen: false, imageUrl: "", title: "" })
                    }
                    className="text-gray-500 hover:text-gray-700 text-xl"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="p-4">
                <img
                  src={previewModal.imageUrl}
                  alt={previewModal.title}
                  className="max-w-full h-auto"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;