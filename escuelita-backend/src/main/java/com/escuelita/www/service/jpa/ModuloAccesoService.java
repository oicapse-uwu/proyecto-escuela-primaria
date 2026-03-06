package com.escuelita.www.service.jpa;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.escuelita.www.repository.ModuloAccesoRepository;

@Service
public class ModuloAccesoService {
    
    @Autowired
    private ModuloAccesoRepository repoModuloAcceso;
    
    /**
     * Valida si un usuario tiene acceso a un módulo específico
     * 
     * @param idUsuario ID del usuario
     * @param idModulo ID del módulo (1=DASHBOARD, 2=CONFIGURACIÓN, ..., 8=PAGOS Y PENSIONES)
     * @return true si tiene acceso, false si no
     */
    public boolean tieneAccesoModulo(Long idUsuario, Long idModulo) {
        try {
            System.out.println("🔍 Validando acceso: Usuario " + idUsuario + " → Módulo " + idModulo);
            Integer resultado = repoModuloAcceso.validarAccesoModulo(idUsuario, idModulo);
            boolean tiene = resultado != null && resultado == 1;  // 1 = tiene acceso
            System.out.println(tiene ? "✅ Acceso permitido" : "❌ Acceso denegado");
            return tiene;
        } catch (Exception e) {
            System.err.println("❌ Error validando acceso a módulo: " + e.getMessage());
            e.printStackTrace();
            return false;  // Por seguridad, denegar si hay error
        }
    }
}
