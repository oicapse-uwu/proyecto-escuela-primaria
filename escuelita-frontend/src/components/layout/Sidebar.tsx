import type { LucideIcon } from 'lucide-react';
import {
    BookOpen,
    Building,
    Building2,
    Calendar,
    CheckCircle,
    ClipboardCheck,
    ClipboardList,
    Clock,
    CreditCard,
    DollarSign,
    FileCheck,
    FileText,
    GraduationCap,
    Grid3x3,
    Layers,
    LayoutDashboard,
    Receipt,
    Settings,
    TrendingUp,
    User,
    UserCheck,
    UserCog,
    Users,
    Wallet,
    X
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { obtenerSedePorId } from '../../features/portal/infraestructura/api/infraestructuraApi';
import type { Sede } from '../../features/portal/infraestructura/types';
import { useModulosPermisos } from '../../hooks/useModulosPermisos';
import { escuelaAuthService } from '../../services/escuelaAuth.service';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://primaria.spring.informaticapp.com:4040';

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

interface MenuItem {
    name: string;
    icon: LucideIcon;
    path?: string;
    subItems?: { name: string; path: string; icon?: LucideIcon }[];
}

// Mapeo de módulos del backend a items del menú
const menuModulesConfig: Record<string, { icon: LucideIcon; subItems?: Record<string, { path: string; icon?: LucideIcon }> }> = {
    'DASHBOARD': { icon: LayoutDashboard },
    'CONFIGURACIÓN': { 
        icon: Settings,
        subItems: {
            'Usuarios y Roles': { path: '/escuela/configuracion/usuarios', icon: UserCog },
        }
    },
    'INFRAESTRUCTURA': {
        icon: Building2,
        subItems: {
            'Institución': { path: '/escuela/infraestructura/institucion', icon: Building },
            'Año y Periodos': { path: '/escuela/infraestructura/anio-periodos', icon: Calendar },
            'Grados, Secciones y Aulas': { path: '/escuela/infraestructura/grados-secciones', icon: Layers },
        }
    },
    'GESTIÓN ACADÉMICA': {
        icon: GraduationCap,
        subItems: {
            'Áreas y Cursos': { path: '/escuela/academica/areas-cursos', icon: BookOpen },
            'Malla Curricular': { path: '/escuela/academica/malla-curricular', icon: Grid3x3 },
            'Docentes': { path: '/escuela/academica/docentes', icon: User },
            'Asignación Docente': { path: '/escuela/academica/asignacion-docente', icon: ClipboardList },
            'Horarios': { path: '/escuela/academica/horarios', icon: Clock },
        }
    },
    'ALUMNOS': {
        icon: Users,
        subItems: {
            'Lista de Alumnos': { path: '/escuela/alumnos', icon: Users },
            'Apoderados': { path: '/escuela/apoderados', icon: UserCheck },
        }
    },
    'MATRÍCULAS': {
        icon: ClipboardCheck,
        subItems: {
            'Gestionar Matrículas': { path: '/escuela/matriculas', icon: ClipboardList },
            'Requisitos de Documentos': { path: '/escuela/matriculas/requisitos', icon: FileCheck },
        }
    },
    'EVALUACIONES Y NOTAS': {
        icon: FileText,
        subItems: {
            'Calificaciones': { path: '/escuela/evaluaciones/calificaciones', icon: ClipboardCheck },
            'Asistencias': { path: '/escuela/evaluaciones/asistencias', icon: CheckCircle },
            'Reporte Asistencias': { path: '/escuela/evaluaciones/asistencias-reporte', icon: ClipboardList },
            'Evaluaciones': { path: '/escuela/evaluaciones/evaluaciones', icon: FileText },
            'Promedios': { path: '/escuela/evaluaciones/promedios', icon: TrendingUp },
        }
    },
    'PAGOS Y PENSIONES': {
        icon: Wallet,
        subItems: {
            'Conceptos de Pago': { path: '/escuela/tesoreria/conceptos-pago', icon: DollarSign },
            'Métodos de Pago': { path: '/escuela/tesoreria/metodos-pago', icon: CreditCard },
            'Deudas de Alumnos': { path: '/escuela/tesoreria/deudas-alumnos', icon: Users },
            'Registrar Pago': { path: '/escuela/tesoreria/pagos', icon: Receipt },
            //'Reportes de Caja': { path: '/escuela/pagos/reportes', icon: TrendingUp },
        }
    },
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
    const location = useLocation();
    const [expandedModules, setExpandedModules] = useState<string[]>([]);
    const [sedeData, setSedeData] = useState<Sede | null>(null);
    const currentUser = escuelaAuthService.getCurrentUser();
    const { modulosPermisos } = useModulosPermisos(currentUser?.idUsuario ?? null);

    useEffect(() => {
        const sedeId = escuelaAuthService.getSedeId();
        if (sedeId) {
            obtenerSedePorId(sedeId)
                .then(setSedeData)
                .catch(() => setSedeData(null));
        }
    }, []);

    // Construir menú dinámico basado en los módulos del usuario
    const menuModules = useMemo(() => {
        const userModuleNames = new Set((modulosPermisos?.modulos ?? []).map(m => m.nombre.toUpperCase()));
        const menu: MenuItem[] = [];

        for (const [moduleName, config] of Object.entries(menuModulesConfig)) {
            if (!userModuleNames.has(moduleName)) continue;

            // Formatear nombre del módulo: "CONFIGURACIÓN" → "Configuración"
            const displayName = moduleName
                .split(' ')
                .map(word => word.charAt(0) + word.slice(1).toLowerCase())
                .join(' ');

            const menuItem: MenuItem = {
                name: displayName,
                icon: config.icon,
            };

            if (config.subItems) {
                menuItem.subItems = Object.entries(config.subItems).map(([subName, subConfig]) => ({
                    name: subName,
                    path: subConfig.path,
                    icon: subConfig.icon,
                }));
            } else {
                menuItem.path = displayName === 'Dashboard' ? '/escuela/dashboard' : undefined;
            }

            menu.push(menuItem);
        }

        return menu;
    }, [modulosPermisos]);

    const isActive = (path?: string) => {
        if (!path) return false;
        return location.pathname === path;
    };

    const isModuleActive = (module: MenuItem) => {
        if (module.path) return isActive(module.path);
        if (module.subItems) {
            return module.subItems.some(sub => location.pathname.startsWith(sub.path));
        }
        return false;
    };
    const toggleModule = (moduleName: string) => {
        setExpandedModules(prev => 
            prev.includes(moduleName) 
                ? prev.filter(m => m !== moduleName)
                : [...prev, moduleName]
        );
    };

    return (
        <aside 
            className={`bg-escuela-dark text-text-light fixed left-0 top-0 bottom-0 z-50 shadow-xl sidebar-scroll-escuela transition-transform duration-300 w-72 lg:translate-x-0 ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
            style={{
                overflowY: 'auto',
                overflowX: 'hidden',
                scrollbarGutter: 'stable'
            }}
        >
            <div className="p-6 border-b border-escuela/30 bg-gradient-to-br from-escuela-dark via-escuela-light to-escuela-dark relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors lg:hidden"
                    aria-label="Cerrar menú"
                >
                    <X className="w-5 h-5" />
                </button>
                <div className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-3 border-2 border-escuela/30 shadow-lg p-3 transition-transform hover:scale-110 cursor-pointer overflow-hidden">
                        {sedeData?.idInstitucion?.logoPath ? (
                            <img
                                src={sedeData.idInstitucion.logoPath.startsWith('http')
                                    ? sedeData.idInstitucion.logoPath
                                    : `${API_BASE}${sedeData.idInstitucion.logoPath}`
                                }
                                alt={sedeData.idInstitucion.nombre || 'Logo'}
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <img src="/src/assets/logo/Logo_escuelita.svg" alt="Logo Escuelita" className="w-full h-full object-contain" />
                        )}
                    </div>
                    <h2 className="text-lg font-bold text-center text-white leading-tight">
                        {sedeData?.idInstitucion?.nombre || 'Sistema Escolar'}
                    </h2>
                    <p className="text-xs text-white/70 text-center mt-1">
                        {sedeData?.nombreSede || 'Gestión Integral'}
                    </p>
                </div>
            </div>

            <nav className="p-3 space-y-1 w-full pr-2">
                {menuModules.map((module) => {
                    const IconComponent = module.icon;
                    const moduleActive = isModuleActive(module);
                    const isExpanded = expandedModules.includes(module.name);
                    return (
                        <div key={module.name} className="w-full">
                            {module.subItems ? (
                                <>
                                    <button
                                        onClick={() => toggleModule(module.name)}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group relative ${
                                            moduleActive
                                                ? 'border-l-4 border-white bg-escuela/40 shadow-sm'
                                                : isExpanded
                                                    ? 'bg-escuela/30 hover:bg-escuela/50'
                                                    : 'hover:bg-escuela/50'
                                        }`}
                                    >
                                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                                            <IconComponent className="w-5 h-5 text-white/90 flex-shrink-0" />
                                            <span className="text-sm font-semibold text-white truncate">{module.name}</span>
                                        </div>
                                        <svg
                                            className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 text-white/70 ${isExpanded ? 'rotate-180' : ''}`}
                                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    {isExpanded && (
                                        <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-escuela/40">
                                            {module.subItems.map((subItem) => {
                                                const SubIconComponent = subItem.icon;
                                                const subActive = isActive(subItem.path);
                                                return (
                                                    <Link
                                                        key={subItem.path}
                                                        to={subItem.path}
                                                        className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm ml-2 transition-all duration-150 group relative ${
                                                            subActive
                                                                ? 'border-l-4 border-white bg-escuela/40'
                                                                : 'hover:bg-escuela/40'
                                                        }`}
                                                    >
                                                        {SubIconComponent && (
                                                            <SubIconComponent className={`w-4 h-4 flex-shrink-0 ${subActive ? 'text-white' : 'text-white/70 group-hover:text-white/90'}`} />
                                                        )}
                                                        <span className={`font-medium truncate ${subActive ? 'text-white' : 'text-white/80 group-hover:text-white'}`}>{subItem.name}</span>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Link
                                    to={module.path || '#'}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group relative ${
                                        isActive(module.path)
                                            ? 'border-l-4 border-white bg-escuela/40 shadow-sm'
                                            : 'hover:bg-escuela/50'
                                    }`}
                                >
                                    <IconComponent className="w-5 h-5 text-white/90 flex-shrink-0" />
                                    <span className="text-sm font-semibold text-white truncate">{module.name}</span>
                                </Link>
                            )}
                        </div>
                    );
                })}
            </nav>
        </aside>
    );
};

export default Sidebar;