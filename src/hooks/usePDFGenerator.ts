import { useCallback } from "react";
import { FormData, TireData } from "@/models/interface";

type jsPDF = typeof import("jspdf").jsPDF;

export const usePDFGenerator = () => {
    const generatePDF = useCallback(
        async (formData: FormData, tireData: TireData[]) => {
            const { jsPDF } = await import("jspdf");
            const html2canvas = (await import("html2canvas")).default;

            const pdf = new jsPDF("p", "mm", "a4");
            const pageWidth = 210;
            const pageHeight = 297;

            // Crear elemento HTML temporal para el contenido del PDF
            const htmlContent = document.createElement("div");
            htmlContent.style.width = "794px"; // Ancho A4 en píxeles (210mm * 3.78)
            htmlContent.style.backgroundColor = "white";
            htmlContent.style.fontFamily = "Arial, sans-serif";
            htmlContent.style.padding = "0 50px"; // Espacio para el pie de página
            htmlContent.style.margin = "0";
            htmlContent.style.position = "absolute";
            htmlContent.style.left = "-9999px";
            htmlContent.style.top = "0";
            htmlContent.style.fontSize = "14px";

            const activeTires = tireData.slice(
                0,
                parseInt(formData.numeroLlantas)
            );
            console.log("formData", formData);

            // Función de ayuda para validar y renderizar una celda de llanta
            const renderTireCell = (
                position: "LH1" | "RH1" | "LH2" | "RH2"
            ) => {
                const tire = activeTires.find((t) => t.position === position);

                // Validación: la celda se muestra si existe el objeto de llanta
                // Y SI:
                // 1. El contrapeso interior no es 0, O
                // 2. El contrapeso interior es 0 Y hay fotos.
                const isValid =
                    tire &&
                    tire.contrapesoInterior >= 0 &&
                    tire.photos &&
                    tire.photos.length > 0;

                if (isValid) {
                    return `
                        <div style="flex: 1; border: 2px solid #000; padding: 1px; border-radius: 5px;">
                            <div style="font-weight: bold; margin-bottom: 10px; text-align: center;">
                                Parámetros Iniciales ${tire.position}
                            </div>

                            <div style="border-top: 1px solid #000; padding:0px 10px 10px 10px; font-weight: bold; font-size: 12px;">
                                Contra Peso requerido interior: ${tire.contrapesoInterior
                        }
                                <span style="color: red; font-weight: bold;">Gr .</span>
                            </div>
                    
                            <div style="border-top: 1px solid #000; padding:0px 10px 10px 10px; font-weight: bold; font-size: 12px;">
                                Contra Peso requerido exterior: ${tire.contrapesoExterior}
                                <span style="color: red; font-weight: bold;">Gr .</span>
                            </div>

                            <div style="border-top: 1px solid #000; border-bottom: 1px solid #000; padding:0px 10px 10px 10px; font-weight: bold; font-size: 12px;">
                                Número de Serie: ${tire.numeroSerie || ""}
                            </div>

                            ${tire.photos?.length > 0
                            ? `
                                    <div style="width: 100%; aspect-ratio: 4 / 3; border-top: 2px solid #000; overflow: hidden; display: flex; justify-content: center; align-items: center;">
                                        <img src="${tire.photos[0].url}" 
                                            style="max-width: 100%; max-height: 100%; object-fit: contain;" 
                                            onerror="this.style.display='none'; this.nextElementSibling.textContent='[Imagen no disponible: ${tire.photos[0].name
                            }]'">
                                    </div>
                                    ${tire.photos?.length > 1
                                ? `
                                        <div style="width: 100%; aspect-ratio: 4 / 3; border-top: 2px solid #000; overflow: hidden; display: flex; justify-content: center; align-items: center;">
                                            <img src="${tire.photos[1].url}" 
                                                style="max-width: 100%; max-height: 100%; object-fit: contain;" 
                                                onerror="this.style.display='none'; this.nextElementSibling.textContent='[Imagen no disponible: ${tire.photos[1].name}]'">
                                        </div>
                                        `
                                : `
                                        <div style="width: 100%; aspect-ratio: 4 / 3; border-top: 2px solid #000; overflow: hidden;">
                                        </div>
                                        `
                            }
                                    `
                            : "<div>Sin fotos disponibles</div>"
                        }
                        </div>
                    `;
                } else {
                    // Si no es válido, se retorna una celda vacía para mantener la estructura
                    return `
                        <div style="flex: 1; border: 2px solid #000; padding: 1px; border-radius: 5px; visibility: hidden;">
                            <div style="font-weight: bold; margin-bottom: 10px; text-align: center;">
                                Parámetros Iniciales ${position}
                            </div>
                            <div style="border-top: 1px solid #000; padding:0px 10px 10px 10px; font-size: 12px;">
                                Contra Peso requerido interior: 
                                <span style="font-weight: bold;">
                                </span>
                                <span style="color: red; font-weight: bold;">Gr .</span>
                            </div>
                            <div style="border-top: 1px solid #000; padding:0px 10px 10px 10px; font-size: 12px;">
                                Contra Peso requerido exterior:
                                <span style="font-weight: bold;">
                                </span>
                                <span style="color: red; font-weight: bold;">Gr .</span>
                            </div>
                            <div style="border-top: 1px solid #000; border-bottom: 1px solid #000; padding:0px 10px 10px 10px; font-size: 12px;">
                                Número de Serie:
                            </div>
                            <div>Sin fotos disponibles</div>
                        </div>
                    `;
                }
            };

            // Construir el HTML completo
            htmlContent.innerHTML = `
                <!-- Encabezado -->
                <div style="margin-top: 40px; padding: 19px; display: flex; align-items: center; justify-content: center; gap: 10px; position: relative;">
                    <div>
                        <img src="/logos.jpg" style="width: 250px; height: 100px;" onerror="this.style.display='none'">
                    </div>
                    <div style="
                    font-size: 25px; 
                    font-weight: bold; 
                    border-radius: 5px; 
                    border: 2px solid black;
                    margin: 10px;
                    ">
                        <h1 style="margin: 5px 10px 30px 15px;">
                            Certificado de Balanceo de Neumáticos
                        </h1>
                    </div>
                </div>

                <!-- Datos del vehículo -->
                <div style ="padding: 0px 30px;">
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr);">
                        <!-- Cliente ocupa 2 columnas -->
                        <div style="grid-column: span 2;">
                            <strong>Cliente:</strong> ${formData.cliente || ""}
                        </div>
                        <div>
                            <strong>Fecha:</strong> 
                            ${formData.fecha
                    ? new Date(formData.fecha + "T00:00:00").toLocaleDateString("es-PE")
                    : ""
                }
                              
                        </div>
                        <div>
                            <strong>Placa:</strong> ${formData.placa || ""}
                        </div>
                        <div>
                            <strong>Marca:</strong> ${formData.marca || ""}
                        </div>
                        <div>
                            <strong>Modelo:</strong> ${formData.modeloVehiculo || ""
                }
                        </div>
                        <div>
                            <strong>Kilometraje:</strong> 
                            ${formData.kilometraje
                    ? Number(
                        formData.kilometraje
                    ).toLocaleString("en-US")
                    : ""
                }
                        </div>
                        <div>
                            <strong>Código:</strong> ${formData.codigo || ""}
                        </div>
                    </div>
                    <div style="margin-top: 10px; margin-bottom: 20px; display: flex; gap: 40px;">
                        <div>
                            <div><strong>Equipo Usado:</strong> ${formData.equipoUsado || ""}</div>
                            <div><strong>Modelo:</strong> ${formData.modeloEquipo || ""}</div>
                            <div><strong>Procedencia:</strong> ${formData.procedencia || ""}</div>
                        </div>
                        <div>
                            <div><strong>Marca Neumáticos:</strong> ${formData.marcaNeumaticos || ""}</div>
                            <div><strong>Modelo Neumáticos:</strong> ${formData.modeloNeumaticos || ""}</div>
                        </div>
                    </div>
                </div>

                <!-- Datos de llantas -->
                <div style="padding: 0px 30px; display: flex; gap: 80px; margin: 20px 0px;">
                    ${renderTireCell("LH1")}
                    ${renderTireCell("RH1")}
                </div>
               <div style="padding: 10px 10px 20px 10px; margin: 10px 30px 50px 30px; color: black; font-size: 16px; border: 2px solid #000; text-align: center; border-radius: 5px;">
                    HS Talleres SRL, a través de la ejecución del balanceo, certifica que el vehículo sometido a este procedimiento ha quedado dentro de los parámetros establecidos, garantizando que el balanceo de sus neumáticos cumple con los estándares requeridos para un óptimo desempeño, confort y seguridad en la conducción.
                </div>
                ${parseInt(formData.numeroLlantas) === 4
                    ? `
                <!-- Separador de página -->
                <div style="page-break-before: always; height: 120px;"></div>
                <div style="padding: 0px 30px; display: flex; gap: 80px; margin: 20px 0;">
                    ${renderTireCell("LH2")}
                    ${renderTireCell("RH2")}
                </div>
                <!-- Pie de página -->
                <div style="padding: 10px 10px 20px 10px; margin: 50px 30px 50px 30px; color: black; font-size: 16px; border: 2px solid #000; text-align: center; border-radius: 5px;">
                    HS Talleres SRL, a través de la ejecución del balanceo, certifica que el vehículo sometido a este procedimiento ha quedado dentro de los parámetros establecidos, garantizando que el balanceo de sus neumáticos cumple con los estándares requeridos para un óptimo desempeño, confort y seguridad en la conducción.
                </div>
                `
                    : ""
                }
                
                
            `;

            // Agregar al DOM temporalmente
            document.body.appendChild(htmlContent);

            try {
                // Generar canvas del contenido HTML
                const canvas = await html2canvas(htmlContent, {
                    scale: 3, // Aumentamos la escala para una mejor calidad de imagen
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: "#ffffff",
                    width: 794,
                    height: htmlContent.scrollHeight,
                });

                // Calcular dimensiones para el PDF
                const imgWidth = pageWidth;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                // Si la imagen es más alta que una página, dividirla
                if (imgHeight > pageHeight) {
                    const totalPages = Math.ceil(imgHeight / pageHeight);

                    for (let page = 0; page < totalPages; page++) {
                        if (page > 0) {
                            pdf.addPage();
                        }

                        const yOffset = page * pageHeight;
                        const remainingHeight = Math.min(
                            pageHeight,
                            imgHeight - yOffset
                        );

                        // Crear canvas para esta página específica
                        const pageCanvas = document.createElement("canvas");
                        const pageCtx = pageCanvas.getContext("2d");

                        pageCanvas.width = canvas.width;
                        pageCanvas.height =
                            (remainingHeight * canvas.width) / imgWidth;

                        pageCtx?.drawImage(
                            canvas,
                            0,
                            (yOffset * canvas.width) / imgWidth,
                            canvas.width,
                            pageCanvas.height,
                            0,
                            0,
                            canvas.width,
                            pageCanvas.height
                        );

                        const pageImgData = pageCanvas.toDataURL(
                            "image/jpeg",
                            0.95
                        );
                        pdf.addImage(
                            pageImgData,
                            "JPEG",
                            0,
                            0,
                            imgWidth,
                            remainingHeight
                        );
                    }
                } else {
                    // La imagen cabe en una sola página
                    const imgData = canvas.toDataURL("image/jpeg", 0.95);
                    pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
                }

                // Generar archivo
                const fileName = `Certificado_Balance_${formData.placa || "Vehiculo"
                    }_${new Date().getTime()}.pdf`;
                pdf.save(fileName);
            } catch (error) {
                console.error("Error generando PDF:", error);
                throw error;
            } finally {
                // Limpiar elemento temporal
                document.body.removeChild(htmlContent);
            }
        },
        []
    );

    return { generatePDF };
};
