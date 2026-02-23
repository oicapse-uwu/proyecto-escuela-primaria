package com.escuelita.www.controller;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.escuelita.www.entity.MallaCurricular;
import com.escuelita.www.service.IMallaCurricularService;

@RestController
@RequestMapping("/restful")
public class MallaCurricularController {

    @Autowired
    private IMallaCurricularService serviceMallaCurricular;

    @GetMapping("/mallacurricular")
    public List<MallaCurricular> buscartodos() {
        return serviceMallaCurricular.buscarTodos();
    }

    @PostMapping("/mallacurricular")
    public MallaCurricular guardar(@RequestBody MallaCurricular malla) {
        serviceMallaCurricular.guardar(malla);
        return malla;
    }

    @PutMapping("/mallacurricular")
    public MallaCurricular modificar(@RequestBody MallaCurricular malla) {
        serviceMallaCurricular.modificar(malla);
        return malla;
    }

    @GetMapping("/mallacurricular/{id}")
    public Optional<MallaCurricular> buscarId(@PathVariable("id") Long id) {
        return serviceMallaCurricular.buscarId(id);
    }

    @DeleteMapping("/mallacurricular/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceMallaCurricular.eliminar(id);
        return "Malla curricular eliminada correctamente";
    }
}