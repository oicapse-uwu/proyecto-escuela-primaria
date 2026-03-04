import type { LucideIcon } from 'lucide-react';
import {
    BarChart3,
    Building2,
    CreditCard,
    FileText,
    LayoutDashboard,
    Package,
    Settings,
    Shield,
    TrendingUp,
    Users,
    X
} from 'lucide-react';
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SuperAdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

interface MenuItem {
    name: string;
    icon: LucideIcon;
    path?: string;
    subItems?: { name: string; path: string; icon?: LucideIcon }[];
}

const SuperAdminSidebar: React.FC<SuperAdminSidebarProps> = ({ isOpen, onClose }) => {
    const location = useLocation();
    const [expandedModules, setExpandedModules] = useState<string[]>(['dashboard']);

    const isActive = (path?: string) => {
        if (!path) return false;
        return location.pathname === path;
    };

    const isModuleActive = (module: MenuItem) => {
        if (module.path) return isActive(module.path);
        if (module.subItems) {
            return module.subItems.some(sub => location.pathname === sub.path);
        }
        return false;
    };

    const menuModules: MenuItem[] = [
        { 
            name: 'Dashboard', 
            icon: LayoutDashboard, 
            path: '/admin/dashboard' 
        },
        {
            name: 'Instituciones',
            icon: Building2,
            path: '/admin/instituciones'
        },
        {
            name: 'Suscripciones',
            icon: CreditCard,
            subItems: [
                { name: 'Planes Disponibles', path: '/admin/suscripciones/planes', icon: Package },
                { name: 'Suscripciones Activas', path: '/admin/suscripciones/activas', icon: CreditCard },
                { name: 'Facturación', path: '/admin/suscripciones/facturacion', icon: FileText },
                { name: 'Pagos Pendientes', path: '/admin/suscripciones/pendientes', icon: TrendingUp },
            ]
        },
        {
            name: 'Usuarios del Sistema',
            icon: Shield,
            subItems: [
                { name: 'Super Admins', path: '/admin/usuarios/super-admins', icon: Shield },
                { name: 'Administradores', path: '/admin/usuarios/administradores', icon: Users },
            ]
        },
        {
            name: 'Roles y Permisos',
            icon: Settings,
            path: '/admin/roles'
        },
        {
            name: 'Reportes',
            icon: BarChart3,
            subItems: [
                { name: 'Estadísticas Generales', path: '/admin/reportes/estadisticas', icon: TrendingUp },
                { name: 'Uso del Sistema', path: '/admin/reportes/uso', icon: BarChart3 },
                { name: 'Ingresos', path: '/admin/reportes/ingresos', icon: CreditCard },
            ]
        },
    ];

    const toggleModule = (moduleName: string) => {
        setExpandedModules(prev => 
            prev.includes(moduleName) 
                ? prev.filter(m => m !== moduleName)
                : [...prev, moduleName]
        );
    };

    return (
        <aside 
            className={`bg-primary-dark text-text-light fixed left-0 top-0 bottom-0 z-50 shadow-xl sidebar-scroll-admin transition-transform duration-300 w-72 ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
            style={{
                overflowY: 'auto',
                overflowX: 'hidden',
                scrollbarGutter: 'stable'
            }}
        >
            {/* Logo y Título de Escuelita */}
            <div className="p-6 border-b border-primary/30 bg-gradient-to-br from-primary-dark via-primary to-primary-dark relative">
                {/* Botón cerrar */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
                
                <div className="flex flex-col items-center">
                    {/* Logo de Escuelita */}
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-3 border-2 border-primary/30 shadow-lg p-3 transition-transform hover:scale-110 cursor-pointer">
                        <img 
                            src="https://image2url.com/r2/default/images/1772176934862-8ab137ce-b45a-428c-b264-249957fee43e.png" 
                            alt="Escuelita Logo" 
                            className="w-full h-full object-contain"
                            title="Escuelita - Sistema de Gestión Escolar"
                        />
                    </div>
                    {/* Nombre del SaaS */}
                    <h2 className="text-lg font-bold text-center text-white">Escuelita</h2>
                    <p className="text-xs text-white/70 text-center mt-1">Panel de Administración</p>
                </div>
            </div>

            <nav className="p-3 space-y-1 w-full pr-2">
                {menuModules.map((module) => {
                    const IconComponent = module.icon;
                    return (
                        <div key={module.name} className="w-full">
                            {module.subItems ? (
                                <>
                                    <button
                                        onClick={() => toggleModule(module.name)}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group relative ${
                                            isModuleActive(module) 
                                                ? 'border-l-4 border-white' 
                                                : expandedModules.includes(module.name) 
                                                    ? 'bg-primary/40 shadow-sm hover:bg-primary/50' 
                                                    : 'hover:bg-primary/50'
                                        }`}
                                    >
                                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                                            <IconComponent className="w-5 h-5 flex-shrink-0 transition-colors text-white/90" />
                                            <span className="text-sm font-semibold truncate transition-colors text-white">{module.name}</span>
                                        </div>
                                        <div>
                                            <svg 
                                                className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ${
                                                    expandedModules.includes(module.name) ? 'rotate-180' : ''
                                                }`}
                                                fill="none" 
                                                stroke="currentColor" 
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </button>
                                    {expandedModules.includes(module.name) && (
                                        <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-primary/40 w-full">
                                            {module.subItems.map((subItem) => {
                                                const SubIconComponent = subItem.icon;
                                                const subItemActive = isActive(subItem.path);
                                                return (
                                                    <Link
                                                        key={subItem.path}
                                                        to={subItem.path}
                                                        className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-150 text-sm ml-2 w-full group relative ${
                                                            subItemActive 
                                                                ? 'border-l-4 border-white' 
                                                                : 'hover:bg-primary/40'
                                                        }`}
                                                    >
                                                        {SubIconComponent && (
                                                            <SubIconComponent className="w-4 h-4 flex-shrink-0 transition-colors text-white/70 group-hover:text-white/90" />
                                                        )}
                                                        <span className="font-medium truncate transition-colors text-white/80 group-hover:text-white">{subItem.name}</span>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Link
                                    to={module.path || '#'}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group w-full relative ${
                                        isActive(module.path) 
                                            ? 'border-l-4 border-white' 
                                            : 'hover:bg-primary/50'
                                    }`}
                                >
                                    <IconComponent className="w-5 h-5 flex-shrink-0 transition-colors text-white/90" />
                                    <span className="text-sm font-semibold truncate transition-colors text-white">{module.name}</span>
                                </Link>
                            )}
                        </div>
                    );
                })}
            </nav>
        </aside>
    );
};

export default SuperAdminSidebar;
