// Tipos relacionados con Institución
export interface Institucion {
    idInstitucion: number;
    nombre: string;
    codModular?: string;
    tipoGestion?: string;
}

// Tipos relacionados con Sedes (importado desde alumnos para reutilización)
export interface Sede {
    idSede: number;
    nombreSede: string;
    direccion?: string;
    telefono?: string;
    estado?: number;
    idInstitucion?: Institucion;
}

// Tipos relacionados con Tipo de Documentos
export interface TipoDocumento {
    idDocumento: number;
    descripcion: string;
    abreviatura?: string;
    longitudMaxima?: number;
    eslongitudExacta?: number;
    estado?: number;
}

// Tipo principal para Apoderado (respuesta del backend)
export interface Apoderado {
    idApoderado: number;
    numeroDocumento: string;
    nombres: string;
    apellidos: string;
    telefonoPrincipal: string;
    correo?: string;
    lugarTrabajo?: string;
    idSede: Sede;
    idTipoDoc: TipoDocumento;
    estado?: number;
}

// DTO para crear/actualizar apoderado (envío al backend)
export interface ApoderadoDTO {
    idApoderado?: number;
    idSede: number;
    idTipoDoc: number;
    numeroDocumento: string;
    nombres: string;
    apellidos: string;
    telefonoPrincipal: string;
    correo?: string;
    lugarTrabajo?: string;
}

// Tipo para formulario de apoderado
export interface ApoderadoFormData extends Omit<ApoderadoDTO, 'idApoderado'> {
    idApoderado?: number;
}
