import React from 'react';

const Header: React.FC = () => {
    return (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-blue-800 mb-2">
                    Certificado de Balanceo de Beumáticos
                </h1>
                <p className="text-gray-600">Sistema de Generación de Reportes</p>
            </div>
        </div>
    );
};

export default Header;