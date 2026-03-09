import type { LucideIcon } from 'lucide-react';
import {
    BarChart3,
    BookOpen,
    Briefcase,
    Building,
    Building2,
    Calendar,
    CalendarDays,
    CheckCircle,
    ClipboardCheck,
    ClipboardList,
    Clock,
    CreditCard,
    DollarSign,
    DoorOpen,
    FileCheck,
    FileText,
    FileType,
    GraduationCap,
    Grid3x3,
    Layers,
    LayoutDashboard,
    MapPin,
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
import React, { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useModulosPermisos } from '../../hooks/useModulosPermisos';
import { escuelaAuthService } from '../../services/escuelaAuth.service';

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
            'Institución': { path: '/escuela/configuracion/institucion', icon: Building },
            'Sedes': { path: '/escuela/configuracion/sedes', icon: MapPin },
            'Año Escolar': { path: '/escuela/configuracion/anio-escolar', icon: Calendar },
            'Periodos Académicos': { path: '/escuela/configuracion/periodos', icon: CalendarDays },
            'Usuarios y Roles': { path: '/escuela/configuracion/usuarios', icon: UserCog },
            'Tipos de Documento': { path: '/escuela/configuracion/tipo-documentos', icon: FileType },
        }
    },
    'INFRAESTRUCTURA': {
        icon: Building2,
        subItems: {
            'Grados y Secciones': { path: '/escuela/infraestructura/grados-secciones', icon: Layers },
            'Aulas': { path: '/escuela/infraestructura/aulas', icon: DoorOpen },
        }
    },
    'GESTIÓN ACADÉMICA': {
        icon: GraduationCap,
        subItems: {
            'Áreas y Cursos': { path: '/escuela/academica/areas-cursos', icon: BookOpen },
            'Malla Curricular': { path: '/escuela/academica/malla', icon: Grid3x3 },
            'Docentes': { path: '/escuela/academica/docentes', icon: User },
            'Especialidades': { path: '/escuela/academica/especialidades', icon: Briefcase },
            'Asignación Docente': { path: '/escuela/academica/asignacion', icon: ClipboardList },
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
            'Evaluaciones': { path: '/escuela/evaluaciones/evaluaciones', icon: FileText },
            'Promedios': { path: '/escuela/evaluaciones/promedios', icon: TrendingUp },
        }
    },
    'PAGOS Y PENSIONES': {
        icon: Wallet,
        subItems: {
            'Conceptos de Pago': { path: '/escuela/tesoreria/conceptos-pago', icon: DollarSign },
            'Métodos de Pago': { path: '/escuela/tesoreria/metodos-pago', icon: CreditCard },
            'Registrar Pago': { path: '/escuela/tesoreria/pagos', icon: Receipt },
            'Deudas por Alumno': { path: '/escuela/tesoreria/deudas-alumnos', icon: BarChart3 },
            'Reportes de Caja': { path: '/escuela/tesoreria/reportes', icon: TrendingUp },
        }
    },
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
    const location = useLocation();
    const [expandedModules, setExpandedModules] = useState<string[]>([]);
    const currentUser = escuelaAuthService.getCurrentUser();
    const { modulosPermisos } = useModulosPermisos(currentUser?.idUsuario ?? null);

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
            <div className="p-6 border-b border-escuela/30 bg-gradient-to-br from-escuela-dark via-escuela-light to-escuela relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors lg:hidden"
                    aria-label="Cerrar menú"
                >
                    <X className="w-5 h-5" />
                </button>
                <div className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-3 border-2 border-escuela/30 shadow-lg p-3 transition-transform hover:scale-110 cursor-pointer">
                        <img src="/src/assets/logo/Logo_escuelita.svg" alt="Logo Escuelita" className="w-full h-full object-contain" />
                    </div>
                    <h2 className="text-lg font-bold text-center text-white">Sistema Escolar</h2>
                    <p className="text-xs text-white/70 text-center mt-1">Gestión Integral</p>
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
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                                            isModuleActive(module)
                                                ? 'border-l-4 border-white'
                                                : 'hover:bg-escuela/50'
                                        }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <IconComponent className="w-5 h-5 text-white/90" />
                                            <span className="text-sm font-semibold text-white">{module.name}</span>
                                        </div>
                                    </button>
                                    {expandedModules.includes(module.name) && (
                                        <div className="ml-4 mt-1 space-y-1 border-l-2 border-escuela/40">
                                            {module.subItems.map((subItem) => {
                                                const SubIconComponent = subItem.icon;
                                                return (
                                                    <Link
                                                        key={subItem.path}
                                                        to={subItem.path}
                                                        className="flex items-center space-x-3 px-4 py-2 rounded-lg text-sm hover:bg-escuela/40"
                                                    >
                                                        {SubIconComponent && (
                                                            <SubIconComponent className="w-4 h-4 text-white/70" />
                                                        )}
                                                        <span className="text-white/80">{subItem.name}</span>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Link
                                    to={module.path || '#'}
                                    className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-escuela/50"
                                >
                                    <IconComponent className="w-5 h-5 text-white/90" />
                                    <span className="text-sm font-semibold text-white">{module.name}</span>
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