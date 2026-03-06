package com.escuelita.www.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;

/**
 * Servicio para almacenamiento y gestión de archivos (comprobantes, imágenes, etc.)
 */
@Service
public class FileStorageService {
    
    private final Path rootLocation = Paths.get("uploads");
    private final Path comprobantesLocation = Paths.get("uploads/comprobantes/suscripciones");
    
    /**
     * Inicializar directorios al arrancar la aplicación
     */
    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(rootLocation);
            Files.createDirectories(comprobantesLocation);
        } catch (IOException e) {
            throw new RuntimeException("No se pudo crear el directorio de uploads: " + e.getMessage());
        }
    }
    
    /**
     * Guardar comprobante de pago de suscripción
     * @param file Archivo a guardar
     * @return Nombre del archivo guardado (con UUID para evitar duplicados)
     */
    public String guardarComprobanteSuscripcion(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("El archivo está vacío");
        }
        
        // Validar tipo de archivo (solo imágenes y PDF)
        String contentType = file.getContentType();
        if (contentType == null || 
            (!contentType.startsWith("image/") && !contentType.equals("application/pdf"))) {
            throw new IOException("Solo se permiten imágenes o archivos PDF");
        }
        
        // Limpiar el nombre del archivo y agregar UUID para evitar duplicados
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String extension = "";
        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex > 0) {
            extension = originalFilename.substring(dotIndex);
        }
        
        String filename = UUID.randomUUID().toString() + extension;
        
        // Guardar archivo
        Path targetLocation = comprobantesLocation.resolve(filename);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
        
        return filename;
    }
    
    /**
     * Cargar archivo como Resource
     * @param filename Nombre del archivo
     * @param carpeta Carpeta donde buscar (ej: "comprobantes/suscripciones")
     * @return Resource del archivo
     */
    public Resource cargarArchivo(String filename, String carpeta) throws IOException {
        try {
            Path file = rootLocation.resolve(carpeta).resolve(filename).normalize();
            Resource resource = new UrlResource(file.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new IOException("No se pudo leer el archivo: " + filename);
            }
        } catch (Exception e) {
            throw new IOException("Error al cargar el archivo: " + filename, e);
        }
    }
    
    /**
     * Eliminar archivo
     * @param filename Nombre del archivo
     * @param carpeta Carpeta donde está el archivo
     */
    public void eliminarArchivo(String filename, String carpeta) throws IOException {
        try {
            Path file = rootLocation.resolve(carpeta).resolve(filename).normalize();
            Files.deleteIfExists(file);
        } catch (IOException e) {
            throw new IOException("Error al eliminar el archivo: " + filename, e);
        }
    }
    
    /**
     * Obtener URL relativa del comprobante
     * @param filename Nombre del archivo
     * @return URL relativa (ej: /uploads/comprobantes/suscripciones/abc123.jpg)
     */
    public String obtenerUrlComprobante(String filename) {
        return "/uploads/comprobantes/suscripciones/" + filename;
    }
}
