# 📚 ANÁLISIS: MALLA CURRICULAR, ASIGNACIÓN DOCENTE Y HORARIOS

## 🎯 RESUMEN EJECUTIVO

Este documento analiza los 3 módulos restantes de **Gestión Académica** y proporciona recomendaciones sobre su necesidad, funcionamiento y posibles mejoras.

---

## 1️⃣ MALLA CURRICULAR

### 🤔 ¿Qué es?

La **Malla Curricular** define qué cursos debe llevar cada grado en un año escolar específico. Por ejemplo:
- **1ro de Primaria** en 2026 lleva: Aritmética, Gramática, Inglés Básico, etc.
- **2do de Primaria** en 2026 lleva: Álgebra, Comprensión Lectora, etc.

### 📊 Estructura Actual

```sql
malla_curricular (
    id_malla,
    id_anio,        -- Año escolar (2026, 2027, etc.)
    id_grado,       -- Grado (1ro, 2do, 3ro, etc.)
    id_curso,       -- Curso específico (Aritmética, Álgebra, etc.)
    estado
)
```

### 🇵🇪 ¿La manda MINEDU?

**NO exactamente.** MINEDU manda:

1. **Las 8 áreas obligatorias** ✅ (Ya las tenemos globales)
   - Matemática, Comunicación, Inglés, etc.

2. **Competencias y capacidades por área** 📋
   - Qué debe saber un alumno al final de cada ciclo
   - Estándares de aprendizaje

3. **Horas mínimas por área** ⏱️
   - Ejemplo: Matemática mínimo 5 horas semanales

**LO QUE NO MANDA:**
- ❌ Los nombres exactos de los cursos (Aritmética vs Razonamiento Matemático)
- ❌ Cómo divides las áreas en cursos específicos
- ❌ La malla curricular detallada

### ✅ ¿Es Necesaria?

**SÍ, es muy útil**, pero con modificaciones:

**POR QUÉ SÍ:**
- ✅ Define el plan de estudios de tu colegio
- ✅ Cada sede puede tener mallas diferentes (unos enseñan Aritmética separada, otros junto con Álgebra)
- ✅ Permite cambiar la oferta académica por año
- ✅ Base para crear asignaciones docentes y matrículas

**PROBLEMA ACTUAL:**
❌ No tiene `id_sede` - **DEBE AGREGARSE** igual que hicimos con cursos

### 🔧 MEJORA RECOMENDADA

```sql
-- AGREGAR id_sede a malla_curricular
ALTER TABLE malla_curricular 
ADD COLUMN id_sede bigint(20) UNSIGNED NOT NULL AFTER id_malla;

-- Agregar FK
ALTER TABLE malla_curricular 
ADD CONSTRAINT fk_malla_sedes 
FOREIGN KEY (id_sede) REFERENCES sedes(id_sede);
```

**JUSTIFICACIÓN:**
- Cada sede define su propia malla curricular
- Sede A puede ofrecer "Aritmética + Álgebra + Geometría"
- Sede B puede ofrecer solo "Matemática Integral"
- Ambos usan las **8 áreas globales**, pero con cursos diferentes

### 📝 NUEVA ARQUITECTURA

```
ÁREAS (Globales - MINEDU)
    ↓
CURSOS (Por Sede - Tú defines)
    ↓
MALLA CURRICULAR (Por Sede + Año + Grado)
    ↓
ASIGNACIÓN DOCENTE (Quién enseña qué)
```

**Ejemplo:**
1. **Área Global**: MATEMÁTICA (MINEDU)
2. **Cursos de Sede 18**: Aritmética, Álgebra, Geometría
3. **Malla Sede 18 - 2026 - 3ro**: Debe llevar Aritmética + Geometría
4. **Asignación**: Profesor Juan enseña Aritmética en 3ro A

---

## 2️⃣ ASIGNACIÓN DOCENTE

### 🎓 ¿Qué es?

Conecta **QUIÉN** enseña **QUÉ** a **QUIÉNES**.

### 📊 Estructura Actual

```sql
asignacion_docente (
    id_asignacion,
    id_docente,     -- Profesor
    id_seccion,     -- Sección (3ro A, 4to B)
    id_curso,       -- Curso específico
    id_anio,        -- Año escolar
    estado
)
```

### ✅ ¿Funciona Bien?

