package com.escuelita.www.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordGenerator {
    
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        // Cambia estas contraseñas por las que necesites
        String[] passwords = {
            "admin123",
            "password123",
            "superadmin2024"
        };
        
        System.out.println("=".repeat(60));
        System.out.println("GENERADOR DE PASSWORDS ENCRIPTADAS");
        System.out.println("=".repeat(60));
        System.out.println();
        
        for (String password : passwords) {
            String encoded = encoder.encode(password);
            System.out.println("Password original: " + password);
            System.out.println("Password encriptada: " + encoded);
            System.out.println("-".repeat(60));
        }
        
        System.out.println();
        System.out.println("Copia el hash y úsalo en tu INSERT de super_admins");
        System.out.println();
        
        // Ejemplo de INSERT
        System.out.println("Ejemplo de INSERT:");
        System.out.println("INSERT INTO super_admins (nombres, apellidos, correo, usuario, password, rol_plataforma, estado)");
        System.out.println("VALUES ('Admin', 'Sistema', 'admin@escuela.com', 'admin', '" + encoder.encode("admin123") + "', 'SUPER_ADMIN', 1);");
    }
}
