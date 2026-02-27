import { Bell, ChevronDown, LogOut, User } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const TopBar: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-white border-b border-gray-200 fixed top-0 right-0 left-0 z-20 shadow-sm" style={{ marginLeft: '18rem' }}>
            <div className="px-8 py-4">
                <div className="flex items-center justify-between">
                    {/* Título o breadcrumb (vacío por ahora) */}
                    <div className="flex-1">
                        {/* Aquí podrías agregar breadcrumbs o título de la página actual */}
                    </div>

                    {/* Right side - User profile y notificaciones */}
                    <div className="flex items-center space-x-4">
                        {/* Notificaciones */}
                        <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                            <Bell className="w-5 h-5" />
                            {/* Badge de notificaciones pendientes */}
                            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
                        </button>

                        {/* User Menu */}
                        {user && (
                            <div className="relative">
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                        <User className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-semibold text-gray-900">
                                            {user.nombres} {user.apellidos}
                                        </p>
                                        <p className="text-xs text-gray-500">{user.rol?.nombreRol}</p>
                                    </div>
                                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {showDropdown && (
                                    <>
                                        {/* Overlay para cerrar el dropdown */}
                                        <div 
                                            className="fixed inset-0 z-10" 
                                            onClick={() => setShowDropdown(false)}
                                        />
                                        
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                                            <div className="px-4 py-3 border-b border-gray-200">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {user.nombres} {user.apellidos}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">{user.correo}</p>
                                            </div>
                                            
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-error hover:bg-error/10 transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                <span>Cerrar Sesión</span>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopBar;
