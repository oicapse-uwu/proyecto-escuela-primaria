import { AlertCircle, Lock, LogIn, User } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAuthService } from '../services/adminAuth.service';

const Login: React.FC = () => {
    const [credentials, setCredentials] = useState({ usuario: '', contrasena: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (!credentials.usuario || !credentials.contrasena) {
            setError('Por favor ingresa usuario y contraseña');
            return;
        }

        setIsLoading(true);

        try {
            await adminAuthService.login(credentials);
            navigate('/admin');
        } catch (err: any) {
            console.error('Error en login:', err);
            if (err.response) {
                setError(err.response.data?.mensaje || 'Usuario o contraseña incorrectos');
            } else if (err.request) {
                setError('No se pudo conectar con el servidor. Verifica que el backend esté corriendo.');
            } else {
                setError('Error inesperado. Intenta nuevamente.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-dark via-primary to-primary-light p-4">
            <div className="w-full max-w-md">
                {/* Card principal */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary via-primary-light to-primary p-8 text-center relative">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg p-3">
                            <img src="https://image2url.com/r2/default/images/1772138737667-40b87bef-d32b-42bc-8e9e-11ef0d404377.png" alt="Logo Escuelita" className="w-full h-full object-contain" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2 drop-shadow-md">Portal Super Admin</h1>
                        <p className="text-white/90 text-sm font-medium">Sistema de Gestión Central</p>
                    </div>

                    {/* Formulario */}
                    <div className="p-8">
                        <h2 className="text-xl font-semibold text-text-primary mb-6 text-center">
                            Iniciar Sesión
                        </h2>

                        {/* Mensaje de error */}
                        {error && (
                            <div className="mb-6 bg-error/10 border border-error/30 rounded-lg p-3 flex items-start space-x-2">
                                <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-error">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Campo Usuario */}
                            <div>
                                <label htmlFor="usuario" className="block text-sm font-medium text-text-primary mb-2">
                                    Usuario
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-text-secondary" />
                                    </div>
                                    <input
                                        id="usuario"
                                        type="text"
                                        value={credentials.usuario}
                                        onChange={(e) => setCredentials({ ...credentials, usuario: e.target.value })}
                                        className="block w-full pl-10 pr-3 py-3 border border-border-primary rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-text-primary placeholder-text-secondary"
                                        placeholder="Ingresa tu usuario"
                                        disabled={isLoading}
                                        autoComplete="username"
                                    />
                                </div>
                            </div>

                            {/* Campo Contraseña */}
                            <div>
                                <label htmlFor="contrasena" className="block text-sm font-medium text-text-primary mb-2">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-text-secondary" />
                                    </div>
                                    <input
                                        id="contrasena"
                                        type="password"
                                        value={credentials.contrasena}
                                        onChange={(e) => setCredentials({ ...credentials, contrasena: e.target.value })}
                                        className="block w-full pl-10 pr-3 py-3 border border-border-primary rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-text-primary placeholder-text-secondary"
                                        placeholder="Ingresa tu contraseña"
                                        disabled={isLoading}
                                        autoComplete="current-password"
                                    />
                                </div>
                            </div>

                            {/* Botón de envío */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                        <span>Iniciando sesión...</span>
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="w-5 h-5" />
                                        <span>Iniciar Sesión</span>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Link de recuperación */}
                        <div className="mt-6 text-center">
                            <a 
                                href="#" 
                                className="text-sm text-primary hover:text-primary-dark transition-colors"
                                onClick={(e) => {
                                    e.preventDefault();
                                    alert('Funcionalidad de recuperación de contraseña próximamente');
                                }}
                            >
                                ¿Olvidaste tu contraseña?
                            </a>
                        </div>
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

export default Login;