**SÍ, la estructura es correcta.** Pero con una observación:

### ⚠️ VALIDACIÓN IMPORTANTE

**Debe validar contra la Malla Curricular:**

```
❌ ERROR: No puedes asignar "Física" a 3ro A 
          si "Física" no está en la malla de 3ro.

✅ CORRECTO: Solo permite asignar cursos que estén 
             en la malla del grado de esa sección.
```

### 🔧 MEJORA RECOMENDADA

**Backend Validation (Java):**

```java
// En AsignacionDocenteController.java
@PostMapping("/asignacion-docente")
public ResponseEntity<?> guardar(@RequestBody AsignacionDTO dto) {
    // 1. Obtener el grado de la sección
    Secciones seccion = repoSecciones.findById(dto.getIdSeccion()).orElse(null);
    Long idGrado = seccion.getIdGrado().getIdGrado();
    
    // 2. Verificar que el curso esté en la malla de ese grado
    boolean cursoEnMalla = repoMalla.existsByIdAnioAndIdGradoAndIdCurso(
        dto.getIdAnio(), 
        idGrado, 
        dto.getIdCurso()
    );
    
    if (!cursoEnMalla) {
        return ResponseEntity.badRequest()
            .body("El curso no está en la malla curricular de este grado");
    }
    
    // 3. Continuar con la asignación...
}
```

**Frontend (React):**

```typescript
// Filtrar cursos disponibles según el grado de la sección seleccionada
const cursosDisponibles = useMemo(() => {
    if (!seccionSeleccionada) return [];
    
    const grado = seccionSeleccionada.idGrado;
    const mallaDeLaSeccion = mallaCurricular.filter(
        m => m.idGrado === grado && m.idAnio === anioActual
    );
    
    return mallaDeLaSeccion.map(m => m.idCurso);
}, [seccionSeleccionada, mallaCurricular, anioActual]);
```

### 🎯 FLUJO CORRECTO

1. **Admin crea Malla Curricular** (3ro debe llevar: Aritmética, Álgebra, Inglés)
2. **Admin crea Sección** (3ro A)
3. **Admin asigna docente** ✅ Solo puede elegir entre: Aritmética, Álgebra, Inglés
4. **Sistema valida** ❌ No permite asignar "Física" porque no está en la malla de 3ro

---

## 3️⃣ HORARIOS

### 📅 ¿Qué es?

Define **CUÁNDO** se dicta una asignación específica.

### 📊 Estructura Actual

```sql
horarios (
    id_horario,
    id_asignacion,  -- Referencia a asignacion_docente
    id_aula,        -- Dónde
    dia_semana,     -- Lunes, Martes, etc.
    hora_inicio,    -- 08:00
    hora_fin,       -- 09:30
    estado
)
```

### 🎯 ¿Para Quién Son?

**Para AMBOS:**

#### 👨‍🎓 **Para Alumnos** (Vista por Sección):
"Soy alumno de 3ro A, ¿qué horario tengo?"

```
LUNES:
08:00 - 09:30 | Aritmética      | Prof. Juan  | Aula 301
09:30 - 11:00 | Comunicación    | Prof. María | Aula 301

MARTES:
08:00 - 09:30 | Inglés          | Prof. Pedro | Aula 205
```

#### 👨‍🏫 **Para Profesores** (Vista por Docente):
"Soy el Prof. Juan, ¿qué clases doy?"

```
LUNES:
08:00 - 09:30 | Aritmética | 3ro A | Aula 301
11:00 - 12:30 | Álgebra    | 4to B | Aula 302

MARTES:
08:00 - 09:30 | Aritmética | 3ro B | Aula 303
```

### ✅ ¿Funciona Bien?

**SÍ, la estructura es perfecta.** La relación con `asignacion_docente` permite obtener ambas vistas.

### 🔧 MEJORAS RECOMENDADAS

#### 1. **Validación de Conflictos** ⚠️

**Backend debe validar:**

```java
// Conflicto de Profesor
❌ Prof. Juan NO puede estar en 2 lugares al mismo tiempo

// Conflicto de Aula
❌ Aula 301 NO puede tener 2 clases simultáneas

// Conflicto de Sección
❌ 3ro A NO puede tener 2 cursos al mismo tiempo
```

**Implementación:**

