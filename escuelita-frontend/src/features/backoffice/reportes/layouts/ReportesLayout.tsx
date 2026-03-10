import {
    BarChart3,
    BookOpen,
    CreditCard,
    GraduationCap,
    HeartPulse,
    Receipt,
    TrendingUp
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

interface ReporteTab {
    label: string;
    path: string;
    icon: LucideIcon;
}

const reporteTabs: ReporteTab[] = [
    { label: 'Ejecutivo', path: '/admin/reportes/estadisticas', icon: TrendingUp },
    { label: 'Uso del Sistema', path: '/admin/reportes/uso', icon: BarChart3 },
    { label: 'Ingresos', path: '/admin/reportes/ingresos', icon: CreditCard },
    { label: 'Académico', path: '/admin/reportes/academico', icon: BookOpen },
    { label: 'Salud Comercial', path: '/admin/reportes/salud-comercial', icon: HeartPulse },
    { label: 'Pagos Suscripción', path: '/admin/reportes/pagos-suscripcion', icon: Receipt },
    { label: 'Alumnos', path: '/admin/reportes/alumnos', icon: GraduationCap },
];

const ReportesLayout: React.FC = () => {
    const location = useLocation();

    const isTabActive = (tabPath: string) => location.pathname === tabPath;

    return (
        <div className="flex flex-col h-full">
            {/* Tab navigation */}
            <div className="bg-white border-b border-gray-200 px-3 pt-3 sm:px-4 lg:px-5">
                <div className="flex items-center gap-2 overflow-x-auto pb-0 scrollbar-thin scrollbar-thumb-gray-300">
                    {reporteTabs.map((tab) => {
                        const Icon = tab.icon;
                        const active = isTabActive(tab.path);
                        return (
                            <Link
                                key={tab.path}
                                to={tab.path}
                                className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium whitespace-nowrap rounded-t-lg border-b-2 transition-colors ${
                                    active
                                        ? 'border-primary text-primary bg-primary/5'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{tab.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Page content */}
            <div className="flex-1 overflow-auto">
                <Outlet />
            </div>
        </div>
    );
};

export default ReportesLayout;
