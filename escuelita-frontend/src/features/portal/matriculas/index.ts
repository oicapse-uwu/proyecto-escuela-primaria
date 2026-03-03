// Feature: Matrículas (Portal)
// Exporta todas las utilidades relacionadas con la gestión de matrículas

// Tipos
export type {
    AnioEscolar, DocumentoAlumno,
    DocumentoAlumnoDTO,
    DocumentoAlumnoFormData, Matricula,
    MatriculaDTO,
    MatriculaFormData, RequisitoDocumento,
    RequisitoDocumentoDTO,
    RequisitoDocumentoFormData, Seccion
} from './types';

// API Matrículas
export {
    actualizarMatricula, crearMatricula, eliminarMatricula, obtenerMatriculaPorId,
    obtenerMatriculasPorAlumno, obtenerTodasMatriculas, obtenerTodasSecciones, obtenerTodosAniosEscolares
} from './api/matriculasApi';

// API Requisitos
export {
    actualizarRequisito, crearRequisito, eliminarRequisito, obtenerRequisitoPorId, obtenerTodosRequisitos
} from './api/requisitosApi';

// API Documentos Alumno
export {
    actualizarDocumento, crearDocumento, eliminarDocumento, obtenerDocumentoPorId,
    obtenerDocumentosPorAlumno, obtenerTodosDocumentos
} from './api/documentosAlumnoApi';

// Páginas
export { default as MatriculasPage } from './pages/MatriculasPage';
export { default as RequisitosPage } from './pages/RequisitosPage';

