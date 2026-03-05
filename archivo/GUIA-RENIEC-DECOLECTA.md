# Integración API Decolecta - RENIEC

Esta documentación explica cómo usar la integración con la API de Decolecta para consultar datos de RENIEC (DNI peruano).

## 🚀 Configuración Inicial

### Backend (Spring Boot)

1. **Configurar el token de Decolecta** en `application.properties`:
```properties
decolecta.api.url=https://api.decolecta.com/v1
decolecta.api.token=TU_TOKEN_REAL_AQUI
```

⚠️ **IMPORTANTE**: Reemplaza `TU_TOKEN_REAL_AQUI` con tu token real de Decolecta.

### Frontend (React)

No requiere configuración adicional. El frontend se comunica con tu propio backend.

---

## 📡 API Endpoints

### Backend - Consultar DNI

**Endpoint**: `GET /api/reniec/dni/{dni}`

**Ejemplo**:
```
GET http://localhost:4040/api/reniec/dni/46027897
```

**Respuesta Exitosa (200)**:
```json
{
  "first_name": "ROXANA KARINA",
  "first_last_name": "DELGADO",
  "second_last_name": "HUAMANI",
  "full_name": "DELGADO HUAMANI ROXANA KARINA",
  "document_number": "46027897"
}
```

**Respuesta de Error (400)**:
```json
{
  "error": "DNI inválido. Debe contener 8 dígitos"
}
```

---

## 💻 Uso en el Frontend

### Opción 1: Usando el Hook `useReniec` (Recomendado)

```tsx
import { useReniec } from '../hooks/useReniec';

function MiComponente() {
    const { data, loading, error, consultarDni } = useReniec();

    const handleBuscar = async () => {
        await consultarDni('46027897');
    };

    return (
        <div>
            <button onClick={handleBuscar} disabled={loading}>
                {loading ? 'Consultando...' : 'Buscar DNI'}
            </button>

            {error && <div className="error">{error}</div>}

            {data && (
                <div>
                    <p>Nombres: {data.first_name}</p>
                    <p>Apellido Paterno: {data.first_last_name}</p>
                    <p>Apellido Materno: {data.second_last_name}</p>
                </div>
            )}
        </div>
    );
}
```

### Opción 2: Usando el Servicio Directamente

```tsx
import { reniecService } from '../services/reniec.service';

async function buscarPersona(dni: string) {
    try {
        const data = await reniecService.consultarDni(dni);
        console.log('Datos:', data);
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}
```

---

## 🎯 Ejemplos de Uso Práctico

### Ejemplo 1: Autocompletar datos en formulario de registro

```tsx
import { useState } from 'react';
import { useReniec } from '../hooks/useReniec';

function FormularioAlumno() {
    const [dni, setDni] = useState('');
    const [nombres, setNombres] = useState('');
    const [apellidoPaterno, setApellidoPaterno] = useState('');
    const [apellidoMaterno, setApellidoMaterno] = useState('');
    
    const { data, loading, error, consultarDni } = useReniec();

    const handleConsultarDni = async () => {
        await consultarDni(dni);
    };

    // Auto-llenar campos cuando se obtienen datos
    useEffect(() => {
        if (data) {
            setNombres(data.first_name);
            setApellidoPaterno(data.first_last_name);
            setApellidoMaterno(data.second_last_name);
        }
    }, [data]);

    return (
        <form>
            <input
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                placeholder="DNI"
                maxLength={8}
            />
            <button 
                type="button" 
                onClick={handleConsultarDni}
                disabled={loading || dni.length !== 8}
            >
                {loading ? '🔄 Consultando...' : '🔍 Buscar'}
            </button>

            {error && <div className="text-red-500">{error}</div>}

            <input value={nombres} onChange={(e) => setNombres(e.target.value)} placeholder="Nombres" />
            <input value={apellidoPaterno} onChange={(e) => setApellidoPaterno(e.target.value)} placeholder="Apellido Paterno" />
            <input value={apellidoMaterno} onChange={(e) => setApellidoMaterno(e.target.value)} placeholder="Apellido Materno" />
        </form>
    );
}
```

