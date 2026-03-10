# RESUMEN DE IMPLEMENTACIÓN - MEJORA DEL MÓDULO DE ALUMNOS

## 📋 Objetivos Cumplidos

✅ **Arquitectura corregida**: Separación clara entre datos personales (ALUMNOS), matrículas (MATRICULAS) y movimientos (MOVIMIENTOS_ALUMNO)

✅ **Lógica de negocio real**: Implementación de competencia por vacantes basada en pago para alumnos nuevos vs vacantes garantizadas para promovidos

✅ **Backend completo**: Entidades, DTOs, Servicios, Controladores y Stored Procedures

✅ **Frontend completo**: API services, hooks, componentes con modales VERDES (no azules)

---

## 🗂️ CAMBIOS EN LA BASE DE DATOS

### 1. Tabla `alumnos` - LIMPIADA
**Campos ELIMINADOS** (ya no pertenecen aquí):
- ❌ `tipo_ingreso` → Movido a `matriculas`
- ❌ `estado_alumno` → Ahora es una vista derivada (`v_estado_alumnos`)

**Campos que PERMANECEN** (datos personales únicamente):
- ✅ `numero_documento`, `nombres`, `apellidos`, `fecha_nacimiento`
- ✅ `genero`, `direccion`, `telefono_contacto`
- ✅ `foto_url`, `observaciones_salud`

### 2. Tabla `matriculas` - ACTUALIZADA
**Campos AGREGADOS** (nueva arquitectura):
- ➕ `fecha_vencimiento_pago` (DateTime) - Fecha límite para pagar
- ➕ `tipo_ingreso` (ENUM: Nuevo, Promovido, Repitente, Trasladado_Entrante)
- ➕ `vacante_garantizada` (BOOLEAN) - TRUE = spot garantizado, FALSE = compite por pago
- ➕ `fecha_pago_matricula` (DateTime) - Timestamp exacto del pago (orden de llegada)

**Campos ELIMINADOS** (ahora son eventos en `movimientos_alumno`):
- ❌ `fecha_retiro`, `motivo_retiro`, `colegio_destino`

**Campo RENOMBRADO**:
- 🔄 `situacion_academica_previa` → `tipo_ingreso`
- 🔄 `observaciones_matricula` → `observaciones`

**Estado ACTUALIZADO**:
```sql
estado_matricula ENUM('Pendiente_Pago', 'Activa', 'Finalizada', 'Cancelada')
```
- `Pendiente_Pago` = Matriculado pero no pagó (puede perder la vacante)
- `Activa` = Pagó y confirmado
- `Finalizada` = Terminó el año o se fue (retiro/traslado aprobado)
- `Cancelada` = Venció el plazo de pago o pago rechazado

### 3. Tabla `movimientos_alumno` - NUEVA ⭐
**Propósito**: Gestionar retiros, traslados y cambios de sección como EVENTOS con workflow de aprobación

**Campos principales**:
```sql
- id_movimiento (PK)
- id_matricula (FK a matriculas)
- tipo_movimiento ENUM('Retiro', 'Traslado_Saliente', 'Cambio_Seccion')
- fecha_movimiento (Fecha efectiva del movimiento)
- fecha_solicitud (Timestamp de cuándo se solicitó)
- motivo (TEXT) - Explicación del movimiento
- colegio_destino (VARCHAR) - Solo para Traslado_Saliente
- id_nueva_seccion (INT) - Solo para Cambio_Seccion
- documentos_url (VARCHAR) - Archivos adjuntos
- observaciones (TEXT)

# WORKFLOW DE APROBACIÓN
- estado_solicitud ENUM('Pendiente', 'Aprobada', 'Rechazada')
- id_usuario_registro (INT) - Quien creó la solicitud
- id_usuario_aprobador (INT) - Quien aprobó/rechazó
- fecha_aprobacion (DateTime)
```

**Índices creados**:
- `idx_movimientos_matricula` en `id_matricula`
- `idx_movimientos_tipo` en `tipo_movimiento`
- `idx_movimientos_estado` en `estado_solicitud`

### 4. Vista `v_estado_alumnos` - NUEVA
Calcula el `estado_alumno` dinámicamente basado en matrículas activas:
```sql
SELECT a.id_alumno,
       CASE 
           WHEN EXISTS(SELECT 1 FROM matriculas WHERE id_alumno = a.id_alumno AND estado_matricula = 'Activa') 
           THEN 'Matriculado'
           ELSE 'No Matriculado'
       END AS estado_alumno
FROM alumnos a;
```

### 5. Stored Procedure `sp_confirmar_pago_matricula` - NUEVA ⭐
**Lógica de negocio crítica**: Valida capacidad de la sección y confirma pago

**Parámetros**:
- `IN p_id_matricula` - ID de la matrícula a confirmar
- `OUT mensaje` - Resultado de la operación

**Flujo lógico**:
1. **Verifica estado actual**: Debe estar en `Pendiente_Pago`
2. **Valida capacidad de la sección**: Cuenta alumnos activos vs vacantes
3. **Verifica vacante_garantizada**:
   - Si `TRUE` (Promovido/Repitente): ✅ Confirma siempre (spot reservado)
   - Si `FALSE` (Nuevo/Trasladado): ⚠️ Valida capacidad disponible
