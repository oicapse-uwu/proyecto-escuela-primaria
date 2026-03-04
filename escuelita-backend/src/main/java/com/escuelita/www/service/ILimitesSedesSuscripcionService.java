package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;

import com.escuelita.www.entity.LimitesSedesSuscripcion;

public interface ILimitesSedesSuscripcionService {
    
    /**
     * Buscar todos los límites de sedes
     */
    List<LimitesSedesSuscripcion> buscarTodos();
    
    /**
     * Buscar límites por suscripción
     */
    List<LimitesSedesSuscripcion> buscarPorSuscripcion(Long idSuscripcion);
    
    /**
     * Buscar límite específico por suscripción y sede
     */
    Optional<LimitesSedesSuscripcion> buscarPorSuscripcionYSede(Long idSuscripcion, Long idSede);
    
    /**
     * Buscar por ID
     */
    Optional<LimitesSedesSuscripcion> buscarPorId(Long idLimiteSede);
    
    /**
     * Guardar o actualizar límite
     */
    LimitesSedesSuscripcion guardar(LimitesSedesSuscripcion limite);
    
    /**
     * Eliminar límite
     */
    void eliminar(Long idLimiteSede);
    
    /**
     * Eliminar todos los límites de una suscripción
     */
    void eliminarPorSuscripcion(Long idSuscripcion);
    
    /**
     * Generar distribución equitativa automática
     * Divide el límite total de alumnos equitativamente entre las sedes activas
     */
    List<LimitesSedesSuscripcion> generarDistribucionEquitativa(Long idSuscripcion);
    
    /**
     * Validar que la suma de límites no exceda el límite total de la suscripción
     */
    boolean validarLimitesPersonalizados(Long idSuscripcion, List<LimitesSedesSuscripcion> limites);
}
