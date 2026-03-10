/* eslint-disable @typescript-eslint/no-explicit-any */
import { api, API_ENDPOINTS } from '../../../../config/api.config';
import { escuelaAuthService } from '../../../../services/escuelaAuth.service';
import type {
    CreatePerfilDocenteRequest,
    Especialidad,
    PerfilDocente,
    UpdatePerfilDocenteRequest,
    Usuario
} from '../types';

// API functions for Docentes
export const docentesApi = {
    // Get all docentes
    getAll: async (): Promise<PerfilDocente[]> => {
        const response = await api.get(API_ENDPOINTS.PERFIL_DOCENTE);
        return response.data;
    },

    // Get docente by ID
    getById: async (id: number): Promise<PerfilDocente> => {
        const response = await api.get(`${API_ENDPOINTS.PERFIL_DOCENTE}/${id}`);
        return response.data;
    },

    // Create new docente
    create: async (data: CreatePerfilDocenteRequest): Promise<PerfilDocente> => {
        const response = await api.post(API_ENDPOINTS.PERFIL_DOCENTE, data);
        return response.data;
    },

    // Update docente (backend expects idDocente in body and PUT to base endpoint)
    update: async (id: number, data: UpdatePerfilDocenteRequest): Promise<PerfilDocente> => {
        const response = await api.put(API_ENDPOINTS.PERFIL_DOCENTE, {
            ...data,
            idDocente: id
        });
        return response.data;
    },

    // Delete docente (soft delete)
    delete: async (id: number): Promise<void> => {
        await api.delete(`${API_ENDPOINTS.PERFIL_DOCENTE}/${id}`);
    },

    // Get available users for docente assignment
    getAvailableUsers: async (): Promise<Usuario[]> => {
        // Enforce sede scoping: each sesión sólo puede ver usuarios de su propia sede.
        const sedeId = escuelaAuthService?.getSedeId?.();
        let noSede = false;
        if (!sedeId) {
            console.warn('[docentesApi] getAvailableUsers: usuario sin sede en sesión — intentaremos obtener usuarios globales (no filtraremos por sede)');
            noSede = true;
        }

        // First try the specialized endpoint which may already be scoped.
        try {
            const response = await api.get('/restful/usuarios/disponibles-docentes');
            const data = response.data;
            console.debug('[docentesApi] disponibles-docentes raw response:', data);

            const normalizeAndFilter = (arr: any[]) => {
                // helper to extract candidate sede ids from multiple possible shapes
                const extractSedeIds = (u: any) => {
                    const ids: any[] = [];
                    if (u == null) return ids;
                    if (u.idSede) {
                        if (typeof u.idSede === 'object') ids.push(u.idSede.idSede ?? u.idSede);
                        else ids.push(u.idSede);
                    }
                    if (u.sede) {
                        if (typeof u.sede === 'object') ids.push(u.sede.idSede ?? u.sede);
                        else ids.push(u.sede);
                    }
                    if (u.sedes && Array.isArray(u.sedes)) {
                        u.sedes.forEach((s: any) => ids.push(s?.idSede ?? s));
                    }
                    if (u.sedeId) ids.push(u.sedeId);
                    if (u.sede_ids) ids.push(...(u.sede_ids || []));
                    return ids.filter(Boolean).map(Number);
                };

                const hasDocRole = (u: any) => {
                    const candidates: string[] = [];
                    if (!u) return false;
                    if (u.rol && u.rol.nombreRol) candidates.push(String(u.rol.nombreRol));
                    if (u.nombreRol) candidates.push(String(u.nombreRol));
                    if (u.role && u.role.name) candidates.push(String(u.role.name));
                    if (u.roles && Array.isArray(u.roles)) {
                        u.roles.forEach((r: any) => {
                            if (r) candidates.push(r.nombreRol || r.name || r.label || '');
                        });
                    }
                    if (u.perfil && u.perfil.rol) candidates.push(String(u.perfil.rol));
                    const joined = candidates.join(' ').toUpperCase();
                    return joined.includes('DOC') || joined.includes('PROFESOR');
                };

                // debug sample
                console.debug('[docentesApi] normalizeAndFilter sample users:', arr.slice(0,3));

                return arr
                    .filter(u => {
                        if (noSede) return true;
                        return extractSedeIds(u).includes(Number(sedeId));
                    })
                    .filter(u => hasDocRole(u));
            };

            if (Array.isArray(data)) return normalizeAndFilter(data);
            if (data && Array.isArray((data as any).data)) return normalizeAndFilter((data as any).data);
            return [];
        } catch (err) {
            console.warn('[docentesApi] disponibles-docentes failed, falling back to /usuarios', err);
        }

        // Next try: fetch usuarios by sede (backend endpoint exists: /restful/usuarios/sede/{id})
        try {
            if (!noSede) {
                const bySedeRes = await api.get(`/restful/usuarios/sede/${sedeId}`);
                const payload = bySedeRes.data;
                console.debug('[docentesApi] usuarios/sede payload sample:', payload);

                let usersBySede: any[] = [];
                if (Array.isArray(payload)) usersBySede = payload;
                else if (payload && Array.isArray(payload.data)) usersBySede = payload.data;
                else if (payload && Array.isArray(payload.content)) usersBySede = payload.content;

                if (usersBySede.length > 0) {
                    console.debug('[docentesApi] usuarios by sede count:', usersBySede.length);
                    const activos = usersBySede.filter((u: any) => u?.estado === 1 || u?.estado === 'ACTIVO' || u?.estado === true);
                    const final = activos.filter(u => {
                        const nombreRol = (u?.rol?.nombreRol || u?.nombreRol || u?.role?.name || (u?.roles && u.roles[0] && (u.roles[0].nombreRol || u.roles[0].name)) || '').toString().toUpperCase();
                        return nombreRol.includes('DOC') || nombreRol.includes('PROFESOR');
                    });
                    console.debug('[docentesApi] usuarios by sede after role filter count:', final.length);
                    if (final.length === 0 && activos.length > 0) {
                        console.warn('[docentesApi] role filter removed all users; returning active users by sede as fallback');
                        return activos;
                    }
                    return final;
                }
            } else {
                console.debug('[docentesApi] no sede available — skipping /usuarios/sede and trying global endpoints');
            }
        } catch (errSede) {
            console.warn('[docentesApi] request /usuarios/sede failed or skipped, falling back to general usuarios', errSede);
        }

        // Fallback: fetch all usuarios and scope by sede
        try {
            const usersRes = await api.get(API_ENDPOINTS.USUARIOS);
            const payload = usersRes.data;

            // support several shapes: array, { data: [...] }, { content: [...] }, { items: [...] }
            let users: any[] = [];
            if (Array.isArray(payload)) users = payload;
            else if (payload && Array.isArray(payload.data)) users = payload.data;
            else if (payload && Array.isArray(payload.content)) users = payload.content;
            else if (payload && Array.isArray(payload.items)) users = payload.items;

            console.debug('[docentesApi] usuarios payload sample:', Array.isArray(payload) ? payload.slice(0,3) : payload && typeof payload === 'object' ? Object.keys(payload).slice(0,5) : payload);

            if (users.length === 0) {
                console.warn('[docentesApi] fallback usuarios: no array found in payload, returning []');
                return [];
            }

            console.debug('[docentesApi] usuarios fetched count:', users.length);
            const filteredBySede = users.filter((u: any) => {
                const userSedeId = u?.idSede?.idSede ?? u?.idSede ?? u?.sede?.idSede ?? u?.sede ?? u?.sedeId ?? (u?.sede_ids && u.sede_ids[0]);
                return Number(userSedeId) === Number(sedeId);
            });
            console.debug('[docentesApi] usuarios after sede filter count:', filteredBySede.length);

            const activos = filteredBySede.filter((u: any) => u?.estado === 1 || u?.estado === 'ACTIVO' || u?.estado === true);
            const final = activos.filter(u => {
                const nombreRol = (u?.rol?.nombreRol || u?.nombreRol || u?.role?.name || (u?.roles && u.roles[0] && (u.roles[0].nombreRol || u.roles[0].name)) || '').toString().toUpperCase();
                return nombreRol.includes('DOC') || nombreRol.includes('PROFESOR');
            });

            console.debug('[docentesApi] usuarios after role filter count:', final.length);
            // If role filter yields nothing but there are active users in the sede, return them.
            if (final.length === 0 && activos.length > 0) {
                console.warn('[docentesApi] role filter removed all users; returning active users by sede as fallback');
                return activos;
            }
            // If still empty but we have global users, return them as last resort.
            if (final.length === 0 && filteredBySede.length === 0 && users.length > 0) {
                console.warn('[docentesApi] no users in sede after filtering; returning any available users as last resort');
                return users;
            }

            return final;
        } catch (err2) {
            console.error('[docentesApi] fallback /usuarios also failed', err2);
            return [];
        }
    },

    // Get all especialidades
    getEspecialidades: async (): Promise<Especialidad[]> => {
        const response = await api.get(API_ENDPOINTS.ESPECIALIDADES);
        return response.data;
    }
};