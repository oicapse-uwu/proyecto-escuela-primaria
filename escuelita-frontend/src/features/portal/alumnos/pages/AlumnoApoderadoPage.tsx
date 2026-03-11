import { Edit, Link2, Plus, Search, Trash2, User, UserPlus, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';
import Modal from '../../../../components/common/Modal';
import Pagination from '../../../../components/common/Pagination';
import { filtrarPorSedeActual } from '../../../../utils/sedeFilter';
import { obtenerTodosApoderados } from '../../apoderados/api/apoderadosApi';
import type { Apoderado } from '../../apoderados/types';
import {
    actualizarRelacion,
    crearRelacion,
    eliminarRelacion,
    obtenerTodasRelaciones
} from '../api/alumnoApoderadoApi';
import { obtenerTodosAlumnos } from '../api/alumnosApi';
import type { Alumno } from '../types';
import type { AlumnoApoderado, AlumnoApoderadoFormData } from '../types/alumnoApoderado.types';

const AlumnoApoderadoPage: React.FC = () => {
    const [relaciones, setRelaciones] = useState<AlumnoApoderado[]>([]);
    const [alumnos, setAlumnos] = useState<Alumno[]>([]);
    const [apoderados, setApoderados] = useState<Apoderado[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [relacionEditar, setRelacionEditar] = useState<AlumnoApoderado | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [formData, setFormData] = useState<AlumnoApoderadoFormData>({
        idAlumno: 0,
        idApoderado: 0,
        parentesco: '',
        esRepresentanteFinanciero: false,
        viveConEstudiante: false
    });

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            setLoading(true);
            const [relacionesData, alumnosData, apoderadosData] = await Promise.all([
                obtenerTodasRelaciones(),
                obtenerTodosAlumnos(),
                obtenerTodosApoderados()
            ]);
            // 🔒 FILTRAR POR SEDE DEL USUARIO ACTUAL
            const alumnosFiltrados = filtrarPorSedeActual(alumnosData);
            const apoderadosFiltrados = filtrarPorSedeActual(apoderadosData);
            // Las relaciones se filtran por la sede del alumno (idAlumno.idSede)
            const user = JSON.parse(localStorage.getItem('escuela_user') || '{}');
            const idSedeActual = user?.sede?.idSede;
            const relacionesFiltradas = relacionesData.filter(r => 
                r.idAlumno?.idSede?.idSede === idSedeActual
            );
            setRelaciones(relacionesFiltradas);
            setAlumnos(alumnosFiltrados);
            setApoderados(apoderadosFiltrados);
        } catch (error) {
            console.error('Error cargando datos:', error);
            toast.error('Error al cargar datos');
        } finally {
            setLoading(false);
        }
    };

    const normalizeText = (value?: string | number | null) =>
        String(value ?? '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

    const relacionesFiltradas = relaciones.filter(rel => {
        const search = normalizeText(searchTerm.trim());
        if (!search) return true;

        const nombreAlumno = `${rel.idAlumno.nombres} ${rel.idAlumno.apellidos}`;
        const nombreApoderado = `${rel.idApoderado.nombres} ${rel.idApoderado.apellidos}`;

        return (
            normalizeText(nombreAlumno).includes(search) ||
            normalizeText(nombreApoderado).includes(search) ||
            normalizeText(rel.parentesco).includes(search)
        );
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const relacionesPaginadas = relacionesFiltradas.slice(indexOfFirstItem, indexOfLastItem);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleNuevo = () => {
        setRelacionEditar(null);
        setFormData({
            idAlumno: 0,
            idApoderado: 0,
            parentesco: '',
            esRepresentanteFinanciero: false,
            viveConEstudiante: false
        });
        setShowModal(true);
    };

    const handleEditar = (relacion: AlumnoApoderado) => {
        setRelacionEditar(relacion);
        setFormData({
            idAlumnoApoderado: relacion.idAlumnoApoderado,
            idAlumno: relacion.idAlumno.idAlumno,
            idApoderado: relacion.idApoderado.idApoderado,
            parentesco: relacion.parentesco,
            esRepresentanteFinanciero: relacion.esRepresentanteFinanciero,
            viveConEstudiante: relacion.viveConEstudiante
        });
        setShowModal(true);
    };

    const handleEliminar = async (id: number) => {
        if (window.confirm('¿Está seguro de eliminar esta relación?')) {
            try {
                await eliminarRelacion(id);
                toast.success('Relación eliminada exitosamente');
                cargarDatos();
            } catch (error) {
                toast.error('Error al eliminar la relación');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.idAlumno || formData.idAlumno === 0) {
            toast.error('Debe seleccionar un alumno');
            return;
        }
        if (!formData.idApoderado || formData.idApoderado === 0) {
            toast.error('Debe seleccionar un apoderado');
            return;
        }
        if (!formData.parentesco.trim()) {
            toast.error('El parentesco es obligatorio');
            return;
        }

        try {
            if (relacionEditar) {
                await actualizarRelacion(relacionEditar.idAlumnoApoderado, formData);
                toast.success('Relación actualizada exitosamente');
            } else {
                await crearRelacion(formData);
                toast.success('Relación creada exitosamente');
            }
            setShowModal(false);
            cargarDatos();
        } catch (error) {
            toast.error(relacionEditar ? 'Error al actualizar la relación' : 'Error al crear la relación');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">Cargando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="px-3 pt-6 pb-3 sm:px-4 sm:pt-8 sm:pb-4 lg:px-6 lg:pt-8 lg:pb-6 overflow-x-hidden">
            <Toaster position="top-right" richColors />
            
            {/* Encabezado */}
            <div className="mb-3 lg:mb-4">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 flex items-center space-x-3">
                            <Link2 className="w-7 h-7 text-primary" />
                            <span>Relación Alumno-Apoderado</span>
                        </h1>
                        <p className="text-gray-600 mt-1 text-sm lg:text-base">
                            {relacionesFiltradas.length} {relacionesFiltradas.length === 1 ? 'relación' : 'relaciones'} registradas
                        </p>
                    </div>
                    <button
                        onClick={handleNuevo}
                        className="bg-gradient-to-r from-escuela to-escuela-light text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Nueva Relación</span>
                    </button>
                </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Relaciones</p>
                            <p className="text-2xl font-bold text-gray-800">{relacionesFiltradas.length}</p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <Link2 className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Representantes Financieros</p>
                            <p className="text-2xl font-bold text-green-600">
                                {relacionesFiltradas.filter(r => r.esRepresentanteFinanciero).length}
                            </p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                            <UserPlus className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Viven con Alumno</p>
                            <p className="text-2xl font-bold text-purple-600">
                                {relacionesFiltradas.filter(r => r.viveConEstudiante).length}
                            </p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg">
                            <Users className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Búsqueda */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar por alumno, apoderado o parentesco..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg 
                                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <select
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value={10}>10 por página</option>
                        <option value={25}>25 por página</option>
                        <option value={50}>50 por página</option>
                        <option value={100}>100 por página</option>
                    </select>
                </div>
            </div>

            {/* Tabla - Desktop */}
            <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Alumno
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Apoderado
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Parentesco
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Rep. Financiero
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Vive con Alumno
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {relacionesPaginadas.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        <Link2 className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                        <p className="text-lg font-medium">No se encontraron relaciones</p>
                                        <p className="text-sm mt-1">
                                            {searchTerm 
                                                ? 'Intenta con otros criterios de búsqueda' 
                                                : 'Crea tu primera relación haciendo clic en "Nueva Relación"'
                                            }
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                relacionesPaginadas.map((relacion) => (
                                    <tr key={relacion.idAlumnoApoderado} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="text-sm">
                                                    <p className="font-medium text-gray-900 uppercase">
                                                        {relacion.idAlumno.nombres} {relacion.idAlumno.apellidos}
                                                    </p>
                                                    <p className="text-gray-500">{relacion.idAlumno.numeroDocumento}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm">
                                                <p className="font-medium text-gray-900 uppercase">
                                                    {relacion.idApoderado.nombres} {relacion.idApoderado.apellidos}
                                                </p>
                                                <p className="text-gray-500">{relacion.idApoderado.numeroDocumento}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                           bg-blue-100 text-blue-800">
                                                {relacion.parentesco}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            {relacion.esRepresentanteFinanciero ? (
                                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                    Sí
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
                                                    No
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            {relacion.viveConEstudiante ? (
                                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                                                    Sí
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
                                                    No
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEditar(relacion)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleEliminar(relacion.idAlumnoApoderado)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Cards - Mobile */}
            <div className="lg:hidden space-y-3">
                {relacionesPaginadas.length === 0 ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                        <Link2 className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                        <p className="text-lg font-medium text-gray-900">No se encontraron relaciones</p>
                        <p className="text-sm text-gray-500 mt-1">
                            {searchTerm 
                                ? 'Intenta con otros criterios de búsqueda' 
                                : 'Crea tu primera relación haciendo clic en "Nueva Relación"'
                            }
                        </p>
                    </div>
                ) : (
                    relacionesPaginadas.map((relacion) => (
                        <div key={relacion.idAlumnoApoderado} className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                            {relacion.parentesco}
                                        </span>
                                        {relacion.esRepresentanteFinanciero && (
                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                Rep. Financiero
                                            </span>
                                        )}
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div>
                                            <p className="text-gray-500 text-xs">Alumno:</p>
                                            <p className="font-medium text-gray-900 uppercase">
                                                {relacion.idAlumno.nombres} {relacion.idAlumno.apellidos}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-xs">Apoderado:</p>
                                            <p className="font-medium text-gray-900 uppercase">
                                                {relacion.idApoderado.nombres} {relacion.idApoderado.apellidos}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => handleEditar(relacion)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleEliminar(relacion.idAlumnoApoderado)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Paginación */}
            {relacionesFiltradas.length > 0 && (
                <div className="mt-4">
                    <Pagination
                        currentPage={currentPage}
                        totalItems={relacionesFiltradas.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={setItemsPerPage}
                    />
                </div>
            )}

            {/* Modal de formulario */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={relacionEditar ? 'Editar Relación' : 'Nueva Relación'}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Alumno */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <User className="inline w-4 h-4 mr-1" />
                                Alumno <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.idAlumno}
                                onChange={(e) => setFormData({...formData, idAlumno: Number(e.target.value)})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value={0}>Seleccione un alumno</option>
                                {alumnos.map(alumno => (
                                    <option key={alumno.idAlumno} value={alumno.idAlumno}>
                                        {alumno.nombres} {alumno.apellidos} - {alumno.numeroDocumento}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Apoderado */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <User className="inline w-4 h-4 mr-1" />
                                Apoderado <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.idApoderado}
                                onChange={(e) => setFormData({...formData, idApoderado: Number(e.target.value)})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value={0}>Seleccione un apoderado</option>
                                {apoderados.map(apoderado => (
                                    <option key={apoderado.idApoderado} value={apoderado.idApoderado}>
                                        {apoderado.nombres} {apoderado.apellidos} - {apoderado.numeroDocumento}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Parentesco */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Parentesco <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.parentesco}
                            onChange={(e) => setFormData({...formData, parentesco: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Seleccione parentesco</option>
                            <option value="Padre">Padre</option>
                            <option value="Madre">Madre</option>
                            <option value="Tutor">Tutor</option>
                            <option value="Abuelo/a">Abuelo/a</option>
                            <option value="Tío/a">Tío/a</option>
                            <option value="Hermano/a">Hermano/a</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>

                    {/* Checkboxes */}
                    <div className="space-y-3">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={formData.esRepresentanteFinanciero}
                                onChange={(e) => setFormData({...formData, esRepresentanteFinanciero: e.target.checked})}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Es representante financiero</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={formData.viveConEstudiante}
                                onChange={(e) => setFormData({...formData, viveConEstudiante: e.target.checked})}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Vive con el alumno</span>
                        </label>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 
                                     transition-colors duration-200 font-medium"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 bg-gradient-to-r from-escuela to-escuela-light text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                        >
                            {relacionEditar ? 'Actualizar' : 'Crear'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default AlumnoApoderadoPage;