```java
@PostMapping("/horarios")
public ResponseEntity<?> guardar(@RequestBody HorarioDTO dto) {
    // 1. Verificar conflicto de docente
    boolean docenteOcupado = repoHorarios.existsConflictoDocente(
        dto.getIdDocente(), 
        dto.getDiaSemana(), 
        dto.getHoraInicio(), 
        dto.getHoraFin()
    );
    
    // 2. Verificar conflicto de aula
    boolean aulaOcupada = repoHorarios.existsConflictoAula(
        dto.getIdAula(), 
        dto.getDiaSemana(), 
        dto.getHoraInicio(), 
        dto.getHoraFin()
    );
    
    // 3. Verificar conflicto de sección
    boolean seccionOcupada = repoHorarios.existsConflictoSeccion(
        dto.getIdSeccion(), 
        dto.getDiaSemana(), 
        dto.getHoraInicio(), 
        dto.getHoraFin()
    );
    
    if (docenteOcupado || aulaOcupada || seccionOcupada) {
        return ResponseEntity.badRequest()
            .body("Conflicto de horario detectado");
    }
    
    // Guardar...
}
```

#### 2. **Vista de Calendario** 📅

**Frontend - Componente Visual:**

```typescript
// Vista tipo Google Calendar
<HorarioCalendar
    tipo="alumno"  // o "docente"
    idSección={14} // o idDocente={4}
/>
```

Mostrar:
- ✅ Grilla semanal (Lunes a Viernes)
- ✅ Horas en eje Y
- ✅ Bloques de color por curso
- ✅ Conflictos resaltados en rojo
- ✅ Arrastrar y soltar para reordernar

#### 3. **Generación Automática** 🤖

**Feature adicional:**

```
"Generar horario automático para 3ro A"

Criterios:
- Respetar malla curricular
- Distribuir equitativamente en la semana
- Evitar más de 2 sesiones seguidas del mismo curso
- Respetar disponibilidad de docentes
- Asignar aulas disponibles
```

---

## 📋 RESUMEN DE CAMBIOS NECESARIOS

### ✅ CAMBIOS OBLIGATORIOS

1. **Malla Curricular**
   - ✅ Agregar campo `id_sede`
   - ✅ Actualizar entidad Java
   - ✅ Actualizar DTO
   - ✅ Filtrar por sede en servicios

### 🔧 MEJORAS RECOMENDADAS

2. **Asignación Docente**
   - ✅ Validar contra malla curricular
   - ✅ Frontend: filtrar cursos según grado de sección

3. **Horarios**
   - ✅ Validar conflictos (docente/aula/sección)
   - ⭐ Vista calendario visual (opcional)
   - ⭐ Generación automática (opcional)

---

## 🚀 PRIORIDADES DE IMPLEMENTACIÓN

### 🔴 **ALTA PRIORIDAD** (Hacerlo ya)
1. Agregar `id_sede` a `malla_curricular`
2. Validar conflictos de horarios

### 🟡 **MEDIA PRIORIDAD** (Pronto)
3. Validar asignaciones contra malla
4. Mejorar UX del frontend de horarios

### 🟢 **BAJA PRIORIDAD** (Después)
5. Vista calendario avanzada
6. Generación automática de horarios

---

## 💡 RECOMENDACIÓN FINAL

1. **Malla Curricular**: ✅ **SÍ es necesaria** - Agrega `id_sede` para que cada sede tenga su propia oferta académica

2. **Asignación Docente**: ✅ **Funciona bien** - Solo falta validar contra la malla

3. **Horarios**: ✅ **Excelente estructura** - Sirve para alumnos Y profesores, solo agregar validaciones de conflictos

**ARQUITECTURA CORRECTA:**

```
ÁREAS (Global MINEDU)
   ↓
CURSOS (Por Sede) ✅ YA HECHO
   ↓
MALLA CURRICULAR (Sede + Año + Grado) 🔧 POR HACER
   ↓
ASIGNACIÓN DOCENTE (Profesor + Sección + Curso) ✅ FUNCIONA
   ↓
HORARIOS (Cuándo y Dónde) ✅ FUNCIONA
```

**PRÓXIMO PASO:** Implementar la migración de `malla_curricular` similar a lo que hicimos con `areas` y `cursos`.

---

**¿Quieres que implemente la migración de Malla Curricular ahora?**
