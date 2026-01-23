import React, { ChangeEvent } from 'react';
import { FormData } from '@/models/interface';

interface VehicleFormProps {
    formData: FormData;
    onInputChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ formData, onInputChange }) => {
    // Opciones para los datalist (permite escribir valores nuevos)
    const modeloVehiculoOptions = [
        'HILUX 1GD',
        'FORTUNER 1GD',
        'RANGER',
        'K410CB',
        'O500RS 1945',
        'O-500 RS 4579 T/M',
    ];

    const marcaOptions = [
        'TOYOTA',
        'FORD',
        'SCANIA',
        'MERCEDES BENZ',
    ];

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
        { name: 'modeloVehiculo', label: 'Modelo del Vehículo', type: 'datalist', placeholder: 'Seleccione o escriba un modelo', required: true, datalistId: 'modeloVehiculo-list' },
        { name: 'procedencia', label: 'Procedencia', type: 'text', placeholder: 'Alemania', required: true },
        { name: 'marca', label: 'Marca del Vehículo', type: 'datalist', placeholder: 'Seleccione o escriba una marca', required: true, datalistId: 'marca-list' },
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
                            ) : field.type === 'datalist' ? (
                                <>
                                    <input
                                        type="text"
                                        name={field.name}
                                        list={field.datalistId}
                                        value={formData[field.name as keyof FormData]}
                                        onChange={onInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder={field.placeholder}
                                        required={field.required}
                                    />
                                    <datalist id={field.datalistId}>
                                        {field.name === 'modeloVehiculo' && modeloVehiculoOptions.map(opt => (
                                            <option key={opt} value={opt} />
                                        ))}
                                        {field.name === 'marca' && marcaOptions.map(opt => (
                                            <option key={opt} value={opt} />
                                        ))}
                                    </datalist>
                                </>
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