# SearchableSelect - Componente Reutilizable

## Descripción
Componente de selector con búsqueda integrada que permite filtrar opciones de forma intuitiva. Reemplaza los `<select>` tradicionales con un diseño moderno y funcionalidad de búsqueda sin acentos.

## Ubicación
`src/components/common/SearchableSelect.tsx`

## Características
- ✅ Búsqueda en tiempo real (ignora acentos y mayúsculas)
- ✅ Dropdown con scroll optimizado para listas grandes (hasta 2000+ items)
- ✅ Header sticky que muestra contador cuando hay 5+ resultados
- ✅ Altura máxima de ~550px (~12-15 items visibles)
- ✅ Muestra texto principal y subtexto opcional
- ✅ Cierre automático al seleccionar
- ✅ Backdrop para cerrar al hacer click fuera
- ✅ Validación required integrada
- ✅ Mensajes de error personalizables
- ✅ Tipo genérico para cualquier objeto
- ✅ Separadores sutiles entre items
- ✅ Contador inteligente: "X opciones • Y total"

## Cuándo usar
- **✅ Úsalo para:** Listas con 10+ elementos o que pueden crecer (instituciones, apoderados, alumnos, clientes, productos, etc.)
- **❌ No uses para:** Listas pequeñas y fijas (género: 2 opciones, estado: 3 opciones, tipo cuenta: 4 opciones)

## Uso Básico

```tsx
import SearchableSelect from '../../../../components/common/SearchableSelect';

<SearchableSelect
    value={formData.idInstitucion}
    onChange={(value) => setFormData({...formData, idInstitucion: Number(value)})}
    options={instituciones}
    getOptionId={(inst) => inst.idInstitucion}
    getOptionLabel={(inst) => inst.nombre}
    getOptionSubtext={(inst) => inst.codModular}
    label="Institución"
    placeholder="Buscar por nombre o código..."
    required
/>
```

## Props

| Prop | Tipo | Obligatorio | Descripción |
|------|------|-------------|-------------|
| `value` | `number \| string` | ✅ | Valor seleccionado (ID) |
| `onChange` | `(value: number \| string) => void` | ✅ | Callback al seleccionar |
| `options` | `T[]` | ✅ | Array de objetos a mostrar |
| `getOptionId` | `(option: T) => number \| string` | ✅ | Función para obtener ID del objeto |
| `getOptionLabel` | `(option: T) => string` | ✅ | Función para obtener texto principal |
| `getOptionSubtext` | `(option: T) => string` | ❌ | Función para obtener subtexto (línea 2) |
| `label` | `string` | ❌ | Etiqueta encima del input |
| `placeholder` | `string` | ❌ | Texto placeholder (default: "Buscar...") |
| `required` | `boolean` | ❌ | Si el campo es obligatorio |
| `disabled` | `boolean` | ❌ | Deshabilitar el selector |
| `error` | `string` | ❌ | Mensaje de error a mostrar |
| `className` | `string` | ❌ | Clases CSS adicionales para el contenedor |
| `emptyMessage` | `string` | ❌ | Mensaje cuando no hay resultados |

## Ejemplos de Uso

### 1. Selector de Apoderados (con subtexto)
```tsx
<SearchableSelect
    value={relacionFormData.idApoderado}
    onChange={(value) => setRelacionFormData({...relacionFormData, idApoderado: Number(value)})}
    options={apoderados}
    getOptionId={(apoderado) => apoderado.idApoderado}
    getOptionLabel={(apoderado) => `${apoderado.nombres} ${apoderado.apellidos}`}
    getOptionSubtext={(apoderado) => apoderado.numeroDocumento}
    label="Apoderado"
    placeholder="Buscar por nombre, apellido o documento..."
    required
    emptyMessage="No se encontraron apoderados"
/>
```

### 2. Selector de Instituciones
```tsx
<SearchableSelect
    value={formData.idInstitucion}
    onChange={(value) => setFormData(prev => ({ ...prev, idInstitucion: Number(value) }))}
    options={instituciones}
    getOptionId={(inst) => inst.idInstitucion}
    getOptionLabel={(inst) => inst.nombre}
    getOptionSubtext={(inst) => inst.codModular}
    label="Institución"
    placeholder="Buscar por nombre o código modular..."
    required
    emptyMessage="No se encontraron instituciones"
/>
```

