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
    private static final String UPLOAD_DOCS_DIR = "uploads/documentos/";
    private static final String UPLOAD_PERFILES_DIR = "uploads/perfiles/";
    
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
            
            // Validar tamaño (máximo 15MB)
            if (file.getSize() > 15 * 1024 * 1024) {
                Map<String, String> error = new HashMap<>();
                error.put("mensaje", "El archivo no debe superar los 15MB");
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

    /**
     * Endpoint para subir documentos de alumnos (PDF, imágenes, Word)
     * POST /restful/files/upload/document
     */
    @PostMapping("/upload/document")
    public ResponseEntity<?> uploadDocument(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("mensaje", "El archivo está vacío");
                return ResponseEntity.badRequest().body(error);
            }

            String contentType = file.getContentType();
            boolean tipoValido = contentType != null && (
                contentType.startsWith("image/") ||
                contentType.equals("application/pdf") ||
                contentType.equals("application/msword") ||
                contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document")
            );
            if (!tipoValido) {
                Map<String, String> error = new HashMap<>();
                error.put("mensaje", "Solo se permiten imágenes, PDF o documentos Word");
                return ResponseEntity.badRequest().body(error);
            }

            if (file.getSize() > 50 * 1024 * 1024) {
                Map<String, String> error = new HashMap<>();
                error.put("mensaje", "El archivo no debe superar los 50MB");
                return ResponseEntity.badRequest().body(error);
            }

            Path uploadPath = Paths.get(UPLOAD_DOCS_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String uniqueFilename = UUID.randomUUID().toString() + extension;

            Path filePath = uploadPath.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = "/uploads/documentos/" + uniqueFilename;

            Map<String, Object> response = new HashMap<>();
            response.put("mensaje", "Documento subido exitosamente");
            response.put("nombreArchivo", uniqueFilename);
            response.put("nombreOriginal", originalFilename);
            response.put("url", fileUrl);
            response.put("tamaño", file.getSize());
            response.put("tipo", contentType);

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            Map<String, String> error = new HashMap<>();
            error.put("mensaje", "Error al guardar el documento: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Endpoint para subir fotos de perfil (alumnos, admins)
     * POST /restful/files/upload/avatar
     */
    @PostMapping("/upload/avatar")
    public ResponseEntity<?> uploadAvatar(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("mensaje", "El archivo est\u00e1 vac\u00edo");
                return ResponseEntity.badRequest().body(error);
            }

            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                Map<String, String> error = new HashMap<>();
                error.put("mensaje", "Solo se permiten archivos de imagen");
                return ResponseEntity.badRequest().body(error);
            }

            if (file.getSize() > 15 * 1024 * 1024) {
                Map<String, String> error = new HashMap<>();
                error.put("mensaje", "La imagen no debe superar los 15MB");
                return ResponseEntity.badRequest().body(error);
            }

            Path uploadPath = Paths.get(UPLOAD_PERFILES_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String uniqueFilename = UUID.randomUUID().toString() + extension;

            Path filePath = uploadPath.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = "/uploads/perfiles/" + uniqueFilename;

            Map<String, Object> response = new HashMap<>();
            response.put("mensaje", "Foto de perfil subida exitosamente");
            response.put("nombreArchivo", uniqueFilename);
            response.put("nombreOriginal", originalFilename);
            response.put("url", fileUrl);
            response.put("tama\u00f1o", file.getSize());
            response.put("tipo", contentType);

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            Map<String, String> error = new HashMap<>();
            error.put("mensaje", "Error al guardar la foto: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
