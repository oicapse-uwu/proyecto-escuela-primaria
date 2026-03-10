import { api } from "../../../../config/api.config";
import type { Plan, PlanFormData } from "../types";

// Obtener todos los planes
export const getPlanesApi = async (): Promise<Plan[]> => {
    const response = await api.get('/restful/planes');
    return response.data;
};

// Obtener un plan por ID
export const getPlanByIdApi = async (id: number): Promise<Plan> => {
    const response = await api.get('/restful/planes/' + id);
    return response.data;
};

// Crear un nuevo plan
export const createPlanApi = async (plan: PlanFormData): Promise<Plan> => {
    const response = await api.post('/restful/planes', plan);
    return response.data;
};

// Actualizar un plan
export const updatePlanApi = async (idPlan: number, plan: PlanFormData): Promise<Plan> => {
    const response = await api.put('/restful/planes', {
        idPlan,
        ...plan
    });
    return response.data;
};

// Eliminar un plan
export const deletePlanApi = async (id: number): Promise<void> => {
    await api.delete('/restful/planes/' + id);
};
