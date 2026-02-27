// Tipos relacionados con Sedes
export interface Sede {
    idSede: number;
    nombreSede: string;
    direccion?: string;
    telefono?: string;
    estado?: number;
}

// Tipos relacionados con Tipo de Documentos
export interface TipoDocumento {
    idTipoDoc: number;
    nombreDocumento: string;
    abreviatura?: string;
    estado?: number;
}

// Tipo principal para Alumno (respuesta del backend)
export interface Alumno {
    idAlumno: number;
    numeroDocumento: string;
    nombres: string;
    apellidos: string;
    fechaNacimiento: string; // formato: YYYY-MM-DD
    genero: 'M' | 'F';
    direccion?: string;
    telefonoContacto?: string;
    fotoUrl?: string;
    observacionesSalud?: string;
    tipoIngreso?: string;
    estadoAlumno?: string;
    idSede: Sede;
    idTipoDoc: TipoDocumento;
    estado?: number;
}

// DTO para crear/actualizar alumno (envío al backend)
export interface AlumnoDTO {
    idAlumno?: number;
    idSede: number;
    idTipoDoc: number;
    numeroDocumento: string;
    nombres: string;
    apellidos: string;
    fechaNacimiento: string; // formato: YYYY-MM-DD
    genero: 'M' | 'F';
    direccion?: string;
    telefonoContacto?: string;
    fotoUrl?: string;
    observacionesSalud?: string;
    tipoIngreso?: string;
    estadoAlumno?: string;
}

// Tipo para formulario de alumno
export interface AlumnoFormData extends Omit<AlumnoDTO, 'idAlumno'> {
    idAlumno?: number;
}
