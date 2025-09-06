import React from 'react';

interface TireSelectorProps {
    selectedCount: string;
    onCountChange: (count: "2" | "4") => void;
}

const TireSelector: React.FC<TireSelectorProps> = ({ selectedCount, onCountChange }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Número de Llantas
            </h2>
            <div className="flex gap-4">
                <button
                    type="button"
                    onClick={() => onCountChange("2")}
                    className={`px-6 py-3 rounded-md font-medium ${selectedCount === "2"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                >
                    2 Llantas
                </button>
                <button
                    type="button"
                    onClick={() => onCountChange("4")}
                    className={`px-6 py-3 rounded-md font-medium ${selectedCount === "4"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                >
                    4 Llantas
                </button>
            </div>
        </div>
    );
};

export default TireSelector;