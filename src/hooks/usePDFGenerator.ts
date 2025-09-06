// hooks/usePDFGenerator.ts
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
            htmlContent.style.fontSize = "12px";

            const activeTires = tireData.slice(
                0,
                parseInt(formData.numeroLlantas)
            );

            const renderTires1 = (activeTires: TireData[]) => {
                const filas: Array<"LH1" | "RH1">[] = [["LH1", "RH1"]];

                return filas
                    .map(
                        (grupo) => `
                            <div style="padding: 0px 38px; display: flex; gap: 60px; margin: 20px 0;">
                              ${grupo
                                  .map((pos) => {
                                      const tire = activeTires.find(
                                          (t) => t.position === pos
                                      );
                                      if (!tire) {
                                          return `<div style="flex: 1; border: 1px solid #ccc; padding: 5px; text-align: center; color: #999;">
                                                       ${pos} no disponible
                                                   </div>`;
                                      }

                                      return `
                                      <div style="flex: 1; border: 2px solid #000; padding: 1px; border-radius: 5px;">
                                        <div style="font-weight: bold; margin-bottom: 10px; text-align: center;">
                                          Parámetros Iniciales ${tire.position}
                                        </div>

                                        <div style="border-top: 1px solid #000; padding:0px 10px 10px 10px;">
                                          Contra Peso requerido interior: 
                                          <span style="font-weight: bold;">
                                            ${tire.contrapesoInterior}
                                          </span>
                                          <span style="color: red; font-weight: bold;">Gr .</span>
                                        </div>
      
                                        <div style="border-top: 1px solid #000; border-bottom: 1px solid #000; padding:0px 10px 10px 10px;">
                                          Contra Peso requerido exterior: 
                                          <span style="font-weight: bold;">
                                            ${tire.contrapesoExterior}
                                          </span>
                                          <span style="color: red; font-weight: bold;">Gr .</span>
                                        </div>
      
                                        ${
                                            tire.photos?.length > 0
                                                ? tire.photos
                                                      .map(
                                                          (photo, idx) => `
                                                        <div style="margin-bottom: 10px; width: 100%; aspect-ratio: 1 / 1; border: 1px solid #ddd; overflow: hidden;">
                                                        <img src="${photo.url}" 
                                                            style="width: 100%; height: 100%; object-fit: cover;" 
                                                            onerror="this.style.display='none'; this.nextElementSibling.textContent='[Imagen no disponible: ${photo.name}]'">
                                                        <span></span>
                                                        </div>
                                                  `
                                                      )
                                                      .join("")
                                                : "<div>Sin fotos disponibles</div>"
                                        }
                                      </div>
                                    `;
                                  })
                                  .join("")}
                            </div>
                        `
                    )
                    .join("");
            };

            const renderTires2 = (activeTires: TireData[]) => {
                const filas: Array<"LH2" | "RH2">[] = [["LH2", "RH2"]];

                return filas
                    .map(
                        (grupo) => `
                            <div style="padding: 0px 38px; display: flex; gap: 60px; margin: 20px 0;">
                              ${grupo
                                  .map((pos) => {
                                      const tire = activeTires.find(
                                          (t) => t.position === pos
                                      );
                                      if (!tire) {
                                          return `<div style="flex: 1; border: 1px solid #ccc; padding: 5px; text-align: center; color: #999;">
                                                     ${pos} no disponible
                                                   </div>`;
                                      }

                                      return `
                                            <div style="flex: 1; border: 2px solid #000; padding: 1px; border-radius: 5px;">
                                              <div style="font-weight: bold; margin-bottom: 10px; text-align: center;">
                                                Parámetros Iniciales ${
                                                    tire.position
                                                }
                                              </div>

                                              <div style="border-top: 1px solid #000; padding:0px 10px 10px 10px;">
                                                Contra Peso requerido interior: 
                                                <span style="font-weight: bold;">
                                                  ${tire.contrapesoInterior}
                                                </span>
                                                <span style="color: red; font-weight: bold;">Gr .</span>
                                              </div>
     
                                              <div style="border-top: 1px solid #000; border-bottom: 1px solid #000; padding:0px 10px 10px 10px;">
                                                Contra Peso requerido exterior: 
                                                <span style="font-weight: bold;">
                                                  ${tire.contrapesoExterior}
                                                </span>
                                                <span style="color: red; font-weight: bold;">Gr .</span>
                                              </div>
     
                                              ${
                                                  tire.photos?.length > 0
                                                      ? tire.photos
                                                            .map(
                                                                (photo) => `
                                                              <div style="margin-bottom: 10px; width: 100%; aspect-ratio: 1 / 1; border: 1px solid #ddd; overflow: hidden;">
                                                              <img src="${photo.url}" 
                                                                  style="width: 100%; height: 100%; object-fit: cover;" 
                                                                  onerror="this.style.display='none'; this.nextElementSibling.textContent='[Imagen no disponible: ${photo.name}]'">
                                                              <span></span>
                                                              </div>
                                                          `
                                                            )
                                                            .join("")
                                                      : "<div>Sin fotos disponibles</div>"
                                              }
                                            </div>
                                          `;
                                  })
                                  .join("")}
                            </div>
                        `
                    )
                    .join("");
            };

            // Construir el HTML completo
            htmlContent.innerHTML = `
                <!-- Encabezado -->
                <div style="padding: 19px; display: flex; align-items: center; justify-content: center; gap: 10px; position: relative;">
                    <div>
                        <img src="/logos.jpg" style="width: 270px; height: 150px;" onerror="this.style.display='none'">
                    </div>
                    <div style="
                    font-size: 30px; 
                    font-weight: bold; 
                    border-radius: 5px; 
                    border: 2px solid black;
                    margin: 10px;
                    ">
                        <h1 style="margin: 10px 20px 35px 35px;">
                            Certificado de Balance de Neumáticos
                        </h1>
                    </div>
                </div>

                <!-- Datos del vehículo -->
                <div style ="padding: 0px 38px;">
                    <div><strong>Cliente:</strong>${
                        formData.cliente || ""
                    }</div>
                    <div style="display: flex; gap: 40px;">
                        <div style="flex: 1; display: flex; flex-direction: column;">
                            <div><strong>Placa:</strong> ${
                                formData.placa || ""
                            }</div>
                            <div><strong>Kilometraje:</strong> ${
                                formData.kilometraje || ""
                            }</div>
                        </div>
                        <div style="flex: 1; display: flex; flex-direction: column;">
                            <div><strong>Marca:</strong> ${
                                formData.marca || ""
                            }</div>
                            <div><strong>Código:</strong> ${
                                formData.codigo || ""
                            }</div>
                        </div>
                        <div style="flex: 1; display: flex; flex-direction: column;">
                            <div><strong>Fecha:</strong> ${
                                formData.fecha || ""
                            }</div>
                            <div><strong>Modelo:</strong> ${
                                formData.modeloVehiculo || ""
                            }</div>
                        </div>
                    </div>
                    <div style="margin-top: 10px; margin-bottom: 20px;">
                        <div><strong>Equipo Usado:</strong> ${
                            formData.equipoUsado || ""
                        }</div>
                        <div><strong>Modelo:</strong> ${
                            formData.modeloVehiculo || ""
                        }</div>
                        <div><strong>Procedencia:</strong> ${
                            formData.procedencia || ""
                        }</div>
                    </div>
                </div>

                <!-- Datos de llantas -->
                ${renderTires1(activeTires)}
                <!-- Pie de página -->
                <div style="padding: 10px; margin:10px 38px 0 38px; color: black; font-size: 12px; border: 2px solid #000; text-align: center; border-radius: 5px;">
                    <div>HS Talleres SRL a través de la ejecución del balanceo, certifica que el vehículo sometido a este procedimiento ha quedado dentro de los parámetros técnicos establecidos, garantizando que el balanceo de sus neumáticos cumple con los estándares requeridos para un óptimo desempeño.</div>
                </div>
               
                ${
                    parseInt(formData.numeroLlantas) === 4
                        ?   `
                            <hr style="margin: 60px 0; border: none; height: 0;" />
                            ${renderTires2(activeTires)}
                            <!-- Pie de página -->
                            <div style="padding: 10px; margin:100px 38px 0 38px; color: black; font-size: 12px; border: 2px solid #000; text-align: center; border-radius: 5px;">
                                <div>HS Talleres SRL a través de la ejecución del balanceo, certifica que el vehículo sometido a este procedimiento ha quedado dentro de los parámetros técnicos establecidos, garantizando que el balanceo de sus neumáticos cumple con los estándares requeridos para un óptimo desempeño.</div>
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
                    scale: 2, // Mayor resolución
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
                const fileName = `Certificado_Balance_${
                    formData.placa || "Vehiculo"
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
