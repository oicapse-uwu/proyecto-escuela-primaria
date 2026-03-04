import React from 'react';
import { NavLink } from 'react-router-dom';

const tabs = [
    { to: '/escuela/configuracion/usuarios', label: 'Usuarios' },
    { to: '/escuela/configuracion/usuarios/roles', label: 'Roles' },
    { to: '/escuela/configuracion/usuarios/permisos', label: 'Permisos' }
];

const UsuariosPortalTabs: React.FC = () => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-2 flex gap-2 overflow-x-auto">
            {tabs.map((tab) => (
                <NavLink
                    key={tab.to}
                    to={tab.to}
                    end={tab.to === '/escuela/configuracion/usuarios'}
                    className={({ isActive }) =>
                        `px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                            isActive
                                ? 'bg-primary text-white'
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
