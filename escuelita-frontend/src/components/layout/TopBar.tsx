import { Building2, ChevronDown, LogOut, Menu, User, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { adminAuthService } from '../../services/adminAuth.service';
import { escuelaAuthService } from '../../services/escuelaAuth.service';

interface TopBarProps {
    onToggleSidebar: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onToggleSidebar }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showDropdown, setShowDropdown] = useState(false);
    const [, forceUpdate] = useState(0);
    
    // Determinar si es ruta de admin o escuela
    const isAdminRoute = location.pathname.startsWith('/admin');
    
    // Obtener el usuario según la ruta
    const user = isAdminRoute 
        ? adminAuthService.getCurrentUser()
        : escuelaAuthService.getCurrentUser();

    // Escuchar cambios en el usuario admin o escuela (ej: foto de perfil)
    useEffect(() => {
        const handler = () => forceUpdate(n => n + 1);
        window.addEventListener('adminUserUpdated', handler);
        window.addEventListener('escuelaUserUpdated', handler);
        return () => {
            window.removeEventListener('adminUserUpdated', handler);
            window.removeEventListener('escuelaUserUpdated', handler);
        };
    }, []);

    const handleLogout = () => {
        if (isAdminRoute) {
            adminAuthService.logout();
            navigate('/login');
        } else {
            escuelaAuthService.logout();
            navigate('/escuela/login');
        }
    };

    return (
        <header className="bg-white border-b border-gray-200 fixed top-0 right-0 left-0 z-30 shadow-sm transition-all duration-300">
            <div className="px-4 lg:px-8 py-3 lg:py-4">
                <div className="flex items-center justify-between">
                    {/* Botón menú + Título */}
                    <div className="flex items-center space-x-3 flex-1">
                        <button
                            onClick={onToggleSidebar}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        {/* Indicador de Sede (solo para escuelas) */}
                        {!isAdminRoute && user && 'sede' in user && user.sede && (
                            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-primary/10 rounded-lg border border-primary/20">
                                <Building2 className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium text-primary">
                                    {user.sede.nombreSede}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Right side - User profile */}
                    <div className="flex items-center space-x-2 lg:space-x-4">
                        {/* Botón Portal de Padres (solo para rutas de escuela) */}
                        {!isAdminRoute && user && 'sede' in user && user.sede?.idSede && (
                            <a
                                href={`/portal/${user.sede.idSede}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Portal de Padres"
                                className="p-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors hidden sm:flex items-center gap-1.5"
                            >
                                <Users className="w-5 h-5" />
                            </a>
                        )}

                        {/* User Menu */}
                        {user && (
                            <div className="relative">
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="flex items-center space-x-2 lg:space-x-3 px-2 lg:px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full overflow-hidden flex-shrink-0 bg-primary/10 flex items-center justify-center">
                                        {(user as any).fotoUrl ? (
                                            <img
                                                src={`${import.meta.env.VITE_API_BASE_URL || 'http://primaria.spring.informaticapp.com:4040'}${(user as any).fotoUrl}`}
                                                alt="Avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (user as any).fotoPerfil ? (
                                            <img
                                                src={`${import.meta.env.VITE_API_BASE_URL || 'http://primaria.spring.informaticapp.com:4040'}${(user as any).fotoPerfil}`}
                                                alt="Avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <User className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                                        )}
                                    </div>
                                    <div className="text-left hidden md:block">
                                        <p className="text-sm font-semibold text-gray-900">
                                            {user.nombres} {user.apellidos}
                                        </p>
                                        <p className="text-xs text-gray-500">{user.rol?.nombreRol}</p>
                                    </div>
                                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform hidden sm:block ${showDropdown ? 'rotate-180' : ''}`} />
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
