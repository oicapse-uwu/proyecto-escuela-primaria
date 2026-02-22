package com.escuelita.www.entity;

import java.time.LocalDate;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "alumnos")
@SQLDelete(sql = "UPDATE alumnos SET estado=0 WHERE id_alumno=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "id_alumno", "numero_documento", "nombres", "apellidos", 
    "fecha_nacimiento", "genero", "direccion", "telefono_contacto", 
    "foto_url", "observaciones_salud", "tipo_ingreso", "estado_alumno", "estado",
    "id_sede", "id_tipo_doc"
})
public class AlumnosDTO {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_alumno;
    
    @Column(length = 20)
    private String numero_documento;
    
    @Column(length = 100)
    private String nombres;
    
    @Column(length = 100)
    private String apellidos;
    
    private LocalDate fecha_nacimiento;
    
    @Column(length = 1)
    private String genero;
    
    @Column(length = 255)
    private String direccion;
    
    @Column(length = 20)
    private String telefono_contacto;
    
    @Column(length = 255)
    private String foto_url;
    
    @Column(columnDefinition = "TEXT")

    private String observaciones_salud;
    private String tipo_ingreso;
    private String estado_alumno;
    private Long id_sede;
    private Long id_tipo_doc;
    private Integer estado = 1;
    
    public Long getId_alumno() {
        return id_alumno;
    }
    public void setId_alumno(Long id_alumno) {
        this.id_alumno = id_alumno;
    }
    public String getNumero_documento() {
        return numero_documento;
    }
    public void setNumero_documento(String numero_documento) {
        this.numero_documento = numero_documento;
    }
    public String getNombres() {
        return nombres;
    }
    public void setNombres(String nombres) {
        this.nombres = nombres;
    }
    public String getApellidos() {
        return apellidos;
    }
    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }
    public LocalDate getFecha_nacimiento() {
        return fecha_nacimiento;
    }
    public void setFecha_nacimiento(LocalDate fecha_nacimiento) {
        this.fecha_nacimiento = fecha_nacimiento;
    }
    public String getGenero() {
        return genero;
    }
    public void setGenero(String genero) {
        this.genero = genero;
    }
    public String getDireccion() {
        return direccion;
    }
    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }
    public String getTelefono_contacto() {
        return telefono_contacto;
    }
    public void setTelefono_contacto(String telefono_contacto) {
        this.telefono_contacto = telefono_contacto;
    }
    public String getFoto_url() {
        return foto_url;
    }
    public void setFoto_url(String foto_url) {
        this.foto_url = foto_url;
    }
    public String getObservaciones_salud() {
        return observaciones_salud;
    }
    public void setObservaciones_salud(String observaciones_salud) {
        this.observaciones_salud = observaciones_salud;
    }
    public String getTipo_ingreso() {
        return tipo_ingreso;
    }
    public void setTipo_ingreso(String tipo_ingreso) {
        this.tipo_ingreso = tipo_ingreso;
    }
    public String getEstado_alumno() {
        return estado_alumno;
    }
    public void setEstado_alumno(String estado_alumno) {
        this.estado_alumno = estado_alumno;
    }
    public Long getId_sede() {
        return id_sede;
    }
    public void setId_sede(Long id_sede) {
        this.id_sede = id_sede;
    }
    public Long getId_tipo_doc() {
        return id_tipo_doc;
    }
    public void setId_tipo_doc(Long id_tipo_doc) {
        this.id_tipo_doc = id_tipo_doc;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "AlumnosDTO [id_alumno=" + id_alumno + ", numero_documento=" + numero_documento + ", nombres=" + nombres
                + ", apellidos=" + apellidos + ", fecha_nacimiento=" + fecha_nacimiento + ", genero=" + genero
                + ", direccion=" + direccion + ", telefono_contacto=" + telefono_contacto + ", foto_url=" + foto_url
                + ", observaciones_salud=" + observaciones_salud + ", tipo_ingreso=" + tipo_ingreso + ", estado_alumno="
                + estado_alumno + ", id_sede=" + id_sede + ", id_tipo_doc=" + id_tipo_doc + ", estado=" + estado + "]";
    }
}