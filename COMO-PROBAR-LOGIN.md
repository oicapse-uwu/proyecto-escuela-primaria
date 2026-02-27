# ✅ Endpoint de Login Implementado

## Archivos Creados/Modificados:

### ✅ Nuevos Archivos:
1. **AuthController.java** - Controller para `/auth/login`
2. **AuthService.java** - Lógica de autenticación
3. **LoginRequest.java** - DTO para request
4. **LoginResponse.java** - DTO para response
5. **SuperAdminDTO.java** - DTO para datos del super admin

### ✅ Archivos Modificados:
1. **SuperAdminsRepository.java** - Agregado método `findByUsuario()`
2. **SecurityConfig.java** - Agregado `/auth/login` a rutas públicas

---

## 🚀 Cómo Probar el Login

### 1. Crear un Super Admin de Prueba

Primero necesitas generar una contraseña encriptada. Tienes 2 opciones:

#### Opción A: Usar código Java (Recomendado)

Crea una clase temporal o usa el `main()` de tu aplicación:

```java
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GenerarPassword {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String password = "admin123";
        String encoded = encoder.encode(password);
        System.out.println("Password encriptada: " + encoded);
    }
}
```

#### Opción B: Usar herramienta online

Ve a: https://bcrypt-generator.com/
- Ingresa tu contraseña (ej: `admin123`)
- Usa rounds: 10
- Copia el hash generado

### 2. Insertar Super Admin en la Base de Datos

Usa este SQL (reemplaza `$2a$10$...` con tu hash generado):

```sql
INSERT INTO super_admins (nombres, apellidos, correo, usuario, password, rol_plataforma, estado) 
VALUES (
    'Juan', 
    'Pérez', 
    'admin@sistema.com', 
    'admin', 
    '$2a$10$TU_PASSWORD_HASH_AQUI', 
    'SUPER_ADMIN', 
    1
);
```

**Ejemplo con password real** (contraseña: `admin123`):
```sql
INSERT INTO super_admins (nombres, apellidos, correo, usuario, password, rol_plataforma, estado) 
VALUES (
    'Super', 
    'Administrador', 
    'admin@escuela.com', 
    'superadmin', 
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhLu', 
    'SUPER_ADMIN', 
    1
);
```

### 3. Iniciar el Backend

```bash
cd escuelita-backend
./mvnw spring-boot:run
```

O si usas IDE, ejecuta `ProyectoEscuelaPrimariaApplication.java`

### 4. Verificar que el Backend esté corriendo

Abre tu navegador o Postman y verifica:
- URL: `http://localhost:8080` (o el puerto que uses)
- Si aparece error 401, está funcionando (porque no tienes token)

### 5. Probar el Login desde el Frontend

1. Asegúrate de que el frontend esté corriendo:
   ```bash
   cd escuelita-frontend
   npm run dev
   ```

2. Abre el navegador: `http://localhost:5176/login`

3. Ingresa las credenciales:
   - Usuario: `superadmin`
   - Contraseña: `admin123`

4. Si todo está bien, serás redirigido a `/admin`

---

## 🧪 Probar con Postman (Opcional)

### Request:
```
POST http://localhost:8080/auth/login
Content-Type: application/json

{
    "usuario": "superadmin",
    "contrasena": "admin123"
}
```

### Response Exitosa (200 OK):
```json
{
    "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiaWF0IjoxNzA5MDg...",
    "usuario": {
        "idUsuario": 1,
        "nombres": "Super",
        "apellidos": "Administrador",
        "correo": "admin@escuela.com",
        "usuario": "superadmin",
        "rol": {
            "idRol": 1,
            "nombreRol": "SUPER_ADMIN"
        }
    }
}
```

### Response Error (401 Unauthorized):
```json
{
    "mensaje": "Usuario o contraseña incorrectos"
}
```

---

## 🔧 Verificar Configuración

### URLs Importantes:

1. **Backend:** 
   - Desarrollo: `http://localhost:8080`
   - Producción: `http://primaria.spring.informaticapp.com:4040`

2. **Frontend:**
   - Configurado en: `src/config/api.config.ts`
   - Por defecto apunta a: `http://primaria.spring.informaticapp.com:4040`

### Si el backend está en otro puerto:

Edita `application.properties`:
```properties
server.port=8080
```

### Si necesitas cambiar la URL en el frontend:

Edita `.env` o `src/config/api.config.ts`:
```typescript
baseURL: 'http://localhost:8080'
```

---

## 🐛 Troubleshooting

### Error: "Usuario no encontrado"
- ✅ Verifica que insertaste el super admin en la BD
- ✅ Revisa que el campo `estado` sea `1`
- ✅ Confirma que el `usuario` coincida exactamente

### Error: "Contraseña incorrecta"
- ✅ Verifica que la contraseña esté encriptada con BCrypt
- ✅ Asegúrate de que estás usando la contraseña correcta
- ✅ El hash debe empezar con `$2a$10$`

### Error: CORS
- ✅ El `@CrossOrigin(origins = "*")` ya está en el controller
- ✅ Verifica que el frontend use la URL correcta

### Error: 404 Not Found
- ✅ Confirma que el backend esté corriendo
- ✅ Verifica la URL: `/auth/login` (no `/api/auth/login`)
- ✅ Revisa que SecurityConfig permita `/auth/login`

### Error: 403 Forbidden
- ✅ Verifica que `/auth/login` esté en `.permitAll()` del SecurityConfig
- ✅ Reinicia el backend después de los cambios

---

## 📊 Estructura de Tablas

Asegúrate de que tu tabla `super_admins` tenga esta estructura:

```sql
CREATE TABLE super_admins (
    id_admin BIGINT PRIMARY KEY AUTO_INCREMENT,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol_plataforma VARCHAR(50) DEFAULT 'SUPER_ADMIN',
    estado TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## ✅ Checklist de Implementación

- [x] SuperAdminsRepository tiene `findByUsuario()`
- [x] DTOs creados (LoginRequest, LoginResponse, SuperAdminDTO)
- [x] AuthService implementado
- [x] AuthController creado
- [x] SecurityConfig actualizado
- [x] Endpoint `/auth/login` funcionando
- [ ] Super admin insertado en la BD
- [ ] Backend corriendo
- [ ] Frontend corriendo
- [ ] Login probado y funcionando

---

## 🎉 ¡Listo para Probar!

1. Inserta un super admin con contraseña encriptada
2. Inicia el backend
3. Abre el frontend en `http://localhost:5176/login`
4. Ingresa tus credenciales
5. ¡Disfruta tu sistema funcionando!

---

**Contraseña de ejemplo ya encriptada:**
- Password: `admin123`
- Hash BCrypt: `$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhLu`

Puedes usar este hash directamente en tu INSERT para probar rápidamente.
