// Tipos para la relación Alumno-Apoderado
import type { Alumno } from '../../alumnos/types';
import type { Apoderado } from '../../apoderados/types';

export interface AlumnoApoderado {
    idAlumnoApoderado: number;
    parentesco: string;
    esRepresentanteFinanciero: boolean;
    viveConEstudiante: boolean;
    idAlumno: Alumno;
    idApoderado: Apoderado;
    estado?: number;
}

export interface AlumnoApoderadoDTO {
    idAlumnoApoderado?: number;
    idAlumno: number;
    idApoderado: number;
    parentesco: string;
    esRepresentanteFinanciero: boolean;
    viveConEstudiante: boolean;
}

export interface AlumnoApoderadoFormData extends Omit<AlumnoApoderadoDTO, 'idAlumnoApoderado'> {
    idAlumnoApoderado?: number;
}
