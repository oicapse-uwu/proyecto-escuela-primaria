import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
    obtenerInstitucionesReporte,
    obtenerPagosCajaReporte,
    obtenerSuperAdminsReporte,
    obtenerSuscripcionesReporte,
    obtenerUsuariosReporte
} from '../api/reportesApi';
import type {
    ConteoItem,
    IngresoPorMetodoPago,
    IngresoPorPlan,
    ReporteInstitucion,
    ReportePagoCaja,
    ReporteSuperAdmin,
    ReporteSuscripcion,
    ReporteUsuarioSistema,
    ResumenReportes,
    UsoPorInstitucion
} from '../types';

const normalizarEstado = (estado?: string | null) => (estado || '').toUpperCase();

const sumarPorClave = <T,>(items: T[], getKey: (item: T) => string): ConteoItem[] => {
    const map = new Map<string, number>();
    items.forEach(item => {
        const key = getKey(item) || 'Sin dato';
        map.set(key, (map.get(key) || 0) + 1);
    });

    return Array.from(map.entries())
        .map(([nombre, valor]) => ({ nombre, valor }))
        .sort((a, b) => b.valor - a.valor);
};

export const useReportes = () => {
    const [instituciones, setInstituciones] = useState<ReporteInstitucion[]>([]);
    const [suscripciones, setSuscripciones] = useState<ReporteSuscripcion[]>([]);
    const [usuarios, setUsuarios] = useState<ReporteUsuarioSistema[]>([]);
    const [superAdmins, setSuperAdmins] = useState<ReporteSuperAdmin[]>([]);
    const [pagosCaja, setPagosCaja] = useState<ReportePagoCaja[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cargarDatos = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const [institucionesData, suscripcionesData, usuariosData, superAdminsData, pagosCajaData] = await Promise.all([
                obtenerInstitucionesReporte(),
                obtenerSuscripcionesReporte(),
                obtenerUsuariosReporte(),
                obtenerSuperAdminsReporte(),
                obtenerPagosCajaReporte()
            ]);

            setInstituciones(institucionesData || []);
            setSuscripciones(suscripcionesData || []);
            setUsuarios(usuariosData || []);
            setSuperAdmins(superAdminsData || []);
            setPagosCaja(pagosCajaData || []);
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al cargar reportes';
            setError(mensaje);
            toast.error(mensaje);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const resumen = useMemo<ResumenReportes>(() => {
        const institucionesConUsuarios = new Set(
            usuarios
                .map(user => user.idSede?.idInstitucion?.idInstitucion)
                .filter((id): id is number => typeof id === 'number')
        ).size;

        const institucionesActivas = instituciones.filter(i => {
            const estado = normalizarEstado(i.estadoSuscripcion);
            return estado === 'ACTIVA' || estado === 'ACTIVO';
        }).length;

        const suscripcionesActivas = suscripciones.filter(s =>
            normalizarEstado(s.idEstado?.nombre).includes('ACT')
        ).length;

        const ingresosTotales = suscripciones.reduce((acc, s) => acc + (Number(s.precioAcordado) || 0), 0);

        const ingresoMensualEstimado = suscripciones.reduce((acc, s) => {
            const monto = Number(s.precioAcordado) || 0;
            const meses = Number(s.idCiclo?.mesesDuracion) || 1;
            return acc + (meses > 0 ? monto / meses : monto);
        }, 0);

        const porcentajeUsoSistema = instituciones.length > 0
            ? (institucionesConUsuarios / instituciones.length) * 100
            : 0;

        return {
            totalInstituciones: instituciones.length,
            totalSuscripciones: suscripciones.length,
            totalUsuariosSistema: usuarios.length,
            totalSuperAdmins: superAdmins.length,
            institucionesConUsuarios,
            institucionesActivas,
            suscripcionesActivas,
            ingresosTotales,
            ingresoMensualEstimado,
            porcentajeUsoSistema
        };
    }, [instituciones, suscripciones, usuarios, superAdmins]);

    const institucionesPorTipoGestion = useMemo(
        () => sumarPorClave(instituciones, i => i.tipoGestion || 'Sin tipo'),
        [instituciones]
    );

    const institucionesPorEstadoSuscripcion = useMemo(
        () => sumarPorClave(instituciones, i => i.estadoSuscripcion || 'Sin estado'),
        [instituciones]
    );

    const usuariosPorRol = useMemo(
        () => sumarPorClave(usuarios, u => u.idRol?.nombre || 'Sin rol'),
        [usuarios]
    );

    const usuariosPorSede = useMemo(
        () => sumarPorClave(usuarios, u => u.idSede?.nombreSede || 'Sin sede'),
        [usuarios]
    );

    const ingresosPorPlan = useMemo<IngresoPorPlan[]>(() => {
        const map = new Map<string, IngresoPorPlan>();

        suscripciones.forEach(s => {
            const nombrePlan = s.idPlan?.nombrePlan || 'Sin plan';
            const item = map.get(nombrePlan) || {
                nombrePlan,
                cantidadSuscripciones: 0,
                ingresoTotal: 0
            };

            item.cantidadSuscripciones += 1;
            item.ingresoTotal += Number(s.precioAcordado) || 0;
            map.set(nombrePlan, item);
        });

        return Array.from(map.values()).sort((a, b) => b.ingresoTotal - a.ingresoTotal);
    }, [suscripciones]);

    const ingresosPorMetodoPago = useMemo<IngresoPorMetodoPago[]>(() => {
        const map = new Map<string, IngresoPorMetodoPago>();

        pagosCaja.forEach(pago => {
            const nombreMetodo = pago.idMetodo?.nombreMetodo || 'Sin método';
            const item = map.get(nombreMetodo) || {
                nombreMetodo,
                cantidadPagos: 0,
                ingresoTotal: 0
            };

            item.cantidadPagos += 1;
            item.ingresoTotal += Number(pago.montoTotalPagado) || 0;
            map.set(nombreMetodo, item);
        });

        return Array.from(map.values()).sort((a, b) => b.ingresoTotal - a.ingresoTotal);
    }, [pagosCaja]);

    const usoPorInstitucion = useMemo<UsoPorInstitucion[]>(() => {
        const totalUsuariosSistema = usuarios.length;
        const usuariosPorInstitucion = new Map<number, number>();

        usuarios.forEach(user => {
            const idInstitucion = user.idSede?.idInstitucion?.idInstitucion;
            if (typeof idInstitucion === 'number') {
                usuariosPorInstitucion.set(
                    idInstitucion,
                    (usuariosPorInstitucion.get(idInstitucion) || 0) + 1
                );
            }
        });

        const data = instituciones.map(inst => {
            const totalUsuarios = usuariosPorInstitucion.get(inst.idInstitucion) || 0;
            const porcentajeUso = totalUsuariosSistema > 0
                ? (totalUsuarios / totalUsuariosSistema) * 100
                : 0;

            return {
                idInstitucion: inst.idInstitucion,
                nombre: inst.nombre,
                codModular: inst.codModular,
                estadoSuscripcion: inst.estadoSuscripcion,
                totalUsuarios,
                porcentajeUso
            };
        });

        return data.sort((a, b) => b.porcentajeUso - a.porcentajeUso);
    }, [instituciones, usuarios]);

    return {
        instituciones,
        suscripciones,
        usuarios,
        superAdmins,
        pagosCaja,
        resumen,
        institucionesPorTipoGestion,
        institucionesPorEstadoSuscripcion,
        usuariosPorRol,
        usuariosPorSede,
        usoPorInstitucion,
        ingresosPorPlan,
        ingresosPorMetodoPago,
        isLoading,
        error,
        recargar: cargarDatos
    };
};
