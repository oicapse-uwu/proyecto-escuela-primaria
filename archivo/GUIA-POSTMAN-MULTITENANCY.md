# 🚀 Guía para usar Postman con Multi-Tenancy

## ✅ Resumen: ¿Puedo seguir usando Postman?

**SÍ, absolutamente.** Los métodos GET, POST, PUT y DELETE funcionan igual. La **única diferencia** es que ahora el token JWT incluye información de la sede del usuario, y el backend valida automáticamente que solo accedas a datos de tu sede.

---

## 📝 Configuración en Postman

### **Opción 1: Trabajar como Usuario de Escuela (CON restricción de sede)**

#### **Paso 1: Login**

```http
POST http://localhost:8080/api/escuela/auth/login
Content-Type: application/json

{
  "usuario": "director01",
  "contrasena": "password123"
}
```

**Respuesta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJFU0NVRUxBXzEyM19TRURFXDQ1In0.xyz...",
  "usuario": {
    "idUsuario": 123,
    "nombres": "Juan",
    "apellidos": "Pérez",
    "idSede": {
      "idSede": 45,
      "nombreSede": "Sede Norte"
    }
  }
}
```

#### **Paso 2: Copiar el token**

Copia el valor del campo `token`.

#### **Paso 3: Configurar Authorization en Postman**

En cada request (GET, POST, PUT, DELETE):

1. Ve a la pestaña **Authorization**
2. Type: **Bearer Token**
3. Token: Pega el token que copiaste

O agrega el header manualmente:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJFU0NVRUxBXzEyM19TRURFXDQ1In0.xyz...
```

#### **Paso 4: Hacer tus requests normalmente**

✅ **GET - Listar alumnos de tu sede**
```http
GET http://localhost:8080/api/alumnos
Authorization: Bearer [tu_token]
```
Solo verás alumnos de la sede 45 (tu sede).

✅ **POST - Crear alumno**
```http
POST http://localhost:8080/api/alumnos
Authorization: Bearer [tu_token]
Content-Type: application/json

{
  "nombres": "María",
  "apellidos": "García",
  "numeroDocumento": "12345678",
  "idSede": {
    "idSede": 45  // ⚠️ IMPORTANTE: Debe ser TU sede
  }
}
```

✅ **PUT - Actualizar alumno**
```http
PUT http://localhost:8080/api/alumnos/10
Authorization: Bearer [tu_token]
Content-Type: application/json

{
  "idAlumno": 10,
  "nombres": "María Actualizada",
  "apellidos": "García"
}
```

✅ **DELETE - Eliminar alumno**
```http
DELETE http://localhost:8080/api/alumnos/10
Authorization: Bearer [tu_token]
```

---

### **Opción 2: Trabajar como Super Admin (SIN restricción de sede)**

Si quieres probar **sin restricciones** y acceder a datos de todas las sedes:

#### **Paso 1: Login como Super Admin**

```http
POST http://localhost:8080/api/admin/auth/login
Content-Type: application/json

{
  "usuario": "superadmin",
  "contrasena": "admin123"
}
```

**Respuesta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJTVVBFUl9BRE1JTl8xIn0.abc...",
  "usuario": {
    "idUsuario": 1,
    "nombres": "Admin",
    "apellidos": "Sistema",
    "rol": {
      "nombreRol": "Super Administrador"
    }
  }
}
```

#### **Paso 2: Usar ese token**

Ahora con el token de Super Admin:

✅ **Verás TODOS los datos** (de todas las sedes)
```http
GET http://localhost:8080/api/alumnos
Authorization: Bearer [token_superadmin]
```

✅ **Podrás crear/modificar/eliminar** sin restricciones
```http
POST http://localhost:8080/api/alumnos
Authorization: Bearer [token_superadmin]

{
  "nombres": "Pedro",
  "idSede": {
    "idSede": 99  // ✅ Puedes usar CUALQUIER sede
  }
}
```

---

## 🚨 Errores comunes y soluciones

### ❌ Error: "No tienes permiso para crear alumnos en esta sede"

**Causa:** Estás intentando crear un registro en una sede diferente a la tuya.

**Solución:** 
- Verifica que el `idSede` en tu JSON coincida con tu sede
- O usa un token de Super Admin

**Ejemplo:**
```json
// Tu token es de la sede 45
// ❌ MAL:
{
  "idSede": { "idSede": 99 }  // Sede diferente
}

// ✅ BIEN:
{
  "idSede": { "idSede": 45 }  // Tu sede
}
```

---

### ❌ Error: "401 Unauthorized"

**Causa:** Token inválido o expirado.

**Solución:** 
1. Haz login nuevamente
2. Copia el nuevo token
3. Actualiza el token en Postman

---

### ❌ No veo todos los registros

**Causa:** Estás usando un token de usuario de escuela (solo ves tu sede).

**Solución:** 
- Esto es normal y esperado
- Si necesitas ver todo, usa un token de Super Admin

---

## 🎯 Tips para testing en Postman

### **1. Crear una Collection con Variables**

En Postman, crea variables de entorno:

```
baseUrl = http://localhost:8080
token_escuela = [tu_token_de_escuela]
token_admin = [tu_token_de_superadmin]
sede_id = 45
```

Luego en tus requests:
```http
GET {{baseUrl}}/api/alumnos
Authorization: Bearer {{token_escuela}}
```

### **2. Script para guardar el token automáticamente**

En la request de login, agrega este script en la pestaña **Tests**:

```javascript
// Guardar el token automáticamente
var jsonData = pm.response.json();
pm.environment.set("token", jsonData.token);
pm.environment.set("sedeId", jsonData.usuario.idSede.idSede);
```

Ahora el token se guardará automáticamente después del login.

### **3. Crear dos usuarios de prueba**

Recomiendo tener:

1. **Usuario de escuela** - Para probar restricciones por sede
2. **Super Admin** - Para probar sin restricciones

---

## 📊 Comparación: Antes vs Ahora

| Aspecto | Antes | Ahora |
|---------|-------|-------|
| **Hacer login** | ✅ Igual | ✅ Igual |
| **Obtener token** | ✅ Igual | ✅ Igual |
| **GET requests** | ✅ Veías todo | ✅ Solo ves tu sede* |
| **POST requests** | ✅ Podías crear en cualquier sede | ✅ Solo en tu sede* |
| **PUT requests** | ✅ Podías modificar cualquier registro | ✅ Solo de tu sede* |
| **DELETE requests** | ✅ Podías eliminar cualquier registro | ✅ Solo de tu sede* |

*\*Con Super Admin, sigues viendo y modificando todo*

---

## ✅ Conclusión

**Puedes seguir trabajando con Postman exactamente igual.** La única diferencia es:

1. **Haces login** → Obtienes token
2. **Usas ese token** → El sistema sabe tu sede automáticamente
3. **Haces tus requests** → Solo ves/modificas datos de tu sede

Si necesitas probar sin restricciones, simplemente **usa el login de Super Admin** y tendrás acceso completo como antes.

**Todo funciona, solo es más seguro ahora.** 🎉
