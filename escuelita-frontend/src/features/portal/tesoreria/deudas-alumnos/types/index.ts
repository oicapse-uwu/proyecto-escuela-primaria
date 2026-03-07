// Types para el módulo de Deudas de Alumnos

export interface DeudasAlumno {
    idDeuda: number;
    descripcionCuota: string;
    montoTotal: number;
    fechaEmision: string;
    fechaVencimiento: string;
    estadoDeuda: 'Pendiente' | 'Pagado' | 'Parcial';
    fechaPagoTotal: string | null;
    idConcepto: {
        idConcepto: number;
        nombreConcepto: string;
        monto: number;
    };
    idMatricula: {
        idMatricula: number;
        numMatricula: string;
        idAlumno: {
            idAlumno: number;
            nombres: string;
            apellidos: string;
        };
    };
    estado: number;
}

export interface DeudasAlumnoFormData {
    descripcionCuota: string;
    montoTotal: number;
    fechaEmision: string;
    fechaVencimiento: string;
    estadoDeuda: string;
    idConcepto: number;
    idMatricula: number;
}

export interface DeudasAlumnoDTO {
    idDeuda?: number;
    descripcionCuota: string;
    montoTotal: number;
    fechaEmision: string;
    fechaVencimiento: string;
    estadoDeuda: string;
    idConcepto: number;
    idMatricula: number;
}
