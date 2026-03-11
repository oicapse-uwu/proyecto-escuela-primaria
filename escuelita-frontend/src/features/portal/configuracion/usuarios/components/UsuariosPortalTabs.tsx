import React from 'react';
import { NavLink } from 'react-router-dom';

const tabs = [
    { to: '/escuela/configuracion/usuarios', label: 'Usuarios' }
    // Roles no se muestra aquí porque los roles globales se crean solo en el SuperAdmin (backoffice/roles)
    // El IE Admin solo selecciona roles existentes al crear usuarios
    // Permisos granulares no se implementan (RBAC es módulo-level, no permiso-level)
];

const UsuariosPortalTabs: React.FC = () => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-2 flex gap-2 overflow-x-auto shadow-sm">
            {tabs.map((tab) => (
                <NavLink
                    key={tab.to}
                    to={tab.to}
                    end={tab.to === '/escuela/configuracion/usuarios'}
                    className={({ isActive }) =>
                        `px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                            isActive
                                ? 'bg-gradient-to-r from-escuela to-escuela-light text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`
                    }
                >
                    {tab.label}
                </NavLink>
            ))}
        </div>
    );
};

export default UsuariosPortalTabs;
