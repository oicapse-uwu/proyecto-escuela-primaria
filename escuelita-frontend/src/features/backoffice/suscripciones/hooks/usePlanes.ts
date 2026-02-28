import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { createPlanApi, deletePlanApi, getPlanesApi, updatePlanApi } from '../api/planesApi';
import type { Plan, PlanFormData } from '../types';

export const usePlanes = () => {
    const [planes, setPlanes] = useState<Plan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Obtener todos los planes
    const fetchPlanes = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await getPlanesApi();
            setPlanes(data);
        } catch (err) {
            const errorMessage = 'Error al cargar los planes';
            setError(errorMessage);
            toast.error(errorMessage);
            console.error('Error fetching planes:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Crear un nuevo plan
    const crear = useCallback(async (planData: PlanFormData) => {
        try {
            const nuevoPlan = await createPlanApi(planData);
            setPlanes(prev => [...prev, nuevoPlan]);
            toast.success('Plan creado exitosamente');
            return nuevoPlan;
        } catch (err) {
            toast.error('Error al crear el plan');
            console.error('Error creating plan:', err);
            throw err;
        }
    }, []);

    // Actualizar un plan
    const actualizar = useCallback(async (idPlan: number, planData: PlanFormData) => {
        try {
            const planActualizado = await updatePlanApi(idPlan, planData);
            setPlanes(prev => prev.map(p => p.idPlan === idPlan ? planActualizado : p));
            toast.success('Plan actualizado exitosamente');
            return planActualizado;
        } catch (err) {
            toast.error('Error al actualizar el plan');
            console.error('Error updating plan:', err);
            throw err;
        }
    }, []);

    // Eliminar un plan
    const eliminar = useCallback(async (idPlan: number) => {
        try {
            await deletePlanApi(idPlan);
            setPlanes(prev => prev.filter(p => p.idPlan !== idPlan));
            toast.success('Plan eliminado exitosamente');
        } catch (err) {
            toast.error('Error al eliminar el plan');
            console.error('Error deleting plan:', err);
            throw err;
        }
    }, []);

    // Cargar planes al montar el componente
    useEffect(() => {
        fetchPlanes();
    }, [fetchPlanes]);

    return {
        planes,
        isLoading,
        error,
        crear,
        actualizar,
        eliminar,
        refetch: fetchPlanes
    };
};