4. **Si hay capacidad**:
   - Actualiza `estado_matricula = 'Activa'`
   - Registra `fecha_pago_matricula = NOW()` (timestamp exacto)
   - Retorna: `'Pago confirmado exitosamente'`
5. **Si NO hay capacidad**:
   - Actualiza `estado_matricula = 'Cancelada'`
   - Retorna: `'Lo sentimos, no hay vacantes disponibles'`

**Ejemplo de uso**:
```sql
CALL sp_confirmar_pago_matricula(123, @mensaje);
SELECT @mensaje; -- 'Pago confirmado exitosamente' o 'Lo sentimos, no hay vacantes disponibles'
```

### 6. Event `evt_expirar_matriculas_vencidas` - NUEVO ⏰
**Propósito**: Auto-cancelar matrículas que no pagaron a tiempo

**Configuración**:
- **Ejecución**: Diaria a las 00:01
- **Acción**: Cambia `estado_matricula = 'Cancelada'` si `fecha_vencimiento_pago < CURDATE()`

**SQL**:
```sql
UPDATE matriculas
SET estado_matricula = 'Cancelada'
WHERE estado_matricula = 'Pendiente_Pago'
  AND fecha_vencimiento_pago < CURDATE();
```

---

## 🔧 CAMBIOS EN EL BACKEND (Java/Spring Boot)

### 1. Entity `Alumnos.java` - ACTUALIZADA
**Campos eliminados**:
```java
// ❌ ELIMINADOS
@Column(name = "tipo_ingreso")
private String tipoIngreso;

@Column(name = "estado_alumno")
private String estadoAlumno;
```

**DTO actualizado** (`AlumnosDTO.java`):
- Removidos getters/setters de `tipoIngreso` y `estadoAlumno`
- `@JsonPropertyOrder` actualizado

### 2. Entity `Matriculas.java` - ACTUALIZADA
**Campos agregados**:
```java
@Column(name = "fecha_vencimiento_pago")
private LocalDateTime fechaVencimientoPago;

@Column(name = "tipo_ingreso", length = 25)
private String tipoIngreso; // 'Nuevo', 'Promovido', 'Repitente', 'Trasladado_Entrante'

@Column(name = "vacante_garantizada")
private Boolean vacanteGarantizada;

@Column(name = "fecha_pago_matricula")
private LocalDateTime fechaPagoMatricula;
```

**Campos eliminados**:
```java
// ❌ ELIMINADOS (ahora en movimientos_alumno)
private LocalDate fechaRetiro;
private String motivoRetiro;
private String colegioDestino;
```

**Campo renombrado**:
```java
// ANTES:
private String situacionAcademicaPrevia;
private String observacionesMatricula;

// AHORA:
private String tipoIngreso;
private String observaciones;
```

**DTO actualizado** (`MatriculasDTO.java`):
- Getters/setters actualizados con nuevos nombres
- `toString()` actualizado

### 3. Entity `MovimientosAlumno.java` - NUEVA ⭐
```java
@Entity
@Table(name = "movimientos_alumno")
public class MovimientosAlumno {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_movimiento")
    private Long idMovimiento;

    @ManyToOne
    @JoinColumn(name = "id_matricula", nullable = false)
    private Matriculas idMatricula;

    @Column(name = "tipo_movimiento", nullable = false, length = 20)
    private String tipoMovimiento; // 'Retiro', 'Traslado_Saliente', 'Cambio_Seccion'

    @Column(name = "fecha_movimiento", nullable = false)
    private LocalDate fechaMovimiento;

    @Column(name = "fecha_solicitud", nullable = false)
    private LocalDateTime fechaSolicitud;

    @Column(name = "motivo", nullable = false, columnDefinition = "TEXT")
    private String motivo;

    @Column(name = "colegio_destino")
    private String colegioDestino;

    @Column(name = "id_nueva_seccion")
    private Integer idNuevaSeccion;

    @Column(name = "documentos_url")
    private String documentosUrl;

    @Lob
    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;

    @Column(name = "estado_solicitud", nullable = false, length = 10)
    private String estadoSolicitud; // 'Pendiente', 'Aprobada', 'Rechazada'

    @Column(name = "id_usuario_registro")
    private Integer idUsuarioRegistro;

    @Column(name = "id_usuario_aprobador")
    private Integer idUsuarioAprobador;

    @Column(name = "fecha_aprobacion")
    private LocalDateTime fechaAprobacion;

    @Column(name = "estado")
    private Integer estado = 1;

    // getters y setters...
}
```

**DTO correspondiente**: `MovimientosAlumnoDTO.java` creado

