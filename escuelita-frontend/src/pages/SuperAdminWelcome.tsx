import { Building2, CheckCircle, LogOut } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SuperAdminWelcome: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary to-primary-light flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                {/* Card principal */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary to-primary-light p-8 text-center">
                        <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/30">
                            <Building2 className="w-12 h-12 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            ¡Bienvenido, Super Admin!
                        </h1>
                        <p className="text-white/80">Panel de Administración del Sistema</p>
                    </div>

                    {/* Contenido */}
                    <div className="p-8">
                        {/* Información del usuario */}
                        {user && (
                            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-6">
                                <h2 className="text-xl font-semibold text-text-primary mb-4">
                                    Información de Sesión
                                </h2>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <span className="text-text-secondary font-medium w-32">Nombre:</span>
                                        <span className="text-text-primary font-semibold">
                                            {user.nombres} {user.apellidos}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-text-secondary font-medium w-32">Usuario:</span>
                                        <span className="text-text-primary">{user.usuario}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-text-secondary font-medium w-32">Correo:</span>
                                        <span className="text-text-primary">{user.correo}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-text-secondary font-medium w-32">Rol:</span>
                                        <span className="px-3 py-1 bg-primary text-white text-sm font-semibold rounded-full">
                                            {user.rol?.nombreRol}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Estado del login */}
                        <div className="bg-success/10 border border-success/30 rounded-lg p-4 mb-6 flex items-start">
                            <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-0.5 mr-3" />
                            <div>
                                <h3 className="font-semibold text-success mb-1">Login Exitoso</h3>
                                <p className="text-sm text-text-secondary">
                                    Has iniciado sesión correctamente. El sistema está conectado al backend
                                    y tu sesión está activa.
                                </p>
                            </div>
                        </div>

                        {/* Mensaje temporal */}
                        <div className="text-center py-8">
                            <p className="text-text-secondary text-lg mb-2">
                                Panel de super administrador en desarrollo
                            </p>
                            <p className="text-text-secondary text-sm">
                                Las funcionalidades del panel SaaS se implementarán próximamente
                            </p>
                        </div>

                        {/* Botón de logout */}
                        <button
                            onClick={handleLogout}
                            className="w-full bg-error hover:bg-error/90 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Cerrar Sesión</span>
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-white/80 text-sm mt-6">
                    © 2026 Sistema de Gestión Escolar
                </p>
            </div>
        </div>
    );
};

export default SuperAdminWelcome;
