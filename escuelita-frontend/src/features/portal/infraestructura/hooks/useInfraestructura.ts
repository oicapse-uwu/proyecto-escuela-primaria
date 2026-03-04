import { useCallback, useState } from 'react';
import {
    actualizarAnioEscolar,
    actualizarAula,
    actualizarGrado,
    actualizarInstitucion,
    actualizarPeriodo,
    actualizarSede,
    actualizarSeccion,
    crearAnioEscolar,
    crearAula,
    crearGrado,
    crearInstitucion,
    crearPeriodo,
    crearSede,
    crearSeccion,
    eliminarAnioEscolar,
    eliminarAula,
    eliminarGrado,
    eliminarInstitucion,
    eliminarPeriodo,
    eliminarSede,
    eliminarSeccion,
    obtenerAnioEscolarPorId,
    obtenerAulaPorId,
    obtenerGradoPorId,
    obtenerInstitucionPorId,
    obtenerPeriodoPorId,
    obtenerSedePorId,
    obtenerSeccionPorId,
    obtenerTodosAniosEscolares,
    obtenerTodosGrados,
    obtenerTodosPeriodos,
    obtenerTodasAulas,
    obtenerTodasInstituciones,
    obtenerTodasSedes,
    obtenerTodasSecciones,
} from '../api/infraestructuraApi';
import type {
    AnioEscolar,
    AnioEscolarDTO,
    Aula,
    AulaDTO,
    Grado,
    GradoDTO,
    Institucion,
    InstitucionDTO,
    Periodo,
    PeriodoDTO,
    Sede,
    SedeDTO,
    Seccion,
    SeccionDTO,
} from '../types';

interface CrudEntityState<T, DTO> {
    registros: T[];
    registro: T | null;
    cargando: boolean;
    error: string | null;
    obtenerTodos: () => Promise<void>;
    obtenerPorId: (id: number) => Promise<void>;
    crear: (payload: DTO) => Promise<void>;
    actualizar: (payload: DTO) => Promise<void>;
    eliminar: (id: number) => Promise<void>;
    limpiarError: () => void;
}

interface CrudService<T, DTO> {
    obtenerTodos: () => Promise<T[]>;
    obtenerPorId: (id: number) => Promise<T>;
    crear: (payload: DTO) => Promise<T>;
    actualizar: (payload: DTO) => Promise<T>;
    eliminar: (id: number) => Promise<string>;
}

const useCrudEntity = <T, DTO>(
    service: CrudService<T, DTO>,
    getId: (item: T) => number,
): CrudEntityState<T, DTO> => {
    const [registros, setRegistros] = useState<T[]>([]);
    const [registro, setRegistro] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const cargarRegistros = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await service.obtenerTodos();
            setRegistros(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al cargar registros';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [service]);

    const cargarRegistro = useCallback(async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await service.obtenerPorId(id);
            setRegistro(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al cargar registro';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [service]);

    const crearRegistro = useCallback(async (payload: DTO) => {
        setLoading(true);
        setError(null);
        try {
            const created = await service.crear(payload);
            setRegistros(prev => [...prev, created]);
            setRegistro(created);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al crear registro';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [service]);

    const actualizarRegistro = useCallback(async (payload: DTO) => {
        setLoading(true);
        setError(null);
        try {
            const updated = await service.actualizar(payload);
            const updatedId = getId(updated);
            setRegistros(prev => prev.map(item => (getId(item) === updatedId ? updated : item)));
            setRegistro(updated);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al actualizar registro';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [getId, service]);

    const eliminarRegistro = useCallback(async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            await service.eliminar(id);
            setRegistros(prev => prev.filter(item => getId(item) !== id));
            setRegistro(prev => (prev && getId(prev) === id ? null : prev));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al eliminar registro';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [getId, service]);

    const limpiarError = useCallback(() => {
        setError(null);
    }, []);

    return {
        registros,
        registro,
        cargando: loading,
        error,
        obtenerTodos: cargarRegistros,
        obtenerPorId: cargarRegistro,
        crear: crearRegistro,
        actualizar: actualizarRegistro,
        eliminar: eliminarRegistro,
        limpiarError,
    };
};

const institucionesService: CrudService<Institucion, InstitucionDTO> = {
    obtenerTodos: obtenerTodasInstituciones,
    obtenerPorId: obtenerInstitucionPorId,
    crear: crearInstitucion,
    actualizar: actualizarInstitucion,
    eliminar: eliminarInstitucion,
};

const sedesService: CrudService<Sede, SedeDTO> = {
    obtenerTodos: obtenerTodasSedes,
    obtenerPorId: obtenerSedePorId,
    crear: crearSede,
    actualizar: actualizarSede,
    eliminar: eliminarSede,
};

const aniosEscolaresService: CrudService<AnioEscolar, AnioEscolarDTO> = {
    obtenerTodos: obtenerTodosAniosEscolares,
    obtenerPorId: obtenerAnioEscolarPorId,
    crear: crearAnioEscolar,
    actualizar: actualizarAnioEscolar,
    eliminar: eliminarAnioEscolar,
};

const periodosService: CrudService<Periodo, PeriodoDTO> = {
    obtenerTodos: obtenerTodosPeriodos,
    obtenerPorId: obtenerPeriodoPorId,
    crear: crearPeriodo,
    actualizar: actualizarPeriodo,
    eliminar: eliminarPeriodo,
};

const gradosService: CrudService<Grado, GradoDTO> = {
    obtenerTodos: obtenerTodosGrados,
    obtenerPorId: obtenerGradoPorId,
    crear: crearGrado,
    actualizar: actualizarGrado,
    eliminar: eliminarGrado,
};

const seccionesService: CrudService<Seccion, SeccionDTO> = {
    obtenerTodos: obtenerTodasSecciones,
    obtenerPorId: obtenerSeccionPorId,
    crear: crearSeccion,
    actualizar: actualizarSeccion,
    eliminar: eliminarSeccion,
};

const aulasService: CrudService<Aula, AulaDTO> = {
    obtenerTodos: obtenerTodasAulas,
    obtenerPorId: obtenerAulaPorId,
    crear: crearAula,
    actualizar: actualizarAula,
    eliminar: eliminarAula,
};

export const useInstituciones = () => useCrudEntity(institucionesService, item => item.idInstitucion);
export const useSedes = () => useCrudEntity(sedesService, item => item.idSede);
export const useAniosEscolares = () => useCrudEntity(aniosEscolaresService, item => item.idAnioEscolar);
export const usePeriodos = () => useCrudEntity(periodosService, item => item.idPeriodo);
export const useGrados = () => useCrudEntity(gradosService, item => item.idGrado);
export const useSecciones = () => useCrudEntity(seccionesService, item => item.idSeccion);
export const useAulas = () => useCrudEntity(aulasService, item => item.idAula);
