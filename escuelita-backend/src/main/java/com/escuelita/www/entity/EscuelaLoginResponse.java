package com.escuelita.www.entity;

public class EscuelaLoginResponse {
    private String token;
    private UsuarioEscuelaDTO usuario;

    // Constructor vacío
    public EscuelaLoginResponse() {
    }
    public EscuelaLoginResponse(String token, UsuarioEscuelaDTO usuario) {
        this.token = token;
        this.usuario = usuario;
    }

    // Getters y Setters
    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }
    public UsuarioEscuelaDTO getUsuario() {
        return usuario;
    }
    public void setUsuario(UsuarioEscuelaDTO usuario) {
        this.usuario = usuario;
    }
}