### 4. Repository `MovimientosAlumnoRepository.java` - NUEVO
```java
@Repository
public interface MovimientosAlumnoRepository extends JpaRepository<MovimientosAlumno, Long> {
    // Buscar movimientos pendientes de aprobación
    @Query("SELECT m FROM MovimientosAlumno m WHERE m.estadoSolicitud = 'Pendiente' AND m.estado = 1")
    List<MovimientosAlumno> findMovimientosPendientes();

    // Buscar movimientos de un alumno específico (a través de matrícula)
    @Query("SELECT m FROM MovimientosAlumno m WHERE m.idMatricula.idAlumno.idAlumno = :idAlumno AND m.estado = 1")
    List<MovimientosAlumno> findMovimientosByAlumno(@Param("idAlumno") Long idAlumno);

    // Buscar último movimiento de una matrícula
    @Query("SELECT m FROM MovimientosAlumno m WHERE m.idMatricula.idMatricula = :idMatricula AND m.estado = 1 ORDER BY m.fechaMovimiento DESC")
    List<MovimientosAlumno> findByIdMatricula(@Param("idMatricula") Long idMatricula);

    // Buscar por tipo de movimiento
    @Query("SELECT m FROM MovimientosAlumno m WHERE m.tipoMovimiento = :tipo AND m.estado = 1")
    List<MovimientosAlumno> findByTipoMovimiento(@Param("tipo") String tipo);

    // Buscar último movimiento de una matrícula
    @Query("SELECT m FROM MovimientosAlumno m WHERE m.idMatricula.idMatricula = :idMatricula AND m.estado = 1 ORDER BY m.fechaMovimiento DESC")
    Optional<MovimientosAlumno> findUltimoMovimientoByMatricula(@Param("idMatricula") Long idMatricula);
}
```

### 5. Service `MovimientosAlumnoService.java` - NUEVO
**Métodos principales**:

```java
// CREAR movimiento (establece estado = 'Pendiente' automáticamente)
public MovimientosAlumno crear(MovimientosAlumnoDTO dto) {
    MovimientosAlumno movimiento = new MovimientosAlumno();
    // ... mapeo de campos
    movimiento.setFechaSolicitud(LocalDateTime.now());
    movimiento.setEstadoSolicitud("Pendiente");
    movimiento.setIdUsuarioRegistro(TenantContext.getUserId());
    return repo.save(movimiento);
}

// APROBAR movimiento
@Transactional
public MovimientosAlumno aprobar(Long id, String observaciones) {
    MovimientosAlumno movimiento = buscarPorId(id);
    
    if (!"Pendiente".equals(movimiento.getEstadoSolicitud())) {
        throw new RuntimeException("Solo se pueden aprobar movimientos pendientes");
    }
    
    // Actualizar movimiento
    movimiento.setEstadoSolicitud("Aprobada");
    movimiento.setFechaAprobacion(LocalDateTime.now());
    movimiento.setIdUsuarioAprobador(TenantContext.getUserId());
    if (observaciones != null) {
        movimiento.setObservaciones(observaciones);
    }
    
    // Actualizar matrícula asociada a estado 'Finalizada'
    Matriculas matricula = movimiento.getIdMatricula();
    matricula.setEstadoMatricula("Finalizada");
    repoMatriculas.save(matricula);
    
    return repo.save(movimiento);
}

// RECHAZAR movimiento
@Transactional
public MovimientosAlumno rechazar(Long id, String observaciones) {
    MovimientosAlumno movimiento = buscarPorId(id);
    
    if (!"Pendiente".equals(movimiento.getEstadoSolicitud())) {
        throw new RuntimeException("Solo se pueden rechazar movimientos pendientes");
    }
    
    movimiento.setEstadoSolicitud("Rechazada");
    movimiento.setFechaAprobacion(LocalDateTime.now());
    movimiento.setIdUsuarioAprobador(TenantContext.getUserId());
    movimiento.setObservaciones(observaciones); // Motivo del rechazo
    
    return repo.save(movimiento);
}
```

### 6. Controller `MovimientosAlumnoController.java` - NUEVO
**Endpoints REST**:

```java
@RestController
@RequestMapping("/restful")
public class MovimientosAlumnoController {
    
    @GetMapping("/movimientos-alumno")
    @RequireModulo(5)  // Módulo ALUMNOS
    public List<MovimientosAlumno> listar() {...}
    
    @GetMapping("/movimientos-alumno/{id}")
    @RequireModulo(5)
    public ResponseEntity<MovimientosAlumno> buscarPorId(@PathVariable Long id) {...}
    
    @GetMapping("/movimientos-alumno/matricula/{idMatricula}")
    @RequireModulo(5)
    public ResponseEntity<List<MovimientosAlumno>> buscarPorMatricula(@PathVariable Long idMatricula) {...}
    
    @GetMapping("/movimientos-alumno/alumno/{idAlumno}")
    @RequireModulo(5)
    public ResponseEntity<List<MovimientosAlumno>> buscarPorAlumno(@PathVariable Long idAlumno) {...}
    
    @GetMapping("/movimientos-alumno/pendientes")
    @RequireModulo(5)
    public ResponseEntity<List<MovimientosAlumno>> listarPendientes() {...}
    
    @GetMapping("/movimientos-alumno/tipo/{tipo}")
    @RequireModulo(5)
    public ResponseEntity<List<MovimientosAlumno>> buscarPorTipo(@PathVariable String tipo) {...}
    
    @PostMapping("/movimientos-alumno")
    @RequireModulo(5)
    public ResponseEntity<?> crear(@RequestBody MovimientosAlumnoDTO dto) {...}
    
    @PutMapping("/movimientos-alumno/{id}/aprobar")
    @RequireModulo(5)
    public ResponseEntity<?> aprobar(@PathVariable Long id, @RequestBody Map<String, String> body) {...}
    
    @PutMapping("/movimientos-alumno/{id}/rechazar")
    @RequireModulo(5)
    public ResponseEntity<?> rechazar(@PathVariable Long id, @RequestBody Map<String, String> body) {...}
    
    @PutMapping("/movimientos-alumno")
    @RequireModulo(5)
    public ResponseEntity<?> actualizar(@RequestBody MovimientosAlumnoDTO dto) {...}
    
    @DeleteMapping("/movimientos-alumno/{id}")
    @RequireModulo(5)
    public ResponseEntity<?> eliminar(@PathVariable Long id) {...}
}
```

