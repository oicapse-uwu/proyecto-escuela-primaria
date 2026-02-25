package com.escuelita.www.entity;

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
@Table(name = "apoderados")
@SQLDelete(sql = "UPDATE apoderados SET estado=0 WHERE id_apoderado=?")
@SQLRestriction("estado = 1")
@JsonPropertyOrder({
    "idApoderado", "numeroDocumento", "nombres", "apellidos", 
    "telefonoPrincipal", "correo", "lugarTrabajo",
    "idSede", "idTipoDoc", "estado"
})
public class Apoderados {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_apoderado")
    private Long idApoderado;    
    @Column(name = "numero_documento", length = 20)
    private String numeroDocumento;
    @Column(length = 100)
    private String nombres;
    @Column(length = 100)
    private String apellidos;
    @Column(name = "telefono_principal", length = 20)
    private String telefonoPrincipal;
    @Column(length = 100)
    private String correo;
    @Column(name = "lugar_trabajo", length = 100)
    private String lugarTrabajo;

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
    public Apoderados() {
    }
    public Apoderados(Long idApoderado) {
        this.idApoderado = idApoderado;
    }

    //Getters y Setters / ToString
    public Long getIdApoderado() {
        return idApoderado;
    }
    public void setIdApoderado(Long idApoderado) {
        this.idApoderado = idApoderado;
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
    public String getTelefonoPrincipal() {
        return telefonoPrincipal;
    }
    public void setTelefonoPrincipal(String telefonoPrincipal) {
        this.telefonoPrincipal = telefonoPrincipal;
    }
    public String getCorreo() {
        return correo;
    }
    public void setCorreo(String correo) {
        this.correo = correo;
    }
    public String getLugarTrabajo() {
        return lugarTrabajo;
    }
    public void setLugarTrabajo(String lugarTrabajo) {
        this.lugarTrabajo = lugarTrabajo;
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
        return "Apoderados [idApoderado=" + idApoderado + ", numeroDocumento=" + numeroDocumento + ", nombres="
                + nombres + ", apellidos=" + apellidos + ", telefonoPrincipal=" + telefonoPrincipal + ", correo="
                + correo + ", lugarTrabajo=" + lugarTrabajo + ", idSede=" + idSede
                + ", idTipoDoc=" + idTipoDoc + ", estado=" + estado + "]";
    }
}