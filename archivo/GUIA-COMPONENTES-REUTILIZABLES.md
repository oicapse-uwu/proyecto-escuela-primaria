# 🧩 Guía de Componentes Reutilizables

## 📌 ¿Qué son los Componentes Reutilizables?

Los componentes reutilizables son piezas de código que puedes usar en **cualquier parte de tu módulo** sin tener que volver a escribirlos. El proyecto ya tiene varios componentes listos para usar que te ahorrarán tiempo y esfuerzo.

**✅ Ventajas:**
- No duplicas código
- Diseño consistente en toda la aplicación
- Menos errores
- Desarrollo más rápido

---

## 📦 Componentes Disponibles

### 1. Modal - Ventanas Emergentes

**📁 Ubicación:** `src/components/common/Modal.tsx`

**🎯 Uso:** Para mostrar información, formularios o confirmaciones en una ventana emergente.

#### Propiedades (Props)

| Prop | Tipo | Requerido | Por defecto | Descripción |
|------|------|-----------|-------------|-------------|
| `isOpen` | `boolean` | ✅ Sí | - | Controla si el modal está visible |
| `onClose` | `() => void` | ✅ Sí | - | Función para cerrar el modal |
| `title` | `string` | ✅ Sí | - | Título del modal |
| `children` | `ReactNode` | ✅ Sí | - | Contenido del modal |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| '4xl'` | ❌ No | `'lg'` | Tamaño del modal |
| `showCloseButton` | `boolean` | ❌ No | `true` | Muestra/oculta el botón X |

#### Ejemplo de Uso

```tsx
import React, { useState } from 'react';
import Modal from '../../../components/common/Modal';

const TuModulo: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const handleEdit = (item: any) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    return (
        <div>
            {/* Botón para abrir el modal */}
            <button 
                onClick={() => setShowModal(true)}
                className="bg-primary text-white px-4 py-2 rounded"
            >
                Crear Nuevo
            </button>

            {/* Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Crear Nuevo Registro"
                size="lg"
            >
                {/* Contenido del modal */}
                <div className="p-6">
                    <form>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">
                                Nombre
                            </label>
                            <input 
                                type="text" 
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                        
                        {/* Botones de acción */}
                        <div className="flex gap-2 justify-end">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-300 rounded"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-primary text-white rounded"
                            >
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
};
```

#### Tamaños Disponibles

```tsx
// Pequeño - Para confirmaciones simples
<Modal size="sm" title="¿Estás seguro?" />

// Mediano - Para formularios cortos  
<Modal size="md" title="Editar Usuario" />

// Grande (por defecto) - Para formularios normales
<Modal size="lg" title="Crear Registro" />

// Extra Grande - Para formularios extensos
<Modal size="xl" title="Formulario Completo" />

// 2XL - Para contenido amplio
<Modal size="2xl" title="Detalles Completos" />

// 4XL - Para tablas o contenido muy amplio
<Modal size="4xl" title="Reporte Detallado" />
```

---

### 2. Pagination - Paginación de Tablas

**📁 Ubicación:** `src/components/common/Pagination.tsx`

**🎯 Uso:** Para dividir listados largos en páginas y permitir cambiar cuántos elementos mostrar.

#### Propiedades (Props)

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `currentPage` | `number` | ✅ Sí | Página actual (empezando en 1) |
| `totalItems` | `number` | ✅ Sí | Total de elementos |
| `itemsPerPage` | `number` | ✅ Sí | Elementos por página |
| `onPageChange` | `(page: number) => void` | ✅ Sí | Función al cambiar de página |
| `onItemsPerPageChange` | `(items: number) => void` | ✅ Sí | Función al cambiar items por página |
| `itemsPerPageOptions` | `number[]` | ❌ No | Opciones de items por página |

#### Ejemplo de Uso Completo

```tsx
import React, { useState } from 'react';
import Pagination from '../../../components/common/Pagination';