### 7. Controller `MatriculasController.java` - ACTUALIZADO
**Métodos POST y PUT actualizados** para usar los nuevos campos:

```java
@PostMapping("/matriculas")
@RequireModulo(6)
public ResponseEntity<?> guardar(@RequestBody MatriculasDTO dto) {
    Matriculas matriculas = new Matriculas();
    matriculas.setCodigoMatricula(dto.getCodigoMatricula());
    matriculas.setFechaMatricula(dto.getFechaMatricula());
    // ✅ NUEVOS CAMPOS
    matriculas.setFechaVencimientoPago(dto.getFechaVencimientoPago());
    matriculas.setTipoIngreso(dto.getTipoIngreso());
    matriculas.setVacanteGarantizada(dto.getVacanteGarantizada());
    matriculas.setFechaPagoMatricula(dto.getFechaPagoMatricula());
    matriculas.setObservaciones(dto.getObservaciones());
    // ❌ REMOVIDOS: situacionAcademicaPrevia, observacionesMatricula, fechaRetiro, etc.
    // ...
}
```

**Nuevo endpoint** para confirmar pago:

```java
@PutMapping("/matriculas/{id}/confirmar-pago")
@RequireModulo(6)
public ResponseEntity<?> confirmarPago(@PathVariable Long id) {
    try {
        String resultado = serviceMatriculas.confirmarPagoMatricula(id);
        return ResponseEntity.ok(resultado);
    } catch (RuntimeException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}
```

### 8. Service `MatriculasService.java` - ACTUALIZADO
**Nuevo método** para llamar al stored procedure:

```java
@Autowired
private EntityManager entityManager;

@Override
@Transactional
public String confirmarPagoMatricula(Long idMatricula) {
    try {
        StoredProcedureQuery query = entityManager.createStoredProcedureQuery("sp_confirmar_pago_matricula");
        
        query.registerStoredProcedureParameter("p_id_matricula", Long.class, ParameterMode.IN);
        query.registerStoredProcedureParameter("mensaje", String.class, ParameterMode.OUT);
        
        query.setParameter("p_id_matricula", idMatricula);
        query.execute();
        
        String resultado = (String) query.getOutputParameterValue("mensaje");
        return resultado;
    } catch (Exception e) {
        throw new RuntimeException("Error al confirmar pago: " + e.getMessage());
    }
}
```

---

## 🎨 CAMBIOS EN EL FRONTEND (React/TypeScript)

### 1. Configuración de API - `api.config.ts`
**Endpoint agregado**:
```typescript
export const API_ENDPOINTS = {
    // ...otros endpoints
    MOVIMIENTOS_ALUMNO: '/restful/movimientos-alumno',
    // ...
}
```

### 2. Tipos - `matricula.types.ts` ACTUALIZADO
**Interfaz Matricula actualizada**:
```typescript
export interface Matricula {
    idMatricula: number;
    idAlumno: Alumno;
    idSeccion: Seccion;
    idAnio: AnioEscolar;
    codigoMatricula?: string;
    fechaMatricula: string;
    // ✅ NUEVOS CAMPOS
    fechaVencimientoPago?: string;
    tipoIngreso: 'Nuevo' | 'Promovido' | 'Repitente' | 'Trasladado_Entrante';
    estadoMatricula: 'Pendiente_Pago' | 'Activa' | 'Finalizada' | 'Cancelada';
    vacanteGarantizada?: boolean;
    fechaPagoMatricula?: string;
    observaciones?: string;
    // ❌ REMOVIDOS: situacionAcademicaPrevia, estadoMatricula antiguos, fechaRetiro, etc.
    estado?: number;
}
```

### 3. Módulo Completo - `movimientos-alumno/` CREADO ⭐

#### Estructura de carpetas:
```
movimientos-alumno/
├── api/
│   └── movimientosAlumnoApi.ts       # Llamadas HTTP a backend
├── components/
│   ├── MovimientoAlumnoForm.tsx      # Formulario para crear/editar movimientos
│   └── AprobarRechazarMovimiento.tsx # Modal para aprobar/rechazar solicitudes
├── hooks/
│   └── useMovimientosAlumno.ts       # Custom hook para lógica de negocio
├── pages/
│   └── MovimientosAlumnoPage.tsx     # Página principal con tabla y filtros
├── routes/
│   └── MovimientosAlumnoRoutes.tsx   # Rutas del módulo
├── types/
│   └── index.ts                       # Tipos TypeScript
└── index.ts                           # Exportaciones del módulo
```

