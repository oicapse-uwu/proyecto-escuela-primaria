import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { docentesApi } from '../api/docentesApi';
import { filtrarPorSedeActual } from '../../../../utils/sedeFilter';
import type {
    PerfilDocente,
    PerfilDocenteFormData,
    Usuario,
    Especialidad
} from '../types';

export const useDocentes = () => {
    const [docentes, setDocentes] = useState<PerfilDocente[]>([]);
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch all docentes
    const fetchDocentes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await docentesApi.getAll();
            
            // 🔒 FILTRAR POR SEDE DEL USUARIO ACTUAL
            const datosFiltrados = filtrarPorSedeActual(data.map(docente => ({
                ...docente,
                idSede: docente.idUsuario?.idSede
            })));
            
            setDocentes(datosFiltrados as PerfilDocente[]);
        } catch {
            const errorMessage = 'Error al cargar los docentes';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch available users
    const fetchUsuarios = useCallback(async () => {
        try {
            const data = await docentesApi.getAvailableUsers();
            console.log('[docentes] usuarios disponibles:', data);
            // If API returns an object wrapper, try to extract array
            if (Array.isArray(data)) {
                setUsuarios(data);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } else if (data && Array.isArray((data as any).data)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setUsuarios((data as any).data);
            } else {
                console.warn('[docentes] respuesta inesperada de usuarios disponibles:', data);
                setUsuarios([]);
            }
        } catch (err) {
            // Try to log status/body if available
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const e = err as any;
            console.error('Error al cargar usuarios disponibles:', e);
            if (e?.response) {
                console.error('[docentes] error response status:', e.response.status, 'data:', e.response.data);
            }
            setUsuarios([]);
            try { toast.error('No se pudieron cargar los usuarios disponibles para asignación'); } catch {
                // Ignorar error de toast
            }
        }

        // No mock here — rely on API or show empty state. Errors are logged above.
    }, []);

    // Fetch especialidades
    const fetchEspecialidades = useCallback(async () => {
        try {
            const data = await docentesApi.getEspecialidades();
            setEspecialidades(data);
        } catch (err) {
            console.error('Error al cargar especialidades:', err);
            toast.error('Error al cargar especialidades');
        }
    }, []);

    // Create docente
    const createDocente = useCallback(async (data: PerfilDocenteFormData) => {
        setLoading(true);
        try {
            const newDocente = await docentesApi.create({
                gradoAcademico: data.gradoAcademico,
                fechaContratacion: data.fechaContratacion,
                estadoLaboral: data.estadoLaboral,
                idUsuario: data.idUsuario,
                idEspecialidad: data.idEspecialidad
            });
            setDocentes(prev => [...prev, newDocente]);
            return newDocente;
        } finally {
            setLoading(false);
        }
    }, []);

    // Update docente
    const updateDocente = useCallback(async (id: number, data: PerfilDocenteFormData) => {
        setLoading(true);
        try {
            const updatedDocente = await docentesApi.update(id, {
                idDocente: id,
                gradoAcademico: data.gradoAcademico,
                fechaContratacion: data.fechaContratacion,
                estadoLaboral: data.estadoLaboral,
                idUsuario: data.idUsuario,
                idEspecialidad: data.idEspecialidad,
                estado: data.estado
            });
            setDocentes(prev => prev.map(doc =>
                doc.idDocente === id ? updatedDocente : doc
            ));
            return updatedDocente;
        } finally {
            setLoading(false);
        }
    }, []);

    // Delete docente
    const deleteDocente = useCallback(async (id: number) => {
        setLoading(true);
        try {
            await docentesApi.delete(id);
            setDocentes(prev => prev.filter(doc => doc.idDocente !== id));
        } finally {
            setLoading(false);
        }
    }, []);

    // Initialize data
    useEffect(() => {
        fetchDocentes();
        fetchUsuarios();
        fetchEspecialidades();
    }, [fetchDocentes, fetchUsuarios, fetchEspecialidades]);

    return {
        docentes,
        usuarios,
        especialidades,
        loading,
        error,
        fetchDocentes,
        fetchUsuarios,
        fetchEspecialidades,
        createDocente,
        updateDocente,
        deleteDocente
    };
};