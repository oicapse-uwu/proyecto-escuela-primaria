package com.escuelita.www.security;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;

@Component
public class JwtUtil {
    private final SecretKey key = Jwts.SIG.HS256.key().build();
    private final long EXPIRATION_TIME = 100L*365*24*60*60*1000;

    public String generarToken(String clienteId){
        return Jwts.builder()
            .subject(clienteId)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() 
                    + EXPIRATION_TIME))
            .signWith(key)
            .compact();    
    }
    public boolean validarToken(String token){
        try {
            Jwts.parser().verifyWith(key).build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    
    public String extraerClienteId(String token){
        return Jwts.parser().verifyWith(key).build()
                    .parseSignedClaims(token).getPayload().getSubject();
    }
}
