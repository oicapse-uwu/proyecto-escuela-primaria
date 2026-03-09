import { Building2, Edit, Plus, Trash2, Users } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { toast, Toaster } from 'sonner';
import Pagination from '../../../../components/common/Pagination';
import { SearchFilterBar } from '../../../../components/common/SearchFilterBar';
import AdministradorForm from '../components/AdministradorForm';
import { useUsuariosSistema } from '../hooks/useUsuariosSistema';
import type { AdministradorFormData, UsuarioSistema } from '../types';

const AdministradoresPage: React.FC = () => {
    const {
        usuarios,
        roles,
        sedes,
        tiposDocumento,
        isLoading,
        crear,
        actualizar,
        eliminar
    } = useUsuariosSistema();

    const [showForm, setShowForm] = useState(false);
    const [adminEditar, setAdminEditar] = useState<UsuarioSistema | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRol, setFilterRol] = useState<string>('todos');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const normalizeText = (value?: string | number | null) =>
        String(value ?? '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

    // Filtrar solo usuarios con rol ADMINISTRADOR
    const administradores = useMemo(() => {
        return usuarios.filter(usuario => {
            const nombreRol = normalizeText(usuario.idRol?.nombre || '');
            return nombreRol === 'administrador';
        });
    }, [usuarios]);

    const usuariosFiltrados = useMemo(() => {
        const search = normalizeText(searchTerm.trim());

        return administradores.filter(item => {
            const matchRol = filterRol === 'todos' || String(item.idRol?.idRol || '') === filterRol;

            const candidato = [
                item.nombres,
                item.apellidos,
                `${item.nombres || ''} ${item.apellidos || ''}`,
                item.usuario,
                item.correo,
                item.numeroDocumento,
                item.idRol?.nombre,
                item.idSede?.nombreSede,
                item.idTipoDoc?.abreviatura,
                item.idTipoDoc?.descripcion
            ]
                .map((value) => normalizeText(value))
                .join(' ');

            const matchSearch = !search || candidato.includes(search);

            return matchRol && matchSearch;
        });
    }, [administradores, searchTerm, filterRol]);

    // Filtrar solo roles de administrador para el dropdown
    const rolesAdministrador = useMemo(() => {
        return roles.filter(rol => normalizeText(rol.nombre).includes('administrador'));
    }, [roles]);

    // Opciones de filtro para SearchFilterBar
    const filterOptions = useMemo(() => [
        { value: 'todos', label: 'Todos los roles' },
        ...rolesAdministrador.map(rol => ({ value: String(rol.idRol), label: rol.nombre }))
    ], [rolesAdministrador]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const usuariosPaginados = usuariosFiltrados.slice(indexOfFirstItem, indexOfLastItem);

    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterRol]);

    const handleNuevo = () => {
        setAdminEditar(null);
        setShowForm(true);
    };

    const handleEditar = (administrador: UsuarioSistema) => {
        setAdminEditar(administrador);
        setShowForm(true);
        toast.info('Si dejas la contraseña vacía, se conservará la contraseña actual.');
    };

    const handleEliminar = async (id: number) => {
        if (window.confirm('¿Está seguro de eliminar este administrador?')) {
            await eliminar(id);
        }
    };

    const handleSubmit = async (data: AdministradorFormData) => {
        if (adminEditar) {
            await actualizar({
                idUsuario: adminEditar.idUsuario,
                numeroDocumento: data.numeroDocumento,
                apellidos: data.apellidos,
                nombres: data.nombres,
                correo: data.correo,
                usuario: data.usuario,
                contrasena: data.contrasena || '',
                fotoPerfil: data.fotoPerfil || '',
                idSede: data.idSede,
                idRol: data.idRol,
                idTipoDoc: data.idTipoDoc
            });
        } else {
            await crear(data);
        }

        setShowForm(false);
        setAdminEditar(null);
    };

    return (
        <div className="px-3 pt-6 pb-3 sm:px-4 sm:pt-8 sm:pb-4 lg:px-6 lg:pt-8 lg:pb-6 overflow-x-hidden">
            <Toaster position="top-right" richColors />

            <div className="mb-3 lg:mb-4">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 flex items-center space-x-3">
                            <Users className="w-7 h-7 lg:w-8 lg:h-8 text-primary" />
                            <span>Administradores</span>
                        </h1>
                        <p className="text-gray-600 mt-2 text-sm lg:text-base">
                            Gestiona los usuarios administrativos registrados en las instituciones
                        </p>
                    </div>
                    <button
                        onClick={handleNuevo}
                        className="bg-gradient-to-r from-[#1e3a8a] to-[#1e1b4b] text-white px-6 py-2.5 rounded-lg hover:from-[#1e40af] hover:to-[#312e81] transition-colors flex items-center justify-center gap-2 shadow-md font-semibold whitespace-nowrap w-full sm:w-auto"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Nuevo Administrador</span>
                    </button>
                </div>
            </div>

            <SearchFilterBar
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Buscar por nombre, usuario o correo..."
                filterValue={filterRol}
                onFilterChange={setFilterRol}
                filterOptions={filterOptions}
            />

            <div className="bg-white rounded-lg shadow overflow-hidden">
                {isLoading ? (
                    <div className="flex-1 flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                    </div>
                ) : usuariosPaginados.length === 0 ? (
                    <div className="flex-1 text-center py-12">
                        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No se encontraron administradores</p>
                    </div>
                ) : (
                    <>
                        <div className="md:hidden space-y-3 p-3">
                            {usuariosPaginados.map((item) => (
                                <div key={item.idUsuario} className="rounded-lg border border-gray-200 p-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
                                                {item.nombres} {item.apellidos}
                                            </h3>
                                            <p className="text-xs text-gray-500">{item.usuario}</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleEditar(item)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Editar"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEliminar(item.idUsuario)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-1 mt-3 text-xs">
                                        <p><span className="text-gray-500">Correo:</span> <span className="text-gray-900">{item.correo}</span></p>
                                        <p><span className="text-gray-500">Rol:</span> <span className="text-gray-900">{item.idRol?.nombre || '-'}</span></p>
                                        {item.idSede?.idInstitucion?.nombre ? (
                                            <p>
                                                <span className="text-gray-500">Escuela:</span> <span className="text-gray-900 font-medium">{item.idSede.idInstitucion.nombre}</span>
                                                <br />
                                                <span className="text-gray-500">Sede:</span> <span className="text-gray-900">{item.idSede.nombreSede}</span>
                                            </p>
                                        ) : (
                                            <p><span className="text-gray-500">Escuela/Sede:</span> <span className="text-gray-900">-</span></p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="hidden md:block overflow-x-auto max-w-full">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 sticky top-0 z-10">
                                    <tr>
                                        <th className="pl-6 pr-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[160px]">Nombre completo</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">Usuario</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">Rol</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[160px]">Escuela / Sede</th>
                                        <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[70px]">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {usuariosPaginados.map((item) => (
                                        <tr key={item.idUsuario} className="hover:bg-gray-50">
                                            <td className="pl-6 pr-2 py-3 whitespace-nowrap text-xs text-gray-900 min-w-[160px]">
                                                {item.nombres} {item.apellidos}
                                            </td>
                                            <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-700 min-w-[80px]">
                                                {item.usuario}
                                            </td>
                                            <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-700 min-w-[100px]">
                                                {item.idRol?.nombre || '-'}
                                            </td>
                                            <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-700 min-w-[160px]">
                                                <div className="flex items-center gap-1">
                                                    <Building2 className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                                    <div>
                                                        {item.idSede?.idInstitucion?.nombre ? (
                                                            <div>
                                                                <div className="font-medium text-gray-900">{item.idSede.idInstitucion.nombre}</div>
                                                                <div className="text-xs text-gray-500">{item.idSede.nombreSede}</div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-500">-</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-700 text-center min-w-[70px]">
                                                <div className="flex items-center justify-center space-x-3">
                                                    <button
                                                        onClick={() => handleEditar(item)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                        title="Editar"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEliminar(item.idUsuario)}
                                                        className="text-red-600 hover:text-red-900"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="border-t border-gray-200">
                            <Pagination
                                currentPage={currentPage}
                                totalItems={usuariosFiltrados.length}
                                itemsPerPage={itemsPerPage}
                                onPageChange={setCurrentPage}
                                onItemsPerPageChange={setItemsPerPage}
                            />
                        </div>
                    </>
                )}
            </div>

            {showForm && (
                <AdministradorForm
                    administrador={adminEditar}
                    roles={rolesAdministrador}
                    sedes={sedes}
                    tiposDocumento={tiposDocumento}
                    onSubmit={handleSubmit}
                    onCancel={() => {
                        setShowForm(false);
                        setAdminEditar(null);
                    }}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
};

export default AdministradoresPage;
