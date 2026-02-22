package com.escuelita.www.service;

import java.util.List;
import java.util.Optional;
import com.escuelita.www.entity.SuperAdmins;

public interface ISuperAdminsService {
    List<SuperAdmins> buscarTodos();           // Devuelve todos los administradores
    void guardar(SuperAdmins superAdmin);       // Registra un administrador
    void modificar(SuperAdmins superAdmin);     // Modifica un administrador
    Optional<SuperAdmins> buscarId(Long id); // Devuelve un administrador por ID
    void eliminar(Long id);                 // Elimina un administrador (Lógico por el @SQLDelete)


}
