// components/GenerateButton.tsx
import React from 'react';
import { Download } from 'lucide-react';

interface GenerateButtonProps {
    isValid: boolean;
    onGenerate: () => void;
}

const GenerateButton: React.FC<GenerateButtonProps> = ({ isValid, onGenerate }) => {
    return (
        <div className="text-center">
            <button
                onClick={onGenerate}
                disabled={!isValid}
                className={`inline-flex items-center px-8 py-4 text-lg font-medium rounded-lg ${isValid
                        ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
                        : "bg-gray-400 text-gray-200 cursor-not-allowed"
                    }`}
            >
                <Download className="w-5 h-5 mr-2" />
                Generar y Descargar Certificado PDF
            </button>

            {!isValid && (
                <p className="text-red-600 text-sm mt-2">
                    Complete todos los campos obligatorios (*) para generar el certificado
                </p>
            )}
        </div>
    );
};

export default GenerateButton;