#### API - `movimientosAlumnoApi.ts`
**Funciones principales**:
```typescript
export const obtenerTodosMovimientos = async (): Promise<MovimientoAlumno[]> => {...}
export const obtenerMovimientoPorId = async (id: number): Promise<MovimientoAlumno> => {...}
export const obtenerMovimientosPorMatricula = async (idMatricula: number): Promise<MovimientoAlumno[]> => {...}
export const obtenerMovimientosPorAlumno = async (idAlumno: number): Promise<MovimientoAlumno[]> => {...}
export const obtenerMovimientosPendientes = async (): Promise<MovimientoAlumno[]> => {...}
export const obtenerMovimientosPorTipo = async (tipo: TipoMovimiento): Promise<MovimientoAlumno[]> => {...}
export const crearMovimiento = async (movimiento: MovimientoAlumnoDTO): Promise<MovimientoAlumno> => {...}
export const actualizarMovimiento = async (movimiento: MovimientoAlumnoDTO): Promise<MovimientoAlumno> => {...}
export const aprobarMovimiento = async (id: number, observaciones?: string): Promise<MovimientoAlumno> => {...}
export const rechazarMovimiento = async (id: number, observaciones: string): Promise<MovimientoAlumno> => {...}
export const eliminarMovimiento = async (id: number): Promise<string> => {...}
export const confirmarPagoMatricula = async (idMatricula: number): Promise<string> => {...}
```

#### Componente - `MovimientoAlumnoForm.tsx` 🟢
**Características**:
- ✅ Modal con gradiente VERDE (`from-emerald-600 to-emerald-700`)
- ✅ Header con ícono de ArrowRightLeft
- ✅ Campos dinámicos según tipo de movimiento:
  - **Retiro**: Solo motivo
  - **Traslado Saliente**: + Colegio destino
  - **Cambio de Sección**: + Nueva sección (dropdown)
- ✅ Validaciones en tiempo real
- ✅ Botones con estilo verde

**Props**:
```typescript
interface MovimientoAlumnoFormProps {
    movimiento?: MovimientoAlumno | null;
    idMatricula: number;
    nombreAlumno: string;
    onSubmit: (data: MovimientoAlumnoFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}
```

#### Componente - `AprobarRechazarMovimiento.tsx` 🟢
**Características**:
- ✅ Modal con gradiente VERDE para encabezado
- ✅ Muestra información del movimiento solicitado
- ✅ Radio buttons para Aprobar/Rechazar
- ✅ Campo de observaciones (obligatorio si rechaza)
- ✅ Botón verde para aprobar, rojo para rechazar
- ✅ Al aprobar, actualiza `estado_matricula = 'Finalizada'` automáticamente

**Props**:
```typescript
interface AprobarRechazarMovimientoProps {
    movimiento: MovimientoAlumno;
    onAprobar: (id: number, observaciones?: string) => Promise<void>;
    onRechazar: (id: number, observaciones: string) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}
```

#### Página - `MovimientosAlumnoPage.tsx` 🟢
**Características**:
- ✅ Header con ícono ArrowRightLeft en verde (`text-emerald-600`)
- ✅ Botón "Nuevo Movimiento" verde (variant="success")
- ✅ Cards de estadísticas:
  - Total de movimientos
  - Pendientes (amarillo)
  - Aprobadas (verde)
  - Rechazadas (rojo)
- ✅ Filtros por estado con botones verdes cuando activos
- ✅ Barra de búsqueda
- ✅ Tabla responsive con badges de color:
  - **Tipo**: Retiro (rojo), Traslado (azul), Cambio (morado)
  - **Estado**: Pendiente (amarillo), Aprobada (verde), Rechazada (rojo)
- ✅ Acciones por fila:
  - Aprobar/Rechazar (solo para Pendientes)
  - Ver detalles (ojo)
  - Editar (solo para Pendientes)
  - Eliminar (solo para Pendientes)
- ✅ Modal de detalles con gradiente verde
- ✅ Paginación

#### Hook - `useMovimientosAlumno.ts`
**Funciones exportadas**:
```typescript
export const useMovimientosAlumno = () => {
    return {
        movimientos,        // Array de movimientos
        isLoading,          // Estado de carga
        error,              // Mensaje de error
        cargar,             // Recargar todos
        cargarPendientes,   // Cargar solo pendientes
        crear,              // Crear nuevo movimiento
        actualizar,         // Actualizar movimiento existente
        aprobar,            // Aprobar solicitud
        rechazar,           // Rechazar solicitud
        eliminar            // Eliminar movimiento
    };
};
```

**Características**:
- ✅ Manejo automático de estados (loading, error)
- ✅ Toasts informativos (success/error)
- ✅ Actualización optimista del estado local

---

## 🔍 LÓGICA DE NEGOCIO - Ejemplos Prácticos

### Escenario 1: Alumnos Promovidos (Vacante Garantizada)
**Contexto**: Sección de 2do grado tiene 30 vacantes, 28 alumnos de 1er grado promovieron

