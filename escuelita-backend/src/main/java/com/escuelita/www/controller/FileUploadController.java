package com.escuelita.www.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/restful/files")
@CrossOrigin(origins = "*")
public class FileUploadController {
    
    // Directorio donde se guardarán los archivos subidos
    private static final String UPLOAD_DIR = "uploads/logos/";
    
    /**
     * Endpoint para subir imágenes/archivos
     * POST /restful/files/upload
     */
    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            // Validar que el archivo no esté vacío
            if (file.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("mensaje", "El archivo está vacío");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Validar tipo de archivo (solo imágenes)
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                Map<String, String> error = new HashMap<>();
                error.put("mensaje", "Solo se permiten archivos de imagen");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Validar tamaño (máximo 5MB)
            if (file.getSize() > 5 * 1024 * 1024) {
                Map<String, String> error = new HashMap<>();
                error.put("mensaje", "El archivo no debe superar los 5MB");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Crear directorio si no existe
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            // Generar nombre único para el archivo
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String uniqueFilename = UUID.randomUUID().toString() + extension;
            
            // Guardar archivo
            Path filePath = uploadPath.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // Construir URL del archivo
            String fileUrl = "/uploads/logos/" + uniqueFilename;
            
            // Respuesta exitosa
            Map<String, Object> response = new HashMap<>();
            response.put("mensaje", "Archivo subido exitosamente");
            response.put("nombreArchivo", uniqueFilename);
            response.put("nombreOriginal", originalFilename);
            response.put("url", fileUrl);
            response.put("tamaño", file.getSize());
            response.put("tipo", contentType);
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            Map<String, String> error = new HashMap<>();
            error.put("mensaje", "Error al guardar el archivo: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
