package com.escuelita.www.service.jpa;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.escuelita.www.entity.PromediosPeriodo;
import com.escuelita.www.repository.PerfilDocenteRepository;
import com.escuelita.www.repository.PromediosPeriodoRepository;
import com.escuelita.www.service.IPromediosPeriodoService;
import com.escuelita.www.util.TenantContext;

@Service
public class PromediosPeriodoService implements IPromediosPeriodoService {
    @Autowired
    private PromediosPeriodoRepository repoPromedios;

    @Autowired
    private PerfilDocenteRepository repoPerfilDocente;

    public List<PromediosPeriodo> buscarTodos() {
        if (TenantContext.isSuperAdmin()) {
            return repoPromedios.findAll();
        }
        Long userId = TenantContext.getUserId();
        Long sedeId = TenantContext.getSedeId();
        if (userId != null && repoPerfilDocente.findByIdUsuario_IdUsuario(userId).isPresent()) {
            return repoPromedios.findByDocenteUsuarioId(userId);
        }
        if (sedeId != null) {
            return repoPromedios.findBySedeId(sedeId);
        }
        return repoPromedios.findAll();
    }
    @Override
    public PromediosPeriodo guardar(PromediosPeriodo promediosPeriodo) {
        return repoPromedios.save(promediosPeriodo);
    }
    @Override
    public PromediosPeriodo modificar(PromediosPeriodo promediosPeriodo) {
        return repoPromedios.save(promediosPeriodo);
    }
    public Optional<PromediosPeriodo> buscarId(Long id) {
        return repoPromedios.findById(id);
    }
    public void eliminar(Long id) {
        repoPromedios.deleteById(id);
    }
}
