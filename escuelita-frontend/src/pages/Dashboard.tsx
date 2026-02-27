import { BookOpen, Calendar, DollarSign, FileText, GraduationCap, TrendingUp, UserCheck, Users } from 'lucide-react';
import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
    const { user } = useAuth();

    const stats = [
        { title: 'Alumnos', value: '245', icon: Users, color: 'bg-blue-500', change: '+12%' },
        { title: 'Docentes', value: '32', icon: GraduationCap, color: 'bg-green-500', change: '+3%' },
        { title: 'Cursos', value: '18', icon: BookOpen, color: 'bg-purple-500', change: '0%' },
        { title: 'Ingresos Mes', value: 'S/. 45,680', icon: DollarSign, color: 'bg-yellow-500', change: '+8%' },
    ];

    const recentActivities = [
        { icon: UserCheck, text: 'Nueva matrícula: Juan Pérez', time: 'Hace 2 horas', color: 'text-blue-500' },
        { icon: FileText, text: 'Calificaciones registradas: 3ro A', time: 'Hace 4 horas', color: 'text-green-500' },
        { icon: DollarSign, text: 'Pago recibido: María González', time: 'Hace 6 horas', color: 'text-yellow-500' },
        { icon: Calendar, text: 'Nuevo periodo académico creado', time: 'Ayer', color: 'text-purple-500' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-border-primary">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary">
                            Bienvenido, {user?.nombres} {user?.apellidos}
                        </h1>
                        <p className="text-text-secondary mt-1">
                            Rol: <span className="font-semibold text-primary">{user?.rol?.nombreRol}</span>
                            {user?.sede && <span className="ml-4">Sede: {user.sede.nombreSede}</span>}
                        </p>
                    </div>
                    <div className="text-right text-sm text-text-secondary">
                        <p>{new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-border-primary hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-text-secondary text-sm font-medium">{stat.title}</p>
                                    <p className="text-2xl font-bold text-text-primary mt-2">{stat.value}</p>
                                    <div className="flex items-center mt-2">
                                        <TrendingUp className="w-4 h-4 text-success mr-1" />
                                        <span className="text-success text-sm font-medium">{stat.change}</span>
                                        <span className="text-text-secondary text-xs ml-1">vs. mes anterior</span>
                                    </div>
                                </div>
                                <div className={`${stat.color} p-3 rounded-lg`}>
                                    <Icon className="w-8 h-8 text-white" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Recent Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Activities */}
                <div className="bg-white rounded-lg shadow-sm border border-border-primary">
                    <div className="p-6 border-b border-border-primary">
                        <h2 className="text-lg font-bold text-text-primary">Actividad Reciente</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        {recentActivities.map((activity, index) => {
                            const Icon = activity.icon;
                            return (
                                <div key={index} className="flex items-start space-x-3 pb-4 border-b border-border-primary last:border-0 last:pb-0">
                                    <Icon className={`w-5 h-5 ${activity.color} flex-shrink-0 mt-0.5`} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-text-primary font-medium">{activity.text}</p>
                                        <p className="text-xs text-text-secondary mt-1">{activity.time}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-lg shadow-sm border border-border-primary">
                    <div className="p-6 border-b border-border-primary">
                        <h2 className="text-lg font-bold text-text-primary">Resumen del Día</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-text-secondary">Asistencias registradas</span>
                            <span className="font-semibold text-text-primary">8/12 aulas</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-text-secondary">Pagos recibidos hoy</span>
                            <span className="font-semibold text-success">S/. 2,340</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-text-secondary">Nuevas matrículas</span>
                            <span className="font-semibold text-primary">3</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-text-secondary">Tareas pendientes</span>
                            <span className="font-semibold text-warning">5</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-text-secondary">Documentos por revisar</span>
                            <span className="font-semibold text-error">12</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-primary to-primary-light rounded-lg shadow-sm p-6 text-white">
                <h2 className="text-xl font-bold mb-4">Acciones Rápidas</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-4 transition-all text-center">
                        <Users className="w-8 h-8 mx-auto mb-2" />
                        <span className="text-sm font-medium">Nueva Matrícula</span>
                    </button>
                    <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-4 transition-all text-center">
                        <DollarSign className="w-8 h-8 mx-auto mb-2" />
                        <span className="text-sm font-medium">Registrar Pago</span>
                    </button>
                    <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-4 transition-all text-center">
                        <FileText className="w-8 h-8 mx-auto mb-2" />
                        <span className="text-sm font-medium">Ver Reportes</span>
                    </button>
                    <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-4 transition-all text-center">
                        <Calendar className="w-8 h-8 mx-auto mb-2" />
                        <span className="text-sm font-medium">Horarios</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
