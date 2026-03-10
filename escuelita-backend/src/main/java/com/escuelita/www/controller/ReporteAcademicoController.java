package com.escuelita.www.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.escuelita.www.entity.ReporteAcademicoDTO;
import com.escuelita.www.service.jpa.ReporteAcademicoService;
import com.escuelita.www.util.TenantContext;

@RestController
@RequestMapping("/restful")
public class ReporteAcademicoController {

    @Autowired
    private ReporteAcademicoService reporteAcademicoService;

    @GetMapping("/reportes/academico")
    public List<ReporteAcademicoDTO> obtenerReporteAcademico() {
        if (!TenantContext.isSuperAdmin()) {
            throw new RuntimeException("Acceso denegado: solo Super Admin puede acceder a este reporte");
        }
        return reporteAcademicoService.generarReporte();
    }
}
