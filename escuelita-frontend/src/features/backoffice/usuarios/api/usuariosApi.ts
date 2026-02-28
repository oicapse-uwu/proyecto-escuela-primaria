import { api } from '../../../../config/api.config';
import type {
    Rol,
    RolDTO,
    Sede,
    SuperAdmin,
    SuperAdminDTO,
    TipoDocumento,
    UsuarioSistema,
    UsuarioSistemaDTO
} from '../types';

const SUPER_ADMINS_BASE_URL = '/restful/superadmins';
const USUARIOS_BASE_URL = '/restful/usuarios';
const ROLES_BASE_URL = '/restful/roles';
const SEDES_BASE_URL = '/restful/sedes';
const TIPOS_DOCUMENTO_BASE_URL = '/restful/tipodocumentos';

export const obtenerSuperAdmins = async (): Promise<SuperAdmin[]> => {
    const response = await api.get<SuperAdmin[]>(SUPER_ADMINS_BASE_URL);
    return response.data;
};

export const crearSuperAdmin = async (superAdmin: SuperAdminDTO): Promise<SuperAdmin> => {
    const response = await api.post<SuperAdmin>(SUPER_ADMINS_BASE_URL, superAdmin);
    return response.data;
};

export const actualizarSuperAdmin = async (superAdmin: SuperAdminDTO): Promise<SuperAdmin> => {
    const response = await api.put<SuperAdmin>(SUPER_ADMINS_BASE_URL, superAdmin);
    return response.data;
};

export const eliminarSuperAdmin = async (id: number): Promise<string> => {
    const response = await api.delete<string>(`${SUPER_ADMINS_BASE_URL}/${id}`);
    return response.data;
};

export const obtenerUsuariosSistema = async (): Promise<UsuarioSistema[]> => {
    const response = await api.get<UsuarioSistema[]>(USUARIOS_BASE_URL);
    return response.data;
};

export const crearUsuarioSistema = async (usuario: UsuarioSistemaDTO): Promise<UsuarioSistema> => {
    const response = await api.post<UsuarioSistema>(USUARIOS_BASE_URL, usuario);
    return response.data;
};

export const actualizarUsuarioSistema = async (usuario: UsuarioSistemaDTO): Promise<UsuarioSistema> => {
    const response = await api.put<UsuarioSistema>(USUARIOS_BASE_URL, usuario);
    return response.data;
};

export const eliminarUsuarioSistema = async (id: number): Promise<string> => {
    const response = await api.delete<string>(`${USUARIOS_BASE_URL}/${id}`);
    return response.data;
};

export const obtenerSedes = async (): Promise<Sede[]> => {
    const response = await api.get<Sede[]>(SEDES_BASE_URL);
    return response.data;
};

export const obtenerTiposDocumento = async (): Promise<TipoDocumento[]> => {
    const response = await api.get<TipoDocumento[]>(TIPOS_DOCUMENTO_BASE_URL);
    return response.data;
};

export const obtenerRoles = async (): Promise<Rol[]> => {
    const response = await api.get<Rol[]>(ROLES_BASE_URL);
    return response.data;
};

export const crearRol = async (rol: RolDTO): Promise<Rol> => {
    const response = await api.post<Rol>(ROLES_BASE_URL, rol);
    return response.data;
};

export const actualizarRol = async (rol: RolDTO): Promise<Rol> => {
    const response = await api.put<Rol>(ROLES_BASE_URL, rol);
    return response.data;
};

export const eliminarRol = async (id: number): Promise<string> => {
    const response = await api.delete<string>(`${ROLES_BASE_URL}/${id}`);
    return response.data;
};
