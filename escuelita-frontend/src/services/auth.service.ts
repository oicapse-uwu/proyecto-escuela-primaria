import { api } from '../config/api.config';

export interface LoginRequest {
    usuario: string;
    contrasena: string;
}

export interface LoginResponse {
    token: string;
    usuario: {
        idUsuario: number;
        nombres: string;
        apellidos: string;
        correo: string;
        usuario: string;
        fotoPerfil?: string;
        rol: {
            idRol: number;
            nombreRol: string;
        };
        sede?: {
            idSede: number;
            nombreSede: string;
        };
    };
}

export interface Usuario {
    idUsuario: number;
    nombres: string;
    apellidos: string;
    correo: string;
    usuario: string;
    fotoPerfil?: string;
    rol: {
        idRol: number;
        nombreRol: string;
    };
    sede?: {
        idSede: number;
        nombreSede: string;
    };
}

class AuthService {
    private readonly TOKEN_KEY = 'token';
    private readonly USER_KEY = 'user';

    async login(credentials: LoginRequest): Promise<LoginResponse> {
        try {
            const response = await api.post<LoginResponse>('/auth/login', credentials);
            
            if (response.data.token) {
                localStorage.setItem(this.TOKEN_KEY, response.data.token);
                localStorage.setItem(this.USER_KEY, JSON.stringify(response.data.usuario));
            }
            
            return response.data;
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    }

    logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    getCurrentUser(): Usuario | null {
        const userStr = localStorage.getItem(this.USER_KEY);
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch {
                return null;
            }
        }
        return null;
    }

    isAuthenticated(): boolean {
        return this.getToken() !== null;
    }

    isSuperAdmin(): boolean {
        const user = this.getCurrentUser();
        return user?.rol?.nombreRol?.toUpperCase() === 'SUPER ADMIN' || 
               user?.rol?.nombreRol?.toUpperCase() === 'SUPERADMIN';
    }

    isAdmin(): boolean {
        const user = this.getCurrentUser();
        const role = user?.rol?.nombreRol?.toUpperCase();
        return role === 'ADMIN' || role === 'SUPER ADMIN' || role === 'SUPERADMIN';
    }
}

export const authService = new AuthService();
