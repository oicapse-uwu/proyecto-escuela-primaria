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
    };
}

export interface AdminUsuario {
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
}

class AdminAuthService {
    private readonly TOKEN_KEY = 'admin_token';
    private readonly USER_KEY = 'admin_user';

    async login(credentials: LoginRequest): Promise<LoginResponse> {
        try {
            const response = await api.post<LoginResponse>('/auth/admin/login', credentials);
            
            if (response.data.token) {
                localStorage.setItem(this.TOKEN_KEY, response.data.token);
                localStorage.setItem(this.USER_KEY, JSON.stringify(response.data.usuario));
            }
            
            return response.data;
        } catch (error) {
            console.error('Error en login admin:', error);
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

    getCurrentUser(): AdminUsuario | null {
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
        return user?.rol?.nombreRol?.toUpperCase() === 'SUPER_ADMIN' || 
               user?.rol?.nombreRol?.toUpperCase() === 'SUPERADMIN';
    }
}

export const adminAuthService = new AdminAuthService();