const TuModuloList: React.FC = () => {
    // Estado para la paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Tus datos (ejemplo)
    const allItems = [
        { id: 1, nombre: 'Item 1' },
        { id: 2, nombre: 'Item 2' },
        // ... más items
    ];

    // Calcular items de la página actual
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = allItems.slice(startIndex, endIndex);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Lista de Registros</h1>

            {/* Tabla con los items de la página actual */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left">ID</th>
                            <th className="px-6 py-3 text-left">Nombre</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((item) => (
                            <tr key={item.id} className="border-t">
                                <td className="px-6 py-4">{item.id}</td>
                                <td className="px-6 py-4">{item.nombre}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Componente de Paginación */}
                <Pagination
                    currentPage={currentPage}
                    totalItems={allItems.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={setItemsPerPage}
                    itemsPerPageOptions={[10, 25, 50, 100]}
                />
            </div>
        </div>
    );
};

export default TuModuloList;
```

#### Funcionalidades Incluidas

✅ **Navegación de páginas** - Botones Anterior y Siguiente  
✅ **Información de registros** - "Mostrando X a Y de Z registros"  
✅ **Selector de items por página** - 10, 25, 50, 100  
✅ **Ajuste automático** - Si cambias items por página, ajusta la página actual  
✅ **Responsive** - Se adapta a móvil y desktop  
✅ **Deshabilitación automática** - Botones deshabilitados cuando no aplica  

---

### 3. PrivateRoute - Protección de Rutas

**📁 Ubicación:** `src/components/common/PrivateRoute.tsx`

**🎯 Uso:** Para proteger rutas que requieren autenticación.

**⚠️ Nota:** Este componente generalmente ya está configurado en el sistema de rutas. **NO necesitas usarlo directamente** en tus módulos, pero es bueno saber que existe.

#### ¿Qué Hace?

- Verifica si el usuario está autenticado
- Si NO está autenticado → Redirige al login
- Si está autenticado → Muestra el contenido

#### Ejemplo (Ya está implementado)

```tsx
// En el archivo de rutas principal
import PrivateRoute from './components/common/PrivateRoute';

{
    path: '/escuela',
    element: <PrivateRoute><EscuelaLayout /></PrivateRoute>,
    children: [
        // Todas tus rutas protegidas aquí
    ]
}
```

**No necesitas hacer nada más con este componente.** El sistema ya lo maneja.

---

## 🎨 Componentes de UI Básicos

Aunque la carpeta `ui` está vacía actualmente, puedes crear tus propios componentes según necesites:

### Ejemplos de Componentes Útiles

```tsx
// Button.tsx - Botón reutilizable
interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
    type?: 'button' | 'submit';
}

// Input.tsx - Input reutilizable
interface InputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: 'text' | 'email' | 'password';
    error?: string;
}

// Card.tsx - Tarjeta reutilizable
interface CardProps {
    title: string;
    children: React.ReactNode;
}
```

---

## 📚 Dónde Ver Ejemplos de Uso

Para ver cómo se usan estos componentes en la práctica:

### Modal
📁 `features/backoffice/instituciones/pages/InstitucionesPage.tsx`

### Pagination
📁 `features/backoffice/instituciones/pages/InstitucionesPage.tsx`

---

## 🔧 Cómo Importar los Componentes

### Desde una página en portal

```tsx
// Si estás en: features/portal/tu-modulo/pages/TuModuloList.tsx
import Modal from '../../../../components/common/Modal';
import Pagination from '../../../../components/common/Pagination';
```

### Desde una página en backoffice

```tsx
// Si estás en: features/backoffice/tu-modulo/pages/TuModuloList.tsx
import Modal from '../../../../components/common/Modal';
import Pagination from '../../../../components/common/Pagination';
```

**💡 Tip:** Puedes usar el autocompletado de tu editor. Solo escribe `import Modal from` y presiona `Ctrl+Space` para ver las sugerencias.

---

## ✨ Buenas Prácticas

### 1. Reutiliza en lugar de Duplicar

❌ **NO hagas esto:**
```tsx
// Creando tu propio modal desde cero
const MiModal = () => {
    return (
        <div className="fixed inset-0 bg-black/50">
            {/* Código duplicado del Modal */}
        </div>
    );
};
```

✅ **HAZ esto:**
```tsx
// Usa el Modal existente
import Modal from '../../../components/common/Modal';

