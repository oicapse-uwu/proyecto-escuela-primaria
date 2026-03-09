import React from 'react';
import { usePermisoModulo } from '../../hooks/usePermisoModulo';

interface AccionPermiso {
  codigo: string;
  etiqueta: string;
  icono?: React.ReactNode;
  color?: 'primary' | 'danger' | 'success' | 'warning';
  onClick: () => void;
  disabled?: boolean;
}

interface AccionesBotoneProps {
  idModulo: number;
  acciones: AccionPermiso[];
  layout?: 'horizontal' | 'vertical'; // horizontal = fila, vertical = columna
  className?: string;
}

/**
 * Componente que muestra botones de acción solo si el usuario tiene permisos
 * @example
 * <AccionesBotones
 *   idModulo={5}
 *   acciones={[
 *     { codigo: 'CREAR', etiqueta: 'Agregar', onClick: handleAgregar },
 *     { codigo: 'EDITAR', etiqueta: 'Editar', onClick: handleEditar },
 *     { codigo: 'ELIMINAR', etiqueta: 'Eliminar', color: 'danger', onClick: handleEliminar },
 *   ]}
 * />
 */
export const AccionesBotones: React.FC<AccionesBotoneProps> = ({
  idModulo,
  acciones,
  layout = 'horizontal',
  className = '',
}) => {
  const tieneAccesoAlModulo = usePermisoModulo(idModulo);
  const accionesConPermiso = acciones.map(accion => ({
    ...accion,
    tienePermiso: tieneAccesoAlModulo,
  }));

  const accionesVisibles = accionesConPermiso.filter(a => a.tienePermiso);

  if (!accionesVisibles.length) {
    return null; // No mostrar nada si no hay permisos
  }

  const containerClass = `flex ${
    layout === 'vertical' ? 'flex-col gap-2' : 'gap-2'
  } ${className}`;

  return (
    <div className={containerClass}>
      {accionesVisibles.map((accion) => (
        <button
          key={accion.codigo}
          onClick={accion.onClick}
          disabled={accion.disabled}
          className={`
            flex items-center gap-2 px-3 py-2 rounded transition
            ${
              accion.color === 'danger'
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : accion.color === 'success'
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : accion.color === 'warning'
                ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }
            ${accion.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          title={`Permiso: ${accion.codigo}`}
        >
          {accion.icono}
          {accion.etiqueta}
        </button>
      ))}
    </div>
  );
};

/**
 * Componente condicional para mostrar/ocultar contenido basado en permisos
 * @example
 * <SoloConPermiso idModulo={5} permiso="EDITAR">
 *   <EditForm />
 * </SoloConPermiso>
 */
interface SoloConPermisoProps {
  idModulo: number;
  permiso: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const SoloConPermiso: React.FC<SoloConPermisoProps> = ({
  idModulo,
  children,
  fallback = null,
}) => {
  const tienePermiso = usePermisoModulo(idModulo);
  return tienePermiso ? <>{children}</> : <>{fallback}</>;
};
