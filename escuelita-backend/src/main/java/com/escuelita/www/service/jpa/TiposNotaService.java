package com.escuelita.www.service.jpa;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.escuelita.www.entity.TiposNota;
import com.escuelita.www.repository.TiposNotaRepository;
import com.escuelita.www.service.ITiposNotaService;

@Service
public class TiposNotaService implements ITiposNotaService {
    @Autowired
    private TiposNotaRepository repoTiposNota;

    public List<TiposNota> buscarTodos() { return repoTiposNota.findAll(); }
    public TiposNota guardar(TiposNota tiposNota) { return repoTiposNota.save(tiposNota); }
    public TiposNota modificar(TiposNota tiposNota) { return repoTiposNota.save(tiposNota); }
    public Optional<TiposNota> buscarId(Long id) { return repoTiposNota.findById(id); }
    public void eliminar(Long id) { repoTiposNota.deleteById(id); }
}