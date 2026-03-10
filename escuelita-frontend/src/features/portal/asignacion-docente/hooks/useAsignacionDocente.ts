import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { api, API_ENDPOINTS } from '../../../../config/api.config';
import { filtrarPorSedeActual } from '../../../../utils/sedeFilter';
import type {
    AnioEscolar,
    AsignacionDocente,
    AsignacionDocenteFormData,
    Curso,
    Grado,
    PerfilDocenteOption,
    Seccion
} from '../types';

export const useAsignacionDocente = () => {
    const [asignacionesDocentes, setAsignacionesDocentes] = useState<AsignacionDocente[]>([]);
    const [docentes, setDocentes] = useState<PerfilDocenteOption[]>([]);
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [grados, setGrados] = useState<Grado[]>([]);
    const [secciones, setSecciones] = useState<Seccion[]>([]);
    const [aniosEscolares, setAniosEscolares] = useState<AnioEscolar[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAsignacionesDocentes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [asignacionesRes, docentesRes, cursosRes, gradosRes, seccionesRes, aniosRes] = await Promise.all([
                api.get<AsignacionDocente[]>(API_ENDPOINTS.ASIGNACION_DOCENTE),
                api.get<PerfilDocenteOption[]>(API_ENDPOINTS.PERFIL_DOCENTE),
                api.get<Curso[]>(API_ENDPOINTS.CURSOS),
                api.get<Grado[]>(API_ENDPOINTS.GRADOS),
                api.get<Seccion[]>(API_ENDPOINTS.SECCIONES),
                api.get<AnioEscolar[]>(API_ENDPOINTS.ANIO_ESCOLAR)
            ]);

            // 🔒 FILTRAR POR SEDE DEL USUARIO ACTUAL
            const asignacionesFiltradas = filtrarPorSedeActual(
                (Array.isArray(asignacionesRes.data) ? asignacionesRes.data : []).map(asignacion => ({
                    ...asignacion,
                    idSede: asignacion.idSeccion?.idSede
                }))
            ) as AsignacionDocente[];

            const docentesFiltrados = filtrarPorSedeActual(
                (Array.isArray(docentesRes.data) ? docentesRes.data : []).map(docente => ({
                    ...docente,
                    idSede: docente.idUsuario?.idSede
                }))
            ) as PerfilDocenteOption[];

            const seccionesFiltradas = filtrarPorSedeActual(
                Array.isArray(seccionesRes.data) ? seccionesRes.data : []
            ) as Seccion[];

            setAsignacionesDocentes(asignacionesFiltradas);
            setDocentes(docentesFiltrados);
            setCursos(Array.isArray(cursosRes.data) ? cursosRes.data : []);
            setGrados(Array.isArray(gradosRes.data) ? gradosRes.data : []);
            setSecciones(seccionesFiltradas);
            setAniosEscolares(Array.isArray(aniosRes.data) ? aniosRes.data : []);
        } catch (err) {
            setError('Error al cargar las asignaciones docentes');
            console.error('Error fetching asignaciones docentes:', err);
            toast.error('Error al cargar asignaciones docentes');
        } finally {
            setLoading(false);
        }
    }, []);

    const createAsignacionDocente = useCallback(async (data: AsignacionDocenteFormData) => {
        setLoading(true);
        try {
            const payload = {
                idDocente: data.idDocente,
                idCurso: data.idCurso,
                idSeccion: data.idSeccion,
                idAnioEscolar: data.idAnioEscolar,
                estado: data.estado
            };

            const response = await api.post<AsignacionDocente>(API_ENDPOINTS.ASIGNACION_DOCENTE, payload);
            setAsignacionesDocentes(prev => [...prev, response.data]);
        } catch (err) {
            console.error('Error creating asignacion docente:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateAsignacionDocente = useCallback(async (id: number, data: AsignacionDocenteFormData) => {
        setLoading(true);
        try {
            const payload = {
                idAsignacion: id,
                idDocente: data.idDocente,
                idCurso: data.idCurso,
                idSeccion: data.idSeccion,
                idAnioEscolar: data.idAnioEscolar,
                estado: data.estado
            };

            const response = await api.put<AsignacionDocente>(API_ENDPOINTS.ASIGNACION_DOCENTE, payload);
            setAsignacionesDocentes(prev =>
                prev.map(asignacion =>
                    asignacion.idAsignacion === id ? response.data : asignacion
                )
            );
        } catch (err) {
            console.error('Error updating asignacion docente:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteAsignacionDocente = useCallback(async (id: number) => {
        setLoading(true);
        try {
            await api.delete(`${API_ENDPOINTS.ASIGNACION_DOCENTE}/${id}`);
            setAsignacionesDocentes(prev =>
                prev.filter(asignacion => asignacion.idAsignacion !== id)
            );
        } catch (err) {
            console.error('Error deleting asignacion docente:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        asignacionesDocentes,
        docentes,
        cursos,
        grados,
        secciones,
        aniosEscolares,
        loading,
        error,
        fetchAsignacionesDocentes,
        createAsignacionDocente,
        updateAsignacionDocente,
        deleteAsignacionDocente
    };
};