**Flujo**:
1. Sistema crea matrículas para los 28 promovidos:
   ```sql
   INSERT INTO matriculas (id_alumno, tipo_ingreso, vacante_garantizada, estado_matricula)
   VALUES (1, 'Promovido', TRUE, 'Pendiente_Pago');
   ```

2. Los 28 alumnos pueden pagar en cualquier momento, **su vacante está reservada**

3. Quedan **2 vacantes disponibles** para alumnos nuevos (sin garantía)

### Escenario 2: Competencia por Vacantes (Alumnos Nuevos)
**Contexto**: Las 2 vacantes restantes, 5 alumnos nuevos intentan matricularse

**Flujo**:
1. 5 alumnos se matriculan (viernes 15):
   ```sql
   INSERT INTO matriculas (id_alumno, tipo_ingreso, vacante_garantizada, estado_matricula, fecha_vencimiento_pago)
   VALUES 
       (101, 'Nuevo', FALSE, 'Pendiente_Pago', '2024-01-22'), -- Vence en 7 días
       (102, 'Nuevo', FALSE, 'Pendiente_Pago', '2024-01-22'),
       (103, 'Nuevo', FALSE, 'Pendiente_Pago', '2024-01-22'),
       (104, 'Nuevo', FALSE, 'Pendiente_Pago', '2024-01-22'),
       (105, 'Nuevo', FALSE, 'Pendiente_Pago', '2024-01-22');
   ```

2. Pagan en diferentes momentos:
   - Lunes 18 a las 09:15 → Alumno 103 paga primero
   - Lunes 18 a las 14:30 → Alumno 101 paga segundo
   - Martes 19 a las 10:00 → Alumno 105 paga tercero
   - Miércoles 20 → Alumnos 102 y 104 aún no pagaron

3. **Sistema ejecuta `sp_confirmar_pago_matricula`**:
   
   **Alumno 103** (09:15):
   ```sql
   CALL sp_confirmar_pago_matricula(103, @msg);
   -- Resultado: 'Pago confirmado exitosamente'
   -- Acción: estado_matricula = 'Activa', fecha_pago_matricula = '2024-01-18 09:15:23'
   -- Capacidad: 29/30 (1 vacante restante)
   ```

   **Alumno 101** (14:30):
   ```sql
   CALL sp_confirmar_pago_matricula(101, @msg);
   -- Resultado: 'Pago confirmado exitosamente'
   -- Acción: estado_matricula = 'Activa', fecha_pago_matricula = '2024-01-18 14:30:45'
   -- Capacidad: 30/30 (COMPLETO - sin vacantes)
   ```

   **Alumno 105** (martes 10:00):
   ```sql
   CALL sp_confirmar_pago_matricula(105, @msg);
   -- Resultado: 'Lo sentimos, no hay vacantes disponibles'
   -- Acción: estado_matricula = 'Cancelada'
   -- Capacidad: 30/30 (llegó tarde)
   ```

4. **Event automático** (miércoles 00:01):
   ```sql
   -- Alumnos 102 y 104 vencieron sin pagar
   UPDATE matriculas
   SET estado_matricula = 'Cancelada'
   WHERE id_matricula IN (102, 104);
   ```

**Resultado final**:
- ✅ 28 Promovidos: Activos
- ✅ 2 Nuevos (103, 101): Activos (pagaron primero)
- ❌ 1 Nuevo (105): Cancelado (no había vacantes al pagar)
- ❌ 2 Nuevos (102, 104): Cancelados (vencieron sin pagar)

### Escenario 3: Retiro de Alumno (Workflow de Aprobación)
**Contexto**: Padre de alumno solicita retiro por mudanza a otra ciudad

**Flujo**:
1. **Secretaria crea el movimiento**:
   ```typescript
   await crearMovimiento({
       idMatricula: 123,
       tipoMovimiento: 'Retiro',
       fechaMovimiento: '2024-02-15',
       motivo: 'Familia se muda a Arequipa por trabajo',
       observaciones: 'Padre presentó carta de renuncia'
   });
   ```
   Backend guarda:
   ```sql
   INSERT INTO movimientos_alumno 
   (id_matricula, tipo_movimiento, fecha_movimiento, motivo, estado_solicitud, id_usuario_registro)
   VALUES (123, 'Retiro', '2024-02-15', 'Familia se muda...', 'Pendiente', 45);
   ```

2. **Director revisa y aprueba**:
   - Entra a "Movimientos de Alumnos"
   - Filtra por "Pendientes"
   - Click en ícono de check ✓
   - Modal verde aparece con información
   - Ingresa observaciones (opcional): "Aprobado según protocolo XYZ"
   - Click "Aprobar Movimiento"

3. **Backend ejecuta**:
   ```java
   @Transactional
   public MovimientoAlumno aprobar(Long id, String observaciones) {
       // 1. Actualizar movimiento
       movimiento.setEstadoSolicitud("Aprobada");
       movimiento.setFechaAprobacion(LocalDateTime.now());
       movimiento.setIdUsuarioAprobador(getCurrentUserId());
       
       // 2. Finalizar matrícula
       Matriculas matricula = movimiento.getIdMatricula();
       matricula.setEstadoMatricula("Finalizada");
       repoMatriculas.save(matricula);
       
       return repo.save(movimiento);
   }
   ```

