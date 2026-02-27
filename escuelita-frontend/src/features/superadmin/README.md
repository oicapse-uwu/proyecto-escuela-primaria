# Feature: Super Admin

Módulo completo para la gestión del panel de administración SaaS de Escuelita.

## Estructura

```
superadmin/
├── dashboard/           # Módulo Dashboard
│   ├── pages/
│   │   └── Dashboard.tsx
│   └── index.ts
└── index.ts            # Exportaciones principales
```

## Módulos

### Dashboard
Vista principal con estadísticas y resumen del sistema:
- Instituciones activas
- Suscripciones
- Usuarios totales
- Ingresos del mes

**Uso:**
```tsx
import { Dashboard } from '@/features/superadmin';
```

## Próximos Módulos

Siguiendo la misma estructura, se crearán:
- `instituciones/` - Gestión de instituciones
- `suscripciones/` - Gestión de planes y pagos
- `usuarios/` - Administración de usuarios del sistema
- `reportes/` - Reportes y estadísticas avanzadas

Cada módulo tendrá:
- `api/` - Servicios y llamadas al backend
- `components/` - Componentes específicos del módulo
- `hooks/` - Hooks personalizados
- `pages/` - Páginas del módulo
- `types/` - Tipos TypeScript
- `index.ts` - Exportaciones
