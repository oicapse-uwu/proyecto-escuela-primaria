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
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
    const [expandedModules, setExpandedModules] = useState<string[]>(['dashboard']);

    const menuModules: MenuItem[] = [
        { 
            name: 'Dashboard', 
            icon: LayoutDashboard, 
            path: '/escuela/dashboard' 
        },
        {
            name: 'Configuración',
            icon: Settings,
            subItems: [
                { name: 'Institución', path: '/escuela/configuracion/institucion', icon: Building },
                { name: 'Sedes', path: '/escuela/configuracion/sedes', icon: MapPin },
                { name: 'Año Escolar', path: '/escuela/configuracion/anio-escolar', icon: Calendar },
                { name: 'Periodos Académicos', path: '/escuela/configuracion/periodos', icon: CalendarDays },
                { name: 'Usuarios y Roles', path: '/escuela/configuracion/usuarios', icon: UserCog },
                { name: 'Tipos de Documento', path: '/escuela/configuracion/tipo-documentos', icon: FileType },
            ]
        },
        {
            name: 'Infraestructura',
            icon: Building2,
            subItems: [
                { name: 'Grados y Secciones', path: '/escuela/infraestructura/grados-secciones', icon: Layers },
                { name: 'Aulas', path: '/escuela/infraestructura/aulas', icon: DoorOpen },
            ]
        },
        {
            name: 'Gestión Académica',
            icon: GraduationCap,
            subItems: [
                { name: 'Áreas y Cursos', path: '/escuela/academica/areas-cursos', icon: BookOpen },
                { name: 'Malla Curricular', path: '/escuela/academica/malla', icon: Grid3x3 },
                { name: 'Docentes', path: '/escuela/academica/docentes', icon: User },
                { name: 'Especialidades', path: '/escuela/academica/especialidades', icon: Briefcase },
                { name: 'Asignación Docente', path: '/escuela/academica/asignacion', icon: ClipboardList },
                { name: 'Horarios', path: '/escuela/academica/horarios', icon: Clock },
            ]
        },
        {
            name: 'Alumnos',
            icon: Users,
            subItems: [
                { name: 'Lista de Alumnos', path: '/escuela/alumnos', icon: Users },
                { name: 'Apoderados', path: '/escuela/apoderados', icon: UserCheck },
            ]
        },
        {
            name: 'Matrículas',
            icon: ClipboardCheck,
            subItems: [
                { name: 'Gestionar Matrículas', path: '/escuela/matriculas', icon: ClipboardList },
                { name: 'Requisitos de Documentos', path: '/escuela/matriculas/requisitos', icon: FileCheck },
            ]
        },
        {
            name: 'Evaluaciones y Notas',
            icon: FileText,
            subItems: [
                { name: 'Asistencias', path: '/escuela/evaluaciones/asistencias', icon: CheckCircle },
                { name: 'Evaluaciones', path: '/escuela/evaluaciones/lista', icon: FileText },
                { name: 'Calificaciones', path: '/escuela/evaluaciones/calificaciones', icon: ClipboardCheck },
                { name: 'Promedios', path: '/escuela/evaluaciones/promedios', icon: TrendingUp },
            ]
        },
        {
            name: 'Pagos y Pensiones',
            icon: Wallet,
            subItems: [
                { name: 'Conceptos de Pago', path: '/escuela/pagos/conceptos', icon: DollarSign },
                { name: 'Métodos de Pago', path: '/escuela/pagos/metodos', icon: CreditCard },
                { name: 'Registrar Pago', path: '/escuela/pagos/registrar', icon: Receipt },
                { name: 'Deudas por Alumno', path: '/escuela/pagos/deudas', icon: BarChart3 },
                { name: 'Reportes de Caja', path: '/escuela/pagos/reportes', icon: TrendingUp },
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
            className={`bg-primary-dark text-text-light fixed left-0 top-0 bottom-0 z-50 shadow-xl sidebar-scroll transition-transform duration-300 w-72 lg:translate-x-0 ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
            style={{
                overflowY: 'auto',
                overflowX: 'hidden',
                scrollbarGutter: 'stable'
            }}
        >
            {/* Espacio para Logo y Título del Colegio */}
            <div className="p-6 border-b border-primary/30 bg-gradient-to-br from-primary-dark via-primary to-primary-dark relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors lg:hidden"
                    aria-label="Cerrar menú"
                >
                    <X className="w-5 h-5" />
                </button>
                <div className="flex flex-col items-center">
                    {/* Logo del colegio */}
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-3 border-2 border-primary/30 shadow-lg p-3 transition-transform hover:scale-110 cursor-pointer">
                        <img src="/src/assets/logo/Logo_escuelita.svg" alt="Logo Escuelita" className="w-full h-full object-contain" />
                    </div>
                    {/* Nombre del colegio */}
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
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-primary/50 transition-all duration-200 group ${
                                            expandedModules.includes(module.name) ? 'bg-primary/40 shadow-sm' : ''
                                        }`}
                                    >
                                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                                            <IconComponent className="w-5 h-5 flex-shrink-0 text-white/90" />
                                            <span className="text-sm font-semibold truncate">{module.name}</span>
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
                                                return (
                                                    <Link
                                                        key={subItem.path}
                                                        to={subItem.path}
                                                        className="flex items-center space-x-3 px-4 py-2.5 rounded-lg hover:bg-primary/40 transition-all duration-150 text-sm ml-2 w-full group"
                                                    >
                                                        {SubIconComponent && (
                                                            <SubIconComponent className="w-4 h-4 flex-shrink-0 text-white/70 group-hover:text-white/90 transition-colors" />
                                                        )}
                                                        <span className="font-medium truncate text-white/80 group-hover:text-white transition-colors">{subItem.name}</span>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Link
                                    to={module.path || '#'}
                                    className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-primary/50 transition-all duration-200 group w-full"
                                >
                                    <IconComponent className="w-5 h-5 flex-shrink-0 text-white/90" />
                                    <span className="text-sm font-semibold truncate">{module.name}</span>
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