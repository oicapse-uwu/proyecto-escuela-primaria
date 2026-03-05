package com.escuelita.www.util;

import java.util.List;
import java.util.Optional;
import java.util.function.Supplier;

import org.springframework.data.jpa.repository.JpaRepository;

/*
    Helper para simplificar el control de acceso por sede en los services.
    Evita duplicar código en cada service.
*/

public class SedeAccessHelper {

    /** Buscar todos los registros filtrando por sede si es necesario
     * @param repository Repository a usar
     * @param findBySede Método del repository que filtra por sede
     * @return Lista de registros (filtrada o completa según el usuario) */
    public static <T> List<T> findAllWithSedeFilter(
            JpaRepository<T, Long> repository,
            Supplier<List<T>> findBySede) {
        
        Long sedeId = TenantContext.getSedeId();
        
        if (sedeId == null || TenantContext.isSuperAdmin()) {
            // Super Admin o sin sede: ver todos
            return repository.findAll();
        }
        
        // Usuario de escuela: solo su sede
        return findBySede.get();
    }

    /** Valida que una entidad pertenezca a la sede actual
     * @param sedeIdGetter Función que obtiene el ID de sede de la entidad
     * @throws SecurityException si intenta acceder a otra sede */
    public static void validateSedeAccess(Supplier<Long> sedeIdGetter) {
        Long sedeId = TenantContext.getSedeId();
        
        if (sedeId != null && !TenantContext.isSuperAdmin()) {
            Long entitySedeId = sedeIdGetter.get();
            if (entitySedeId != null && !entitySedeId.equals(sedeId)) {
                throw new SecurityException("No puede acceder a datos de otra sede");
            }
        }
    }
    
    /** Asigna automáticamente la sede del usuario a una entidad
    * @param sedeIdSetter Consumer que establece el ID de sede en la entidad */
    public static void autoAssignSede(java.util.function.Consumer<Long> sedeIdSetter) {
        Long sedeId = TenantContext.getSedeId();
        
        if (sedeId != null && !TenantContext.isSuperAdmin()) {
            sedeIdSetter.accept(sedeId);
        }
    }

    // Filtra un Optional validando que pertenezca a la sede actual
    public static <T> Optional<T> filterBySede(Optional<T> optional, Supplier<Long> sedeIdGetter) {
        Long sedeId = TenantContext.getSedeId();
        
        if (sedeId != null && !TenantContext.isSuperAdmin() && optional.isPresent()) {
            Long entitySedeId = sedeIdGetter.get();
            if (entitySedeId != null && !entitySedeId.equals(sedeId)) {
                return Optional.empty(); // No tiene acceso
            }
        }
        
        return optional;
    }
}