### Ejemplo 2: Validar DNI antes de guardar

```tsx
async function validarYGuardarAlumno(alumnoData: any) {
    try {
        // Verificar que el DNI existe en RENIEC
        const datosReniec = await reniecService.consultarDni(alumnoData.dni);
        
        // Comparar nombres (opcional)
        if (datosReniec.first_name !== alumnoData.nombres) {
            console.warn('Los nombres no coinciden con RENIEC');
        }

        // Continuar con el guardado
        await guardarAlumno(alumnoData);
    } catch (error) {
        alert('DNI no válido o no encontrado en RENIEC');
    }
}
```

---

## 🔧 Componentes Creados

1. **`ReniecController.java`**: Controlador REST en backend
2. **`DecolectaService.java`**: Servicio para llamadas a la API externa
3. **`ReniecResponseDTO.java`**: DTO para la respuesta
4. **`reniec.service.ts`**: Servicio en el frontend
5. **`useReniec.ts`**: Hook personalizado React
6. **`ConsultaDniExample.tsx`**: Componente de ejemplo

---

## ⚡ Cómo Funciona

```
┌─────────┐         ┌─────────────┐         ┌──────────────┐
│         │ ─────▶  │   Backend   │ ─────▶  │  Decolecta   │
│ Frontend│         │ Spring Boot │         │     API      │
│         │ ◀───── │    (Java)   │ ◀───── │   (RENIEC)   │
└─────────┘         └─────────────┘         └──────────────┘
```

**Flujo**:
1. Frontend hace petición a TU backend: `GET /api/reniec/dni/12345678`
2. Backend recibe la petición y llama a Decolecta con tu token
3. Decolecta consulta RENIEC y devuelve los datos
4. Backend procesa y devuelve al frontend

**Ventajas**:
- ✅ El token de Decolecta NO se expone al cliente
- ✅ Mayor seguridad
- ✅ Control centralizado de las llamadas
- ✅ Puedes agregar logs, caché, validaciones, etc.

---

## 🛡️ Seguridad

- **NUNCA** expongas el token de Decolecta en el frontend
- El token está en `application.properties` (backend)
- Puedes usar variables de entorno en producción:
  ```bash
  export DECOLECTA_TOKEN="tu_token_aqui"
  ```
  Y en `application.properties`:
  ```properties
  decolecta.api.token=${DECOLECTA_TOKEN}
  ```

---

## 🧪 Pruebas

### Probar Backend directamente:
```bash
curl -X GET "http://localhost:4040/api/reniec/dni/46027897" \
  -H "Authorization: Bearer TU_TOKEN_JWT"
```

### Probar desde Postman:
- URL: `http://localhost:4040/api/reniec/dni/46027897`
- Método: GET
- Headers: `Authorization: Bearer TU_TOKEN_JWT`

---

## ❓ Preguntas Frecuentes

**P: ¿Necesito instalar algo más?**  
R: No, Spring Boot ya incluye todo lo necesario para HTTP calls.

**P: ¿Dónde consigo el token de Decolecta?**  
R: Debes registrarte en https://decolecta.com y obtener tu API key.

**P: ¿Puedo usar esto en otros formularios?**  
R: Sí, el hook `useReniec` y el servicio son reutilizables en cualquier componente.

**P: ¿Qué pasa si el DNI no existe?**  
R: La API devuelve un error 400, manejado como una excepción en el frontend.

---

## 📝 Notas Adicionales

- El DNI peruano tiene 8 dígitos
- La validación se hace tanto en frontend como backend
- Los datos de RENIEC son los oficiales del gobierno peruano
- Puedes extender `ReniecResponseDTO` si Decolecta devuelve más campos

---

## 🎨 Próximos Pasos

1. Integra `useReniec` en tus formularios de alumnos
2. Integra en formularios de apoderados
3. Agrega caché para evitar consultas repetidas
4. Implementa rate limiting si es necesario

---

**¿Más preguntas?** Consulta la documentación oficial de Decolecta: https://docs.decolecta.com
