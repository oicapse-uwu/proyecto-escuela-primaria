import { Building2, FileSpreadsheet, FileText, Search, Users } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import Pagination from '../../../../components/common/Pagination';
import { useReportes } from '../hooks/useReportes';
import { exportarExcel, exportarPdf } from '../utils/exportUtils';

type UsoTab = 'usuarios' | 'instituciones' | 'sedes';

const tabs: { key: UsoTab; label: string }[] = [
    { key: 'usuarios', label: 'Usuarios' },
    { key: 'instituciones', label: 'Uso por Institución' },
    { key: 'sedes', label: 'Top Sedes' }
];

const normalizeText = (value?: string | number | null) =>
    String(value ?? '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

const UsoSistemaPage: React.FC = () => {
    const { usuarios, usoPorInstitucion, resumen, isLoading } = useReportes();

    const [activeTab, setActiveTab] = useState<UsoTab>('usuarios');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRol, setFilterRol] = useState('todos');
    const [filterInstitucion, setFilterInstitucion] = useState('todos');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const usuariosFiltrados = useMemo(() => {
        const search = normalizeText(searchTerm.trim());

        return usuarios.filter((item) => {
            const matchRol = filterRol === 'todos' || String(item.idRol?.idRol || '') === filterRol;
            const matchInstitucion =
                filterInstitucion === 'todos' ||
                String(item.idSede?.idInstitucion?.idInstitucion || '') === filterInstitucion;

            const candidato = [
                item.nombres,
                item.apellidos,
                `${item.nombres || ''} ${item.apellidos || ''}`,
                item.usuario,
                item.correo,
                item.idRol?.nombre,
                item.idSede?.nombreSede,
                item.idSede?.idInstitucion?.nombre,
                item.numeroDocumento
            ]
                .map((value) => normalizeText(value))
                .join(' ');

            const matchSearch = !search || candidato.includes(search);

            return matchRol && matchInstitucion && matchSearch;
        });
    }, [usuarios, searchTerm, filterRol, filterInstitucion]);

    const usoPorInstitucionFiltrado = useMemo(() => {
        const search = normalizeText(searchTerm.trim());

        return usoPorInstitucion.filter((item) => {
            const matchInstitucion = filterInstitucion === 'todos' || String(item.idInstitucion) === filterInstitucion;
            const matchSearch =
                !search ||
                normalizeText(item.nombre).includes(search) ||
                normalizeText(item.codModular).includes(search);

            return matchInstitucion && matchSearch;
        });
    }, [usoPorInstitucion, searchTerm, filterInstitucion]);

    const sedesFiltradas = useMemo(() => {
        const map = new Map<string, number>();

        usuariosFiltrados.forEach((item) => {
            const sede = item.idSede?.nombreSede || 'Sin sede';
            map.set(sede, (map.get(sede) || 0) + 1);
        });

        return Array.from(map.entries())
            .map(([nombre, valor]) => ({ nombre, valor }))
            .sort((a, b) => b.valor - a.valor);
    }, [usuariosFiltrados]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const usuariosPaginados = usuariosFiltrados.slice(indexOfFirstItem, indexOfLastItem);
    const institucionesPaginadas = usoPorInstitucionFiltrado.slice(indexOfFirstItem, indexOfLastItem);
    const sedesPaginadas = sedesFiltradas.slice(indexOfFirstItem, indexOfLastItem);

    const totalItemsTab = activeTab === 'usuarios'
        ? usuariosFiltrados.length
        : activeTab === 'instituciones'
            ? usoPorInstitucionFiltrado.length
            : sedesFiltradas.length;

    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterRol, filterInstitucion, activeTab]);

    const rolesDisponibles = useMemo(() => {
        const map = new Map<number, string>();
        usuarios.forEach((user) => {
            if (user.idRol?.idRol && user.idRol?.nombre) {
                map.set(user.idRol.idRol, user.idRol.nombre);
            }
        });
        return Array.from(map.entries()).map(([id, nombre]) => ({ id, nombre }));
    }, [usuarios]);

    const institucionesDisponibles = useMemo(() => {
        const map = new Map<number, string>();
        usuarios.forEach((user) => {
            if (user.idSede?.idInstitucion?.idInstitucion && user.idSede?.idInstitucion?.nombre) {
                map.set(user.idSede.idInstitucion.idInstitucion, user.idSede.idInstitucion.nombre);
            }
        });
        return Array.from(map.entries()).map(([id, nombre]) => ({ id, nombre }));
    }, [usuarios]);

    const porcentajeFiltrado = usuarios.length > 0 ? (usuariosFiltrados.length / usuarios.length) * 100 : 0;

    const rowsExport = useMemo(
        () =>
            usuariosFiltrados.map((item) => ({
                nombres: `${item.nombres || ''} ${item.apellidos || ''}`.trim(),
                usuario: item.usuario || '',
                correo: item.correo || '',
                rol: item.idRol?.nombre || '-',
                sede: item.idSede?.nombreSede || '-',
                institucion: item.idSede?.idInstitucion?.nombre || '-',
                documento: item.numeroDocumento || ''
            })),
        [usuariosFiltrados]
    );

    const descargarExcel = () => {
        if (activeTab === 'instituciones') {
            exportarExcel(
                'reporte-uso-instituciones',
                'UsoInstituciones',
                usoPorInstitucionFiltrado.map((row) => ({
                    nombre: row.nombre,
                    codModular: row.codModular,
                    estadoSuscripcion: row.estadoSuscripcion || '-',
                    totalUsuarios: row.totalUsuarios,
                    porcentajeUso: `${row.porcentajeUso.toFixed(2)}%`
                })),
                {
                headers: {
                    nombre: 'Institución',
                    codModular: 'Código',
                    estadoSuscripcion: 'Estado',
                    totalUsuarios: 'Usuarios',
                    porcentajeUso: '% Uso'
                },
                columnWidths: [34, 16, 18, 12, 12]
                }
            );
            return;
        }

        if (activeTab === 'sedes') {
            exportarExcel('reporte-uso-sedes', 'TopSedes', sedesFiltradas, {
                headers: {
                    nombre: 'Sede',
                    valor: 'Usuarios'
                },
                columnWidths: [34, 14]
            });
            return;
        }

        exportarExcel('reporte-uso-sistema', 'UsoSistema', rowsExport, {
            headers: {
                nombres: 'Nombre completo',
                usuario: 'Usuario',
                correo: 'Correo',
                rol: 'Rol',
                sede: 'Sede',
                institucion: 'Institución',
                documento: 'Documento'
            },
            columnWidths: [30, 20, 30, 18, 20, 28, 16]
        });
    };

    const descargarPdf = () => {
        if (activeTab === 'instituciones') {
            exportarPdf(
                'Reporte de Uso por Institución',
                'reporte-uso-instituciones',
                ['Institución', 'Código', 'Estado', 'Usuarios', '% Uso'],
                usoPorInstitucionFiltrado.map((row) => [
                    row.nombre,
                    row.codModular,
                    row.estadoSuscripcion || '-',
                    String(row.totalUsuarios),
                    `${row.porcentajeUso.toFixed(2)}%`
                ])
            );
            return;
        }

        if (activeTab === 'sedes') {
            exportarPdf(
                'Reporte Top Sedes',
                'reporte-top-sedes',
                ['Sede', 'Usuarios'],
                sedesFiltradas.map((row) => [row.nombre, String(row.valor)])
            );
            return;
        }

        exportarPdf(
            'Reporte de Uso del Sistema',
            'reporte-uso-sistema',
            ['Nombre', 'Usuario', 'Correo', 'Rol', 'Sede', 'Institución', 'Documento'],
            rowsExport.map((row) => [row.nombres, row.usuario, row.correo, row.rol, row.sede, row.institucion, row.documento])
        );
    };

    const renderBody = () => {
        if (activeTab === 'instituciones') {
            return (
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institución</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuarios</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% Uso</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {institucionesPaginadas.map((item) => (
                            <tr key={item.idInstitucion} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.nombre}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.codModular}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.estadoSuscripcion || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.totalUsuarios}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary">{item.porcentajeUso.toFixed(2)}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }

        if (activeTab === 'sedes') {
            return (
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sede</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuarios</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sedesPaginadas.map((item) => (
                            <tr key={item.nombre} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.nombre}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary">{item.valor}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }

        return (
            <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sede</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {usuariosPaginados.map((item) => (
                            <tr key={item.idUsuario} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.nombres} {item.apellidos}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.usuario}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.correo}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.idRol?.nombre || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    <span className="inline-flex items-center gap-1">
                                        <Building2 className="w-4 h-4 text-gray-400" />
                                        {item.idSede?.nombreSede || '-'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
        );
    };

    return (
        <div className="p-3 sm:p-4 lg:p-5 pt-5 sm:pt-6 lg:pt-7">
            <div className="mb-4 flex items-start justify-between gap-2">
                <div>
                    <h1 className="text-2xl lg:text-[28px] font-bold text-gray-800 flex items-center gap-2">
                        <Users className="w-7 h-7 text-primary" />
                        <span>Uso del Sistema</span>
                    </h1>
                    <p className="text-gray-600 mt-1 text-sm">Filtro rápido + pestañas para analizar uso sin recargar la vista</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <button onClick={descargarExcel} className="bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-xs sm:text-sm">
                        <FileSpreadsheet className="w-4 h-4" />
                        <span>Excel</span>
                    </button>
                    <button onClick={descargarPdf} className="bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-xs sm:text-sm">
                        <FileText className="w-4 h-4" />
                        <span>PDF</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
                <div className="rounded-lg p-2.5 border border-amber-100 bg-amber-50">
                    <p className="text-xs text-amber-700/80">Total usuarios</p>
                    <p className="text-lg lg:text-xl font-bold text-amber-800">{usuarios.length}</p>
                </div>
                <div className="rounded-lg p-2.5 border border-amber-100 bg-amber-50">
                    <p className="text-xs text-amber-700/80">Filtrados</p>
                    <p className="text-lg lg:text-xl font-bold text-amber-800">{usuariosFiltrados.length}</p>
                </div>
                <div className="rounded-lg p-2.5 border border-amber-100 bg-amber-50">
                    <p className="text-xs text-amber-700/80">% filtrado</p>
                    <p className="text-lg lg:text-xl font-bold text-amber-800">{porcentajeFiltrado.toFixed(1)}%</p>
                </div>
                <div className="rounded-lg p-2.5 border border-amber-100 bg-amber-50">
                    <p className="text-xs text-amber-700/80">Uso sistema</p>
                    <p className="text-lg lg:text-xl font-bold text-amber-800">{resumen.porcentajeUsoSistema.toFixed(2)}%</p>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-2.5 mb-3">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                    <div className="relative w-full lg:col-span-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Buscar usuario"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <select
                            value={filterRol}
                            onChange={(e) => setFilterRol(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                        >
                            <option value="todos">Rol: Todos</option>
                            {rolesDisponibles.map((rol) => (
                                <option key={rol.id} value={String(rol.id)}>{rol.nombre}</option>
                            ))}
                        </select>
                        <select
                            value={filterInstitucion}
                            onChange={(e) => setFilterInstitucion(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                        >
                            <option value="todos">Institución: Todas</option>
                            {institucionesDisponibles.map((inst) => (
                                <option key={inst.id} value={String(inst.id)}>{inst.nombre}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden min-h-[520px] flex flex-col">
                <div className="px-2 pt-2 border-b border-gray-200">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`w-full px-3 py-1.5 text-xs sm:text-sm rounded-lg border transition-colors ${
                                    activeTab === tab.key
                                        ? 'border-primary bg-primary/5 text-primary font-semibold'
                                        : 'border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex-1 flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto flex-1">{renderBody()}</div>
                        <Pagination
                            currentPage={currentPage}
                            totalItems={totalItemsTab}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                            onItemsPerPageChange={setItemsPerPage}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default UsoSistemaPage;