<Modal isOpen={show} onClose={handleClose} title="Mi Modal">
    {/* Tu contenido */}
</Modal>
```

### 2. Mantén el Estado en tu Componente

El Modal y otros componentes son **controlados**, es decir, TÚ manejas su estado:

```tsx
const [showModal, setShowModal] = useState(false); // ✅ Estado en tu componente

<Modal 
    isOpen={showModal}                    // Pasas el estado
    onClose={() => setShowModal(false)}   // Pasas la función
    title="Título"
>
    Contenido
</Modal>
```

### 3. Usa TypeScript para Ayuda

Los componentes tienen tipos definidos. Si no estás seguro de qué props necesitas, tu editor te mostrará:

```tsx
<Modal 
    // Presiona Ctrl+Space aquí y verás todas las props disponibles
    
/>
```

---

## 🛠️ Crear Nuevos Componentes Reutilizables

Si necesitas crear un componente que vas a usar en varios lugares:

### 1. Decide dónde crearlo

- **`components/common/`** - Para componentes generales (modals, tabs, cards, etc.)
- **`components/ui/`** - Para componentes de UI básicos (buttons, inputs, badges, etc.)

### 2. Estructura del componente

```tsx
// components/common/TuComponente.tsx
import React from 'react';

interface TuComponenteProps {
    // Define tus props con TypeScript
    propiedad1: string;
    propiedad2?: number;  // ? = opcional
    onAction: () => void;
}

/**
 * Descripción breve del componente
 * 
 * @example
 * <TuComponente 
 *   propiedad1="valor"
 *   onAction={() => console.log('acción')}
 * />
 */
const TuComponente: React.FC<TuComponenteProps> = ({ 
    propiedad1, 
    propiedad2 = 10,  // Valor por defecto
    onAction 
}) => {
    return (
        <div>
            {/* Tu JSX aquí */}
        </div>
    );
};

export default TuComponente;
```

### 3. Documéntalo

Agrega un comentario con ejemplo de uso al principio del archivo.

---

## 📋 Resumen de Componentes Disponibles

| Componente | Ubicación | Uso Principal |
|------------|-----------|---------------|
| **Modal** | `components/common/Modal.tsx` | Ventanas emergentes, formularios |
| **Pagination** | `components/common/Pagination.tsx` | Paginación de tablas y listados |
| **PrivateRoute** | `components/common/PrivateRoute.tsx` | Protección de rutas (ya implementado) |
| **Sidebar** | `components/layout/Sidebar.tsx` | Navegación (ya en el Layout) |
| **TopBar** | `components/layout/TopBar.tsx` | Barra superior (ya en el Layout) |

---

## 💡 Consejos Finales

1. **Siempre verifica si existe un componente** antes de crear el tuyo
2. **Pregunta al equipo** si tienes dudas sobre cómo usar un componente
3. **Mira ejemplos en `backoffice/instituciones`** para ver patrones de uso
4. **No reinventes la rueda** - Si existe, úsalo
5. **Mantén consistencia** - Usa los mismos componentes que el resto del equipo

---

## 🤔 ¿Necesitas un Nuevo Componente?

Si necesitas funcionalidad que no existe:

1. **Verifica primero** que no exista una librería de Tailwind UI
2. **Consulta con el equipo** - Quizás alguien ya lo hizo
3. **Crea el componente** en `components/common/` o `components/ui/`
4. **Documéntalo bien** - Explica cómo se usa
5. **Comparte con el equipo** - Avisa que hay un nuevo componente disponible

---

**¡Con estos componentes puedes desarrollar tu módulo mucho más rápido!** 🚀

**💬 Dudas? PREGUNTA!** No pierdas tiempo reinventando algo que ya existe.