4. **Resultado**:
   - Movimiento cambia a `Aprobada`
   - Matrícula cambia a `Finalizada`
   - Vista `v_estado_alumnos` muestra alumno como `No Matriculado`
   - Vacante queda disponible para nuevo alumno

### Escenario 4: Traslado a Otra Sección (Mismo Colegio)
**Contexto**: Alumno tiene problemas de aprendizaje, recomiendan cambio a sección con menos alumnos

**Flujo**:
1. **Psicóloga solicita cambio**:
   ```typescript
   await crearMovimiento({
       idMatricula: 456,
       tipoMovimiento: 'Cambio_Seccion',
       fechaMovimiento: '2024-03-01',
       motivo: 'Recomendación psicopedagógica - requiere aula con menor cantidad de estudiantes',
       idNuevaSeccion: 12, // Sección B (20 alumnos vs 30 de la actual)
       observaciones: 'Adjunto informe psicológico'
   });
   ```

2. **Coordinadora aprueba**:
   - Modal verde muestra: Tipo "Cambio de Sección", Nueva Sección, Motivo
   - Aprueba con observación: "Coordinado con docentes de ambas secciones"

3. **Backend**:
   - Movimiento → `Aprobada`
   - Matrícula antigua → `Finalizada`
   - **Manual**: Secretaria crea nueva matrícula en Sección B con `tipo_ingreso = 'Promovido'`

---

## 📊 GUÍA DE COLORES (Estilo Verde - NO Azul)

**Modal de Instituciones** (referencia INCORRECTA - usa azul):
```typescript
// ❌ NO USAR (azul del modal de instituciones original)
className="bg-gradient-to-r from-[#1e3a8a] to-[#1e1b4b]"
```

**Estilo VERDE implementado** (correcto):
```typescript
// ✅ USAR (verde para movimientos-alumno)
className="bg-gradient-to-r from-emerald-600 to-emerald-700"         // Header del modal
className="hover:from-emerald-700 hover:to-emerald-800"              // Hover en botón de guardar
className="text-emerald-600"                                         // Íconos y texto primario
className="bg-emerald-600 text-white"                                // Botón de filtro activo
className="bg-white text-gray-700 hover:bg-gray-50 border border-gray-300" // Botón de filtro inactivo
className="animate-spin ... border-emerald-600 border-t-transparent" // Spinner de carga
```

**Badges de estado**:
```typescript
// Pendiente
className="bg-yellow-100 text-yellow-800"

// Aprobada
className="bg-green-100 text-green-800"

// Rechazada
className="bg-red-100 text-red-800"
```

**Badges de tipo de movimiento**:
```typescript
// Retiro
className="bg-red-50 text-red-700"

// Traslado Saliente
className="bg-blue-50 text-blue-700"

// Cambio de Sección
className="bg-purple-50 text-purple-700"
```

---

## 🚀 PRÓXIMOS PASOS PARA COMPLETAR

### Falta integrar en el sistema:

1. **Rutas del módulo movimientos-alumno**:
   - Agregar a archivo de rutas principal del portal
   - Configurar navegación en sidebar (si aplica)

2. **Integración con módulo de alumnos**:
   - Agregar botón en detalle de alumno: "Registrar Movimiento"
   - Mostrar historial de movimientos en ficha del alumno

3. **Integración con módulo de matrículas**:
   - Actualizar formulario de matrícula para usar nuevos campos
   - Agregar selector de `tipo_ingreso` (Nuevo/Promovido/Repitente/Trasladado_Entrante)
   - Auto-calcular `vacante_garantizada` según tipo_ingreso
   - Agregar campo `fecha_vencimiento_pago`
   - Botón "Confirmar Pago" que llama a `confirmarPagoMatricula()`
   - Mostrar alerta si estado = 'Cancelada' (venció o sin vacantes)

4. **Dashboard de vacantes**:
   - Crear vista que muestre por sección:
     - Capacidad total
     - Matrículas Activas
     - Matrículas Pendiente_Pago (con vacante garantizada)
     - Matrículas Pendiente_Pago (sin garantía)
     - Vacantes realmente disponibles (fórmula compleja)

5. **Notificaciones**:
   - Email/SMS cuando matrícula pase a `Cancelada` (no pagó a tiempo)
   - Email/SMS cuando pago se confirme exitosamente
   - Email/SMS cuando no haya vacantes disponibles al pagar

6. **Reportes**:
   - Reporte de movimientos por período
   - Reporte de alumnos retirados (motivos más frecuentes)
   - Reporte de traslados salientes (a qué colegios se van)
   - Reporte de competencia por vacantes (cuántos pagaron vs cuántos cancelados)

---

## 📂 ARCHIVOS CREADOS/MODIFICADOS

