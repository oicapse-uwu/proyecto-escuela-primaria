package com.escuelita.www.entity;

public class ReporteAcademicoDTO {
    private Long idInstitucion;
    private String nombreInstitucion;
    private String codModular;
    private int totalEvaluaciones;
    private int totalCalificaciones;
    private int totalAlumnosEvaluados;
    private double promedioNotasGeneral;
    private int totalDocentes;
    private String estadoSuscripcion;

    public Long getIdInstitucion() { return idInstitucion; }
    public void setIdInstitucion(Long idInstitucion) { this.idInstitucion = idInstitucion; }

    public String getNombreInstitucion() { return nombreInstitucion; }
    public void setNombreInstitucion(String nombreInstitucion) { this.nombreInstitucion = nombreInstitucion; }

    public String getCodModular() { return codModular; }
    public void setCodModular(String codModular) { this.codModular = codModular; }

    public int getTotalEvaluaciones() { return totalEvaluaciones; }
    public void setTotalEvaluaciones(int totalEvaluaciones) { this.totalEvaluaciones = totalEvaluaciones; }

    public int getTotalCalificaciones() { return totalCalificaciones; }
    public void setTotalCalificaciones(int totalCalificaciones) { this.totalCalificaciones = totalCalificaciones; }

    public int getTotalAlumnosEvaluados() { return totalAlumnosEvaluados; }
    public void setTotalAlumnosEvaluados(int totalAlumnosEvaluados) { this.totalAlumnosEvaluados = totalAlumnosEvaluados; }

    public double getPromedioNotasGeneral() { return promedioNotasGeneral; }
    public void setPromedioNotasGeneral(double promedioNotasGeneral) { this.promedioNotasGeneral = promedioNotasGeneral; }

    public int getTotalDocentes() { return totalDocentes; }
    public void setTotalDocentes(int totalDocentes) { this.totalDocentes = totalDocentes; }

    public String getEstadoSuscripcion() { return estadoSuscripcion; }
    public void setEstadoSuscripcion(String estadoSuscripcion) { this.estadoSuscripcion = estadoSuscripcion; }
}
