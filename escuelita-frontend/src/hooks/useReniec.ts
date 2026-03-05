import { useCallback, useState } from 'react';
import type { ReniecResponse } from '../services/reniec.service';
import { reniecService } from '../services/reniec.service';

interface UseReniecReturn {
    data: ReniecResponse | null;
    loading: boolean;
    error: string | null;
    consultarDni: (dni: string) => Promise<void>;
    reset: () => void;
}

/**
 * Hook personalizado para consultar DNI en RENIEC
 * @returns Objeto con data, loading, error y función consultarDni
 */
export const useReniec = (): UseReniecReturn => {
    const [data, setData] = useState<ReniecResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const consultarDni = useCallback(async (dni: string) => {
        setLoading(true);
        setError(null);
        setData(null);

        try {
            const resultado = await reniecService.consultarDni(dni);
            setData(resultado);
        } catch (err: any) {
            setError(err.message || 'Error al consultar DNI');
        } finally {
            setLoading(false);
        }
    }, []);

    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setLoading(false);
    }, []);

    return {
        data,
        loading,
        error,
        consultarDni,
        reset
    };
};
