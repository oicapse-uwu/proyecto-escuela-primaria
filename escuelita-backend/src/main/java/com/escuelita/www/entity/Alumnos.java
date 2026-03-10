//CORRECTO
package com.escuelita.www.entity;

import java.time.LocalDate;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "alumnos")
@SQLDelete(sql = "UPDATE alumnos SET estado=0 WHERE id_alumno=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idAlumno", "numeroDocumento", "nombres", "apellidos", 
    "fechaNacimiento", "genero", "direccion", "telefonoContacto", 
    "fotoUrl", "observacionesSalud", "idSede", "idTipoDoc", "estado"
})
public class Alumnos {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_alumno")
    private Long idAlumno;

    @Column(name = "numero_documento", length = 20)
    private String numeroDocumento;
    @Column(length = 100)
    private String nombres;
    @Column(length = 100)
    private String apellidos;
    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;
    @Column(length = 1)
    private String genero;
    @Column(length = 255)
    private String direccion;
    @Column(name = "telefono_contacto", length = 20)
    private String telefonoContacto;
    @Column(name = "foto_url", length = 255)
    private String fotoUrl;
    @Column(name = "observaciones_salud", columnDefinition = "TEXT")
    private String observacionesSalud;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="id_sede")
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    private Sedes idSede;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="id_tipo_doc")
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    private TipoDocumentos idTipoDoc;

    private Integer estado = 1;

    //Constructor vacio
    public Alumnos() {
    }
    public Alumnos(Long idAlumno) {
        this.idAlumno = idAlumno;
    }

    //Getters y Setters / ToString
    public Long getIdAlumno() {
        return idAlumno;
    }
    public void setIdAlumno(Long idAlumno) {
        this.idAlumno = idAlumno;
    }
    public String getNumeroDocumento() {
        return numeroDocumento;
    }
    public void setNumeroDocumento(String numeroDocumento) {
        this.numeroDocumento = numeroDocumento;
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
    public LocalDate getFechaNacimiento() {
        return fechaNacimiento;
    }
    public void setFechaNacimiento(LocalDate fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
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
    public String getTelefonoContacto() {
        return telefonoContacto;
    }
    public void setTelefonoContacto(String telefonoContacto) {
        this.telefonoContacto = telefonoContacto;
    }
    public String getFotoUrl() {
        return fotoUrl;
    }
    public void setFotoUrl(String fotoUrl) {
        this.fotoUrl = fotoUrl;
    }
    public String getObservacionesSalud() {
        return observacionesSalud;
    }
    public void setObservacionesSalud(String observacionesSalud) {
        this.observacionesSalud = observacionesSalud;
    }
    public Sedes getIdSede() {
        return idSede;
    }
    public void setIdSede(Sedes idSede) {
        this.idSede = idSede;
    }
    public TipoDocumentos getIdTipoDoc() {
        return idTipoDoc;
    }
    public void setIdTipoDoc(TipoDocumentos idTipoDoc) {
        this.idTipoDoc = idTipoDoc;
    }
    public Integer getEstado() {
        return estado;
    }
    public void setEstado(Integer estado) {
        this.estado = estado;
    }
    @Override
    public String toString() {
        return "Alumnos [idAlumno=" + idAlumno + ", numeroDocumento=" + numeroDocumento + ", nombres=" + nombres
                + ", apellidos=" + apellidos + ", fechaNacimiento=" + fechaNacimiento + ", genero=" + genero
                + ", direccion=" + direccion + ", telefonoContacto=" + telefonoContacto + ", fotoUrl=" + fotoUrl
                + ", observacionesSalud=" + observacionesSalud + ", idSede=" + idSede + ", idTipoDoc=" + idTipoDoc 
                + ", estado=" + estado + "]";
    }
}