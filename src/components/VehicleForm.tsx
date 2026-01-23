import React, { ChangeEvent } from 'react';
import { FormData } from '@/models/interface';

interface VehicleFormProps {
    formData: FormData;
    onInputChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ formData, onInputChange }) => {
    const fields = [
        { name: 'fecha', label: 'Fecha', type: 'date', placeholder: '', required: true },
        {
            name: 'cliente', label: 'Cliente', type: 'select', placeholder: '', required: true, options: [
                { value: 'TRANSPORTES Y SERVICIOS HUACRI SAC', label: 'TRANSPORTES Y SERVICIOS HUACRI SAC' },
                { value: 'TRAIN AMISTAD SAC', label: 'TRAIN AMISTAD SAC' },
                { value: 'TURISMO CIVA SAC', label: 'TURISMO CIVA SAC' },
            ]
        },
        { name: 'placa', label: 'Placa', type: 'text', placeholder: 'ABC-123', required: true },
        { name: 'kilometraje', label: 'Kilometraje', type: 'number', placeholder: '120,000 km', required: true },
        { name: 'equipoUsado', label: 'Equipo Usado', type: 'text', placeholder: 'Beissbarth', required: true },
        { name: 'modeloEquipo', label: 'Modelo del Equipo', type: 'text', placeholder: 'Microtec 795T', required: true },
        {
            name: 'modeloVehiculo', label: 'Modelo del Vehículo', type: 'select', placeholder: '', required: true, options: [
                { value: 'HILUX 1GD', label: 'HILUX 1GD' },
                { value: 'FORTUNER 1GD', label: 'FORTUNER 1GD' },
                { value: 'RANGER', label: 'RANGER' },
                { value: 'K410CB', label: 'K410CB' },
                { value: 'O500RS 1945', label: 'O500RS 1945' },
                { value: 'O-500 RS 4579 T/M', label: 'O-500 RS 4579 T/M' },
            ]
        },
        { name: 'procedencia', label: 'Procedencia', type: 'text', placeholder: 'Alemania', required: true },
        {
            name: 'marca', label: 'Marca', type: 'select', placeholder: '', required: true, options: [
                { value: 'TOYOTA', label: 'TOYOTA' },
                { value: 'FORD', label: 'FORD' },
                { value: 'SCANIA', label: 'SCANIA' },
                { value: 'MERCEDES BENZ', label: 'MERCEDES BENZ' },
            ]
        },
        { name: 'codigo', label: 'Código', type: 'text', placeholder: 'VEH-001', required: true },
        { name: 'marcaNeumaticos', label: 'Marca de Neumáticos', type: 'text', placeholder: 'Michelin', required: true },
        { name: 'modeloNeumaticos', label: 'Modelo de Neumáticos', type: 'text', placeholder: 'Pilot Sport 4', required: true },
    ];

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
                Datos del Vehículo / Cliente
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {fields
                    .filter(field => field.name === 'cliente')
                    .map((field) => (
                        <div key={field.name}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {field.label} {field.required && '*'}
                            </label>
                            <select
                                name={field.name}
                                value={formData[field.name as keyof FormData]}
                                onChange={onInputChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required={field.required}
                            >
                                <option value="" disabled>Seleccione un cliente</option>
                                {field.options?.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {fields
                    .filter(field => ['fecha', 'placa', 'kilometraje', 'modeloVehiculo', 'marca', 'codigo', 'marcaNeumaticos', 'modeloNeumaticos'].includes(field.name))
                    .map((field) => (
                        <div key={field.name}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {field.label} {field.required && '*'}
                            </label>
                            {field.type === 'select' ? (
                                <select
                                    name={field.name}
                                    value={formData[field.name as keyof FormData]}
                                    onChange={onInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required={field.required}
                                >
                                    <option value="" disabled>Seleccione {field.label.toLowerCase()}</option>
                                    {field.options?.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type={field.type}
                                    name={field.name}
                                    value={formData[field.name as keyof FormData]}
                                    onChange={onInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder={field.placeholder}
                                    required={field.required}
                                />
                            )}
                        </div>
                    ))}
            </div>
            <h2 className="text-xl font-semibold mb-6 mt-8 text-gray-800">
                Datos del Equipo Usado
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {fields
                    .filter(field => ['equipoUsado', 'modeloEquipo', 'procedencia'].includes(field.name))
                    .map((field) => (
                        <div key={field.name}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {field.label} {field.required && '*'}
                            </label>
                            <input
                                type={field.type}
                                name={field.name}
                                defaultValue={field.placeholder}
                                readOnly
                                className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                                required={field.required}
                            />
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default VehicleForm;