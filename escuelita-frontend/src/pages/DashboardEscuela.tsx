import {
    BookOpen,
    Calendar,
    GraduationCap,
    TrendingUp,
    Users,
    Wallet
} from 'lucide-react';
import React from 'react';

const DashboardEscuela: React.FC = () => {
    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h1 className="text-3xl font-bold text-text-primary mb-2">
                    Dashboard Escuela
                </h1>
                <p className="text-text-secondary">
                    Bienvenido al sistema de gestión escolar
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Total Alumnos */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-text-secondary text-sm font-medium">Total Alumnos</p>
                            <p className="text-3xl font-bold text-text-primary mt-2">245</p>
                            <p className="text-success text-sm mt-2">
                                <TrendingUp className="w-4 h-4 inline" /> +12% vs mes anterior
                            </p>
                        </div>
                        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                            <Users className="w-7 h-7 text-primary" />
                        </div>
                    </div>
                </div>

                {/* Docentes Activos */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-text-secondary text-sm font-medium">Docentes Activos</p>
                            <p className="text-3xl font-bold text-text-primary mt-2">28</p>
                            <p className="text-text-secondary text-sm mt-2">
                                En 12 áreas académicas
                            </p>
                        </div>
                        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                            <GraduationCap className="w-7 h-7 text-primary" />
                        </div>
                    </div>
                </div>

                {/* Cursos Activos */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-text-secondary text-sm font-medium">Cursos Activos</p>
                            <p className="text-3xl font-bold text-text-primary mt-2">45</p>
                            <p className="text-text-secondary text-sm mt-2">
                                6 grados académicos
                            </p>
                        </div>
                        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                            <BookOpen className="w-7 h-7 text-primary" />
                        </div>
                    </div>
                </div>

                {/* Asistencia Promedio */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-text-secondary text-sm font-medium">Asistencia Promedio</p>
                            <p className="text-3xl font-bold text-text-primary mt-2">94%</p>
                            <p className="text-success text-sm mt-2">
                                Excelente nivel
                            </p>
                        </div>
                        <div className="w-14 h-14 bg-success/10 rounded-full flex items-center justify-center">
                            <Calendar className="w-7 h-7 text-success" />
                        </div>
                    </div>
                </div>

                {/* Pagos del Mes */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-text-secondary text-sm font-medium">Pagos del Mes</p>
                            <p className="text-3xl font-bold text-text-primary mt-2">S/ 48,500</p>
                            <p className="text-text-secondary text-sm mt-2">
                                215 pagos registrados
                            </p>
                        </div>
                        <div className="w-14 h-14 bg-success/10 rounded-full flex items-center justify-center">
                            <Wallet className="w-7 h-7 text-success" />
                        </div>
                    </div>
                </div>

                {/* Rendimiento Académico */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-text-secondary text-sm font-medium">Promedio General</p>
                            <p className="text-3xl font-bold text-text-primary mt-2">15.8</p>
                            <p className="text-success text-sm mt-2">
                                Año escolar 2026
                            </p>
                        </div>
                        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                            <TrendingUp className="w-7 h-7 text-primary" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-text-primary mb-4">Acciones Rápidas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button className="flex items-center space-x-3 p-4 border border-primary rounded-lg hover:bg-primary/5 transition-colors">
                        <Users className="w-6 h-6 text-primary" />
                        <span className="text-text-primary font-medium">Registrar Alumno</span>
                    </button>
                    <button className="flex items-center space-x-3 p-4 border border-primary rounded-lg hover:bg-primary/5 transition-colors">
                        <Calendar className="w-6 h-6 text-primary" />
                        <span className="text-text-primary font-medium">Tomar Asistencia</span>
                    </button>
                    <button className="flex items-center space-x-3 p-4 border border-primary rounded-lg hover:bg-primary/5 transition-colors">
                        <Wallet className="w-6 h-6 text-primary" />
                        <span className="text-text-primary font-medium">Registrar Pago</span>
                    </button>
                    <button className="flex items-center space-x-3 p-4 border border-primary rounded-lg hover:bg-primary/5 transition-colors">
                        <BookOpen className="w-6 h-6 text-primary" />
                        <span className="text-text-primary font-medium">Ver Horarios</span>
                    </button>
                </div>
            </div>

            {/* Información del Año Escolar */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h3 className="text-lg font-bold text-text-primary mb-4">Año Escolar Actual</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-text-secondary">Año:</span>
                            <span className="font-semibold text-text-primary">2026</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-text-secondary">Periodo:</span>
                            <span className="font-semibold text-text-primary">Primer Trimestre</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-text-secondary">Estado:</span>
                            <span className="px-3 py-1 bg-success/10 text-success rounded-full text-sm font-medium">
                                Activo
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h3 className="text-lg font-bold text-text-primary mb-4">Próximas Actividades</h3>
                    <div className="space-y-3">
                        <div className="flex items-start space-x-3 p-3 bg-primary/5 rounded-lg">
                            <Calendar className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-text-primary">Reunión de apoderados</p>
                                <p className="text-sm text-text-secondary">28 de febrero, 2026</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3 p-3 bg-primary/5 rounded-lg">
                            <BookOpen className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-text-primary">Cierre de evaluaciones</p>
                                <p className="text-sm text-text-secondary">5 de marzo, 2026</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardEscuela;
