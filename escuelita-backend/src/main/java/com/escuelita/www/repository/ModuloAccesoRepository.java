package com.escuelita.www.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.escuelita.www.entity.RolModulo;

@Repository
public interface ModuloAccesoRepository extends JpaRepository<RolModulo, Long> {
    
    /**
     * Llama al Stored Procedure para validar si usuario tiene acceso a módulo
     * Retorna un List con un mapa que contiene el resultado
     * 
     * @param idUsuario ID del usuario
     * @param idModulo ID del módulo (1-8)
     * @return Integer con 1 si tiene acceso, 0 si no
     */
    @Procedure(name = "validarAccesoModuloUsuario")
    Integer validarAccesoModulo(
        @Param("p_idUsuario") Long idUsuario,
        @Param("p_idModulo") Long idModulo
    );
}
