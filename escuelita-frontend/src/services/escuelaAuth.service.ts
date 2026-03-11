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
            idInstitucion?: number;
        };
    };
}

export interface EscuelaUsuario {
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
        idInstitucion?: number;
    };
}

class EscuelaAuthService {
    private readonly TOKEN_KEY = 'escuela_token';
    private readonly USER_KEY = 'escuela_user';

    async login(credentials: LoginRequest): Promise<LoginResponse> {
        try {
            const response = await api.post<LoginResponse>('/auth/escuela/login', credentials);
            
            if (response.data.token) {
                localStorage.setItem(this.TOKEN_KEY, response.data.token);
                localStorage.setItem(this.USER_KEY, JSON.stringify(response.data.usuario));
            }
            
            return response.data;
        } catch (error) {
            console.error('Error en login escuela:', error);
            throw error;
        }
    }

    logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        try { console.log('[escuelaAuthService] logout called - tokens removed'); } catch {}
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    getCurrentUser(): EscuelaUsuario | null {
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
        const auth = this.getToken() !== null;
        try { console.log('[escuelaAuthService] isAuthenticated ->', auth); } catch {}
        return auth;
    }

    isProfesor(): boolean {
        const user = this.getCurrentUser();
        return user?.rol?.nombreRol?.toUpperCase() === 'PROFESOR' ||
               user?.rol?.nombreRol?.toUpperCase() === 'DOCENTE';
    }

    isCajero(): boolean {
        const user = this.getCurrentUser();
        return user?.rol?.nombreRol?.toUpperCase() === 'CAJERO' ||
               user?.rol?.nombreRol?.toUpperCase() === 'SECRETARIA';
    }

    getSedeId(): number | null {
        const user = this.getCurrentUser();
        return user?.sede?.idSede || null;
    }

    updateCurrentUser(updates: Partial<EscuelaUsuario>): void {
        const user = this.getCurrentUser();
        if (!user) return;
        const updated = { ...user, ...updates };
        localStorage.setItem(this.USER_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event('escuelaUserUpdated'));
    }
}

export const escuelaAuthService = new EscuelaAuthService();