### 3. Selector Simple (sin subtexto)
```tsx
<SearchableSelect
    value={selectedUserId}
    onChange={setSelectedUserId}
    options={usuarios}
    getOptionId={(user) => user.id}
    getOptionLabel={(user) => user.nombreCompleto}
    label="Usuario"
    placeholder="Buscar usuario..."
/>
```

### 4. Con Manejo de Errores
```tsx
<SearchableSelect
    value={formData.idCliente}
    onChange={(value) => {
        setFormData({...formData, idCliente: Number(value)});
        setError('');
    }}
    options={clientes}
    getOptionId={(cliente) => cliente.id}
    getOptionLabel={(cliente) => cliente.razonSocial}
    getOptionSubtext={(cliente) => cliente.ruc}
    label="Cliente"
    placeholder="Buscar cliente..."
    required
    error={error}
    disabled={isLoading}
/>
```

## Comportamiento de Búsqueda

El componente normaliza automáticamente el texto de búsqueda para:
- Ignorar mayúsculas/minúsculas
- Remover acentos y diacríticos (`á` → `a`, `ñ` → `n`)
- Buscar en el texto principal Y el subtexto

**Ejemplo:**
- Usuario busca: `jose garcia`
- Encuentra: "José García", "JOSE GARCIA", "Josë Garcïa"

## Diseño Visual

```
┌─────────────────────────────────────┐
│ Apoderado *                         │ ← Label
├─────────────────────────────────────┤
│ 🔍 Juan Perez - 12345678           │ ← Input con ícono Search
└─────────────────────────────────────┘
  ┌─────────────────────────────────┐
  │ Mostrando 15 resultados de 120  │ ← Header sticky (aparece si >5)
  ├─────────────────────────────────┤
  │ Juan Perez Martinez            │ ← Texto principal (negrita)
  │ 12345678                       │ ← Subtexto (gris)
  ├─────────────────────────────────┤
  │ María García Lopez             │
  │ 87654321                       │
  ├─────────────────────────────────┤
  │ ...                            │
  │ (scroll para ver más ~12-15)   │
  └─────────────────────────────────┘
   ↑ Dropdown con hover azul

📊 Abajo: "15 opciones • 120 total"
```

## Migración desde Select Manual

### ❌ Antes (código manual)
```tsx
const [search, setSearch] = useState('');
const [showDropdown, setShowDropdown] = useState(false);

const filtered = items.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase())
);

<input value={search} onChange={(e) => setSearch(e.target.value)} />
{showDropdown && (
    <div className="dropdown">
        {filtered.map(item => (
            <button onClick={() => select(item)}>{item.name}</button>
        ))}
    </div>
)}
```

### ✅ Después (componente)
```tsx
<SearchableSelect
    value={selected}
    onChange={setSelected}
    options={items}
    getOptionId={item => item.id}
    getOptionLabel={item => item.name}
    placeholder="Buscar..."
/>
```

## Ubicaciones Actuales

Ya implementado en:
- ✅ `AlumnoDetallePage` - Selector de apoderados para vincular
- ✅ `SuscripcionForm` - Selector de instituciones

## Recomendaciones

1. **Lista grande (10+):** Usar SearchableSelect
2. **Lista corta (< 10):** Usar `<select>` normal
3. **Subtexto útil:** Código, documento, email, teléfono
4. **Sin subtexto:** Cuando solo el nombre es suficiente

## Notas Técnicas

- **TypeScript:** Genérico `<T>` permite cualquier tipo de objeto
- **Performance:** Filtrado optimizado con normalización
  - Maneja eficientemente listas de 2000+ items
  - Header sticky solo aparece con 5+ resultados
  - Altura fija con scroll para evitar renderizado excesivo
- **Accesibilidad:** Soporta navegación con teclado (trabajo futuro)
- **Responsive:** Adaptable a móviles
- **Z-index:** Dropdown z-20, backdrop z-10 (evita conflictos)
- **UX:** 
  - Contador inteligente muestra filtrados vs total
  - Separadores sutiles entre items
  - Scroll suave con estilos personalizados

## Límites y Escalabilidad

✅ **Probado con:**
- 3-10 items: Funciona perfecto, sin header
- 50-100 items: Muestra header, scroll suave
- 500-2000+ items: Búsqueda instantánea, filtrado eficiente

⚠️ **Si tienes 10,000+ items:** Considera implementar:
- Paginación en backend
- Búsqueda en servidor
- Lazy loading / windowing virtual
