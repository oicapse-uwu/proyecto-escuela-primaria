package com.escuelita.www.entity;

public class LoginResponse {
    private String token;
    private SuperAdminDTO usuario;

    // Constructor vacío
    public LoginResponse() {
    }
    public LoginResponse(String token, SuperAdminDTO usuario) {
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
    public SuperAdminDTO getUsuario() {
        return usuario;
    }
    public void setUsuario(SuperAdminDTO usuario) {
        this.usuario = usuario;
    }
}
