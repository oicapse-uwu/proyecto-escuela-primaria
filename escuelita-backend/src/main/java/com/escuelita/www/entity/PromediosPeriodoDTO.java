package com.escuelita.www.entity;

public class PromediosPeriodoDTO {
    private Long id_promedio;
    private Long id_asignacion;
    private Long id_matricula;
    private Long id_periodo;
    private String nota_final_area;
    private String comentario_libreta;
    private String estado_cierre;
    public Long getId_promedio() {
        return id_promedio;
    }
    public void setId_promedio(Long id_promedio) {
        this.id_promedio = id_promedio;
    }
    public Long getId_asignacion() {
        return id_asignacion;
    }
    public void setId_asignacion(Long id_asignacion) {
        this.id_asignacion = id_asignacion;
    }
    public Long getId_matricula() {
        return id_matricula;
    }
    public void setId_matricula(Long id_matricula) {
        this.id_matricula = id_matricula;
    }
    public Long getId_periodo() {
        return id_periodo;
    }
    public void setId_periodo(Long id_periodo) {
        this.id_periodo = id_periodo;
    }
    public String getNota_final_area() {
        return nota_final_area;
    }
    public void setNota_final_area(String nota_final_area) {
        this.nota_final_area = nota_final_area;
    }
    public String getComentario_libreta() {
        return comentario_libreta;
    }
    public void setComentario_libreta(String comentario_libreta) {
        this.comentario_libreta = comentario_libreta;
    }
    public String getEstado_cierre() {
        return estado_cierre;
    }
    public void setEstado_cierre(String estado_cierre) {
        this.estado_cierre = estado_cierre;
    }
    @Override
    public String toString() {
        return "PromediosPeriodoDTO [id_promedio=" + id_promedio + ", id_asignacion=" + id_asignacion
                + ", id_matricula=" + id_matricula + ", id_periodo=" + id_periodo + ", nota_final_area="
                + nota_final_area + ", comentario_libreta=" + comentario_libreta + ", estado_cierre=" + estado_cierre
                + "]";
    }


    

}