### Backend (Java)
```
✅ CREADOS:
- bd/MIGRACION-ALUMNOS-MATRICULAS.sql
- archivo/ARQUITECTURA-ALUMNOS-MATRICULAS.md
- entity/MovimientosAlumno.java
- entity/MovimientosAlumnoDTO.java
- repository/MovimientosAlumnoRepository.java
- service/jpa/MovimientosAlumnoService.java
- controller/MovimientosAlumnoController.java

✅ MODIFICADOS:
- entity/Alumnos.java (removed tipoIngreso, estadoAlumno)
- entity/AlumnosDTO.java (removed getters/setters)
- entity/Matriculas.java (added new fields, removed old ones)
- entity/MatriculasDTO.java (updated all fields, getters, setters, toString)
- service/IMatriculasService.java (added confirmarPagoMatricula method)
- service/jpa/MatriculasService.java (implemented confirmarPagoMatricula)
- controller/MatriculasController.java (updated POST/PUT, added confirmar-pago endpoint)
```

### Frontend (React/TypeScript)
```
✅ CREADOS:
- features/portal/movimientos-alumno/types/index.ts
- features/portal/movimientos-alumno/api/movimientosAlumnoApi.ts
- features/portal/movimientos-alumno/hooks/useMovimientosAlumno.ts
- features/portal/movimientos-alumno/components/MovimientoAlumnoForm.tsx
- features/portal/movimientos-alumno/components/AprobarRechazarMovimiento.tsx
- features/portal/movimientos-alumno/pages/MovimientosAlumnoPage.tsx
- features/portal/movimientos-alumno/routes/MovimientosAlumnoRoutes.tsx
- features/portal/movimientos-alumno/index.ts

✅ MODIFICADOS:
- config/api.config.ts (added MOVIMIENTOS_ALUMNO endpoint)
- features/portal/matriculas/types/matricula.types.ts (updated Matricula interface)
```

---

## ✅ CHECKLIST DE VALIDACIÓN

### Base de Datos
- [x] Tabla `alumnos` limpiada (sin tipo_ingreso, estado_alumno)
- [x] Tabla `matriculas` actualizada (nuevos campos agregados, antiguos removidos)
- [x] Tabla `movimientos_alumno` creada con workflow
- [x] Vista `v_estado_alumnos` creada
- [x] Stored Procedure `sp_confirmar_pago_matricula` creado
- [x] Event `evt_expirar_matriculas_vencidas` configurado
- [x] Índices creados para performance

### Backend
- [x] Entity Alumnos actualizada
- [x] Entity Matriculas actualizada
- [x] Entity MovimientosAlumno creada
- [x] DTOs actualizados/creados
- [x] Repository MovimientosAlumno con queries personalizadas
- [x] Service MovimientosAlumno con aprobar/rechazar
- [x] Service Matriculas con confirmarPago
- [x] Controller MovimientosAlumno completo (11 endpoints)
- [x] Controller Matriculas actualizado
- [x] Sin errores de compilación

### Frontend
- [x] Tipos TypeScript actualizados
- [x] API service movimientosAlumnoApi creado
- [x] Hook useMovimientosAlumno creado
- [x] Componente MovimientoAlumnoForm con estilo VERDE
- [x] Componente AprobarRechazarMovimiento con estilo VERDE
- [x] Página MovimientosAlumnoPage con tabla y filtros
- [x] Rutas configuradas
- [x] Sin errores de compilación
- [ ] Rutas agregadas al router principal (PENDIENTE)
- [ ] Link en sidebar/menú (PENDIENTE)

### Integración
- [ ] Formulario de matrícula actualizado para nuevos campos (PENDIENTE)
- [ ] Botón "Registrar Movimiento" en detalle de alumno (PENDIENTE)
- [ ] Botón "Confirmar Pago" en matrículas (PENDIENTE)
- [ ] Dashboard de vacantes disponibles (PENDIENTE)

---

## 🎯 RESUMEN EJECUTIVO

**Problema Original**: 
- Tabla `alumnos` mezclaba datos personales con datos de matrícula
- Retiros y traslados se manejaban como campos de matrícula (sin historial)
- No había lógica para competencia de vacantes por orden de pago
- Conceptos confusos (tipo_ingreso vs situacion_academica_previa)

**Solución Implementada**:
- ✅ **3 tablas separadas**: ALUMNOS (personal), MATRICULAS (inscripción), MOVIMIENTOS_ALUMNO (eventos)
- ✅ **Vacantes garantizadas** vs **competencia por pago**: Campo `vacante_garantizada` + Stored Procedure
- ✅ **Workflow de aprobación**: Movimientos pasan por pendiente → aprobada/rechazada
- ✅ **Auto-vencimiento**: Event diario cancela matrículas sin pago
- ✅ **Backend completo**: 11 endpoints REST para movimientos + 1 para confirmar pago
- ✅ **Frontend VERDE**: Modales con gradiente emerald (NO azul) como se solicitó

**Impacto**:
- 🎓 Arquitectura limpia y mantenible
- 🎓 Lógica de negocio real (mundo escolar)
- 🎓 Trazabilidad completa (quién, cuándo, por qué)
- 🎓 Automatización (vencimientos, validaciones)
- 🎓 UI consistente (colores verdes para este módulo)

---

**IMPLEMENTACIÓN COMPLETADA** ✅
Fecha de finalización backend: 2025
Fecha de finalización frontend: 2025
Estado: FUNCIONAL - Listo para pruebas e integración final
