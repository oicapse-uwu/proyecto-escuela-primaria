package com.escuelita.www.service.jpa;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.escuelita.www.entity.LimitesSedesSuscripcion;
import com.escuelita.www.entity.Sedes;
import com.escuelita.www.entity.Suscripciones;
import com.escuelita.www.repository.LimitesSedesSuscripcionRepository;
import com.escuelita.www.repository.SedesRepository;
import com.escuelita.www.repository.SuscripcionesRepository;
import com.escuelita.www.service.ILimitesSedesSuscripcionService;

@Service
public class LimitesSedesSuscripcionService implements ILimitesSedesSuscripcionService {
    
    @Autowired
    private LimitesSedesSuscripcionRepository repoLimites;
    
    @Autowired
    private SuscripcionesRepository repoSuscripciones;
    
    @Autowired
    private SedesRepository repoSedes;
    
    @Override
    public List<LimitesSedesSuscripcion> buscarTodos() {
        return repoLimites.findAll();
    }
    
    @Override
    public List<LimitesSedesSuscripcion> buscarPorSuscripcion(Long idSuscripcion) {
        return repoLimites.findByIdSuscripcionId(idSuscripcion);
    }
    
    @Override
    public Optional<LimitesSedesSuscripcion> buscarPorSuscripcionYSede(Long idSuscripcion, Long idSede) {
        return repoLimites.findByIdSuscripcionIdAndIdSedeId(idSuscripcion, idSede);
    }
    
    @Override
    public Optional<LimitesSedesSuscripcion> buscarPorId(Long idLimiteSede) {
        return repoLimites.findById(idLimiteSede);
    }
    
    @Override
    @Transactional
    public LimitesSedesSuscripcion guardar(LimitesSedesSuscripcion limite) {
        return repoLimites.save(limite);
    }
    
    @Override
    @Transactional
    public void eliminar(Long idLimiteSede) {
        repoLimites.deleteById(idLimiteSede);
    }
    
    @Override
    @Transactional
    public void eliminarPorSuscripcion(Long idSuscripcion) {
        Optional<Suscripciones> suscripcionOpt = repoSuscripciones.findById(idSuscripcion);
        if (suscripcionOpt.isPresent()) {
            repoLimites.deleteByIdSuscripcion(suscripcionOpt.get());
        }
    }
    
    @Override
    @Transactional
    public List<LimitesSedesSuscripcion> generarDistribucionEquitativa(Long idSuscripcion) {
        // 1. Buscar la suscripción
        Optional<Suscripciones> suscripcionOpt = repoSuscripciones.findById(idSuscripcion);
        if (!suscripcionOpt.isPresent()) {
            throw new RuntimeException("Suscripción no encontrada con ID: " + idSuscripcion);
        }
        
        Suscripciones suscripcion = suscripcionOpt.get();
        Long idInstitucion = suscripcion.getIdInstitucion().getIdInstitucion();
        
        // 2. Obtener todas las sedes activas de la institución
        List<Sedes> sedesActivas = repoSedes.findSedesActivasByInstitucionId(idInstitucion);
        
        if (sedesActivas.isEmpty()) {
            throw new RuntimeException("No hay sedes activas para la institución");
        }
        
        // 3. Eliminar distribución anterior
        eliminarPorSuscripcion(idSuscripcion);
        
        // 4. Calcular límite por sede (división equitativa)
        Integer limiteTotal = suscripcion.getLimiteAlumnosContratado();
        int numSedes = sedesActivas.size();
        int limitePorSede = limiteTotal / numSedes;
        int residuo = limiteTotal % numSedes;
        
        // 5. Crear los límites para cada sede
        List<LimitesSedesSuscripcion> limitesCreados = new ArrayList<>();
        
        for (int i = 0; i < sedesActivas.size(); i++) {
            Sedes sede = sedesActivas.get(i);
            
            LimitesSedesSuscripcion limite = new LimitesSedesSuscripcion();
            limite.setIdSuscripcion(suscripcion);
            limite.setIdSede(sede);
            
            // Distribuir el residuo entre las primeras sedes
            int limiteAsignado = limitePorSede + (i < residuo ? 1 : 0);
            limite.setLimiteAlumnosAsignado(limiteAsignado);
            limite.setEstado(1);
            
            limitesCreados.add(repoLimites.save(limite));
        }
        
        System.out.println("✅ Distribución equitativa generada: " + numSedes + " sedes, " 
                          + limitePorSede + " alumnos/sede (+" + residuo + " en primeras sedes)");
        
        return limitesCreados;
    }
    
    @Override
    public boolean validarLimitesPersonalizados(Long idSuscripcion, List<LimitesSedesSuscripcion> limites) {
        // 1. Buscar la suscripción
        Optional<Suscripciones> suscripcionOpt = repoSuscripciones.findById(idSuscripcion);
        if (!suscripcionOpt.isPresent()) {
            return false;
        }
        
        Suscripciones suscripcion = suscripcionOpt.get();
        Integer limiteTotal = suscripcion.getLimiteAlumnosContratado();
        
        // 2. Sumar todos los límites asignados
        int sumaLimites = limites.stream()
            .mapToInt(LimitesSedesSuscripcion::getLimiteAlumnosAsignado)
            .sum();
        
        // 3. Validar que no exceda el límite total
        if (sumaLimites > limiteTotal) {
            System.err.println("❌ Validación fallida: Suma de límites (" + sumaLimites 
                             + ") excede límite total (" + limiteTotal + ")");
            return false;
        }
        
        System.out.println("✅ Validación correcta: Suma " + sumaLimites + " / " + limiteTotal);
        return true;
    }
}
