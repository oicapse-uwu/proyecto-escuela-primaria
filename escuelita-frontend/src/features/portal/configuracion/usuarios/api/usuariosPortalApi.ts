import { api, API_ENDPOINTS } from '../../../../../config/api.config';
import type {
  Modulo,
  Permiso,
  Rol,
  RolDTO,
  RolModuloPermiso,
  RolModuloPermisoDTO,
  Sede,
  TipoDocumento,
  UsuarioPortal,
  UsuarioPortalDTO
} from '../types';

const USUARIOS_ENDPOINT = API_ENDPOINTS.USUARIOS;
const ROLES_ENDPOINT = API_ENDPOINTS.ROLES;
const SEDES_ENDPOINT = API_ENDPOINTS.SEDES;
const TIPOS_DOCUMENTO_ENDPOINT = API_ENDPOINTS.TIPOS_DOCUMENTO;
const PERMISOS_ENDPOINT = API_ENDPOINTS.PERMISOS;
const MODULOS_ENDPOINT = API_ENDPOINTS.MODULOS;
const ROL_MODULO_PERMISO_ENDPOINT = API_ENDPOINTS.ROL_MODULO_PERMISO;

const normalizarTipoDocumento = (item: any): TipoDocumento => ({
    idTipoDoc: Number(item?.idTipoDoc ?? item?.idDocumento ?? 0),
    nombreDocumento: String(item?.nombreDocumento ?? item?.descripcion ?? item?.abreviatura ?? '').trim(),
    abreviatura: item?.abreviatura ? String(item.abreviatura).trim() : undefined,
    longitudMaxima: item?.longitudMaxima != null ? Number(item.longitudMaxima) : undefined,
    esLongitudExacta: item?.esLongitudExacta != null ? Number(item.esLongitudExacta) : undefined
});

const normalizarSede = (item: any): Sede => ({
    idSede: Number(item?.idSede ?? 0),
    nombreSede: String(item?.nombreSede ?? '').trim(),
    idInstitucion: item?.idInstitucion
        ? {
            idInstitucion: Number(item.idInstitucion?.idInstitucion ?? 0),
            nombre: String(item.idInstitucion?.nombre ?? '').trim()
        }
        : undefined
});

const normalizarUsuario = (item: any): UsuarioPortal => ({
    ...item,
    idSede: item?.idSede ? normalizarSede(item.idSede) : undefined,
    idTipoDoc: item?.idTipoDoc ? normalizarTipoDocumento(item.idTipoDoc) : undefined
});

export const obtenerUsuariosPortal = async (idSede?: number | null): Promise<UsuarioPortal[]> => {
    const endpoint = idSede ? `${USUARIOS_ENDPOINT}/sede/${idSede}` : USUARIOS_ENDPOINT;
    const response = await api.get<UsuarioPortal[]>(endpoint);
    return (response.data || []).map(normalizarUsuario);
};

export const obtenerUsuarioPortalPorId = async (idUsuario: number): Promise<UsuarioPortal | null> => {
    const response = await api.get<UsuarioPortal | null>(`${USUARIOS_ENDPOINT}/${idUsuario}`);
    return response.data ? normalizarUsuario(response.data) : null;
};

export const crearUsuarioPortal = async (payload: UsuarioPortalDTO): Promise<UsuarioPortal> => {
    const response = await api.post<UsuarioPortal>(USUARIOS_ENDPOINT, payload);
    return response.data;
};

export const actualizarUsuarioPortal = async (payload: UsuarioPortalDTO): Promise<UsuarioPortal> => {
    if (!payload.idUsuario) {
        throw new Error('ID de usuario requerido para actualizar');
    }
    const response = await api.put<UsuarioPortal>(USUARIOS_ENDPOINT, payload);
    return response.data;
};

export const eliminarUsuarioPortal = async (idUsuario: number): Promise<string> => {
    const response = await api.delete<string>(`${USUARIOS_ENDPOINT}/${idUsuario}`);
    return response.data;
};

export const obtenerRolesPortal = async (idSede?: number | null): Promise<Rol[]> => {
    const endpoint = idSede ? `${ROLES_ENDPOINT}/sede/${idSede}` : ROLES_ENDPOINT;
    const response = await api.get<Rol[]>(endpoint);
    return response.data;
};

export const crearRolPortal = async (payload: RolDTO): Promise<Rol> => {
    const response = await api.post<Rol>(ROLES_ENDPOINT, payload);
    return response.data;
};

export const actualizarRolPortal = async (payload: RolDTO): Promise<Rol> => {
    if (!payload.idRol) {
        throw new Error('ID de rol requerido para actualizar');
    }
    const response = await api.put<Rol>(ROLES_ENDPOINT, payload);
    return response.data;
};

export const eliminarRolPortal = async (idRol: number): Promise<string> => {
    const response = await api.delete<string>(`${ROLES_ENDPOINT}/${idRol}`);
    return response.data;
};

export const obtenerSedesPortal = async (): Promise<Sede[]> => {
    const response = await api.get<any[]>(SEDES_ENDPOINT);
    return (response.data || []).map(normalizarSede);
};

export const obtenerTiposDocumentoPortal = async (): Promise<TipoDocumento[]> => {
    const response = await api.get<any[]>(TIPOS_DOCUMENTO_ENDPOINT);
    return (response.data || [])
        .map(normalizarTipoDocumento)
    .filter((item) => item.idTipoDoc > 0 && item.nombreDocumento.length > 0)
    .filter((item) => !/^seleccionar\s+tipo\s+documento$/i.test(item.nombreDocumento))
    .sort((a, b) => a.nombreDocumento.localeCompare(b.nombreDocumento));
};

export const obtenerPermisosPortal = async (): Promise<Permiso[]> => {
    const response = await api.get<Permiso[]>(PERMISOS_ENDPOINT);
    return response.data;
};

export const obtenerModulosPortal = async (): Promise<Modulo[]> => {
    const response = await api.get<Modulo[]>(MODULOS_ENDPOINT);
    return response.data;
};

export const obtenerRolModuloPermisoPortal = async (idSede?: number | null): Promise<RolModuloPermiso[]> => {
    const endpoint = idSede ? `${ROL_MODULO_PERMISO_ENDPOINT}/sede/${idSede}` : ROL_MODULO_PERMISO_ENDPOINT;
    const response = await api.get<RolModuloPermiso[]>(endpoint);
    return response.data;
};

export const crearRolModuloPermisoPortal = async (payload: RolModuloPermisoDTO): Promise<RolModuloPermiso> => {
    const response = await api.post<RolModuloPermiso>(ROL_MODULO_PERMISO_ENDPOINT, payload);
    return response.data;
};

export const actualizarRolModuloPermisoPortal = async (payload: RolModuloPermisoDTO): Promise<RolModuloPermiso> => {
    if (!payload.idRmp) {
        throw new Error('ID RMP requerido para actualizar');
    }
    const response = await api.put<RolModuloPermiso>(ROL_MODULO_PERMISO_ENDPOINT, payload);
    return response.data;
};

export const eliminarRolModuloPermisoPortal = async (idRmp: number): Promise<string> => {
    const response = await api.delete<string>(`${ROL_MODULO_PERMISO_ENDPOINT}/${idRmp}`);
    return response.data;
};