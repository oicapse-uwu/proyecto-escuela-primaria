// ==========================================
// 1. INSTITUCIÓN
// ==========================================
export interface Institucion {
    idInstitucion: number;
    nombre: string;
    codModular?: string;
    tipoGestion?: string;
    resolucionCreacion?: string;
    nombreDirector?: string;
    logoPath?: string;
    estadoSuscripcion?: string;
    fechaInicioSuscripcion?: string;
    fechaVencimientoLicencia?: string;
    planContratado?: string;
    estado?: number;
}

export interface InstitucionDTO {
    idInstitucion?: number;
    nombre: string;
    codModular?: string;
    tipoGestion?: string;
    resolucionCreacion?: string;
    nombreDirector?: string;
    logoPath?: string;
    estadoSuscripcion?: string;
    fechaInicioSuscripcion?: string;
    fechaVencimientoLicencia?: string;
    planContratado?: string;
}

export interface InstitucionFormData extends Omit<InstitucionDTO, 'idInstitucion'> {
    idInstitucion?: number;
}

// ==========================================
// 2. SEDES
// ==========================================
export interface Sede {
    idSede: number;
    nombreSede: string;
    direccion?: string;
    distrito?: string;
    provincia?: string;
    departamento?: string;
    ugel?: string;
    telefono?: string;
    correoInstitucional?: string;
    idInstitucion: Institucion; // Objeto completo
    estado?: number;
}

export interface SedeDTO {
    idSede?: number;
    nombreSede: string;
    direccion?: string;
    distrito?: string;
    provincia?: string;
    departamento?: string;
    ugel?: string;
    telefono?: string;
    correoInstitucional?: string;
    idInstitucion: number; // Solo el ID para enviar al backend
}

export interface SedeFormData extends Omit<SedeDTO, 'idSede'> {
    idSede?: number;
}

// ==========================================
// 3. AÑO ESCOLAR
// ==========================================
export interface AnioEscolar {
    idAnioEscolar: number;
    nombreAnio: string;
    fechaInicio?: string;
    fechaFin?: string;
    activo?: boolean;
    estado?: number;
}

export interface AnioEscolarDTO {
    idAnioEscolar?: number;
    nombreAnio: string;
    fechaInicio?: string;
    fechaFin?: string;
    activo?: boolean;
}

export interface AnioEscolarFormData extends Omit<AnioEscolarDTO, 'idAnioEscolar'> {
    idAnioEscolar?: number;
}

// ==========================================
// 4. PERIODOS
// ==========================================
export interface Periodo {
    idPeriodo: number;
    nombrePeriodo: string;
    fechaInicio?: string;
    fechaFin?: string;
    idAnio: AnioEscolar; // Objeto completo
    estado?: number;
}

export interface PeriodoDTO {
    idPeriodo?: number;
    nombrePeriodo: string;
    fechaInicio?: string;
    fechaFin?: string;
    idAnio: number; // Solo ID
}

export interface PeriodoFormData extends Omit<PeriodoDTO, 'idPeriodo'> {
    idPeriodo?: number;
}

// ==========================================
// 5. GRADOS
// ==========================================
export interface Grado {
    idGrado: number;
    nombreGrado: string;
    idSede: Sede; // Objeto completo
    estado?: number;
}

export interface GradoDTO {
    idGrado?: number;
    nombreGrado: string;
    idSede: number; // Solo ID
}

export interface GradoFormData extends Omit<GradoDTO, 'idGrado'> {
    idGrado?: number;
}

// ==========================================
// 6. SECCIONES
// ==========================================
export interface Seccion {
    idSeccion: number;
    nombreSeccion: string;
    vacantes?: number;
    idGrado: Grado; // Objeto completo
    idSede: Sede;   // Objeto completo
    estado?: number;
}

export interface SeccionDTO {
    idSeccion?: number;
    nombreSeccion: string;
    vacantes?: number;
    idGrado: number; // Solo ID
    idSede: number;  // Solo ID
}

export interface SeccionFormData extends Omit<SeccionDTO, 'idSeccion'> {
    idSeccion?: number;
}

// ==========================================
// 7. AULAS
// ==========================================
export interface Aula {
    idAula: number;
    nombreAula: string;
    capacidad?: number;
    idSede: Sede; // Objeto completo
    estado?: number;
}

export interface AulaDTO {
    idAula?: number;
    nombreAula: string;
    capacidad?: number;
    idSede: number; // Solo ID
}

export interface AulaFormData extends Omit<AulaDTO, 'idAula'> {
    idAula?: number;
}