import { BarChart3, FileSpreadsheet, FileText, RefreshCcw, Search } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import React, { useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import Pagination from '../../../../components/common/Pagination';
import { useReportes } from '../hooks/useReportes';

type EstadisticaTab = 'instituciones' | 'gestion' | 'estado' | 'roles';

const tabs: { key: EstadisticaTab; label: string }[] = [
    { key: 'instituciones', label: 'Instituciones' },
    { key: 'gestion', label: 'Por Gestión' },
    { key: 'estado', label: 'Por Estado' },
    { key: 'roles', label: 'Usuarios por Rol' }
];

const normalizeText = (value?: string | number | null) =>
    String(value ?? '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

const EstadisticasGeneralesPage: React.FC = () => {
    const { instituciones, resumen, usoPorInstitucion, usuariosPorRol, isLoading, recargar } = useReportes();

    const [activeTab, setActiveTab] = useState<EstadisticaTab>('instituciones');
    const [searchInstitucion, setSearchInstitucion] = useState('');
    const [filterGestion, setFilterGestion] = useState('todos');
    const [filterEstado, setFilterEstado] = useState('todos');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const institucionesDetalladas = useMemo(
        () =>
            usoPorInstitucion.map((item) => {
                const institucion = instituciones.find((inst) => inst.idInstitucion === item.idInstitucion);
                return {
                    ...item,
                    tipoGestion: institucion?.tipoGestion || 'Sin tipo'
                };
            }),
        [usoPorInstitucion, instituciones]
    );

    const institucionesFiltradas = useMemo(() => {
        const search = normalizeText(searchInstitucion.trim());

        return institucionesDetalladas.filter((item) => {
            const matchSearch =
                !search ||
                normalizeText(item.nombre).includes(search) ||
                normalizeText(item.codModular).includes(search) ||
                normalizeText(item.tipoGestion).includes(search) ||
                normalizeText(item.estadoSuscripcion).includes(search);
            const matchGestion = filterGestion === 'todos' || normalizeText(item.tipoGestion) === normalizeText(filterGestion);
            const matchEstado = filterEstado === 'todos' || normalizeText(item.estadoSuscripcion) === normalizeText(filterEstado);

            return matchSearch && matchGestion && matchEstado;
        });
    }, [institucionesDetalladas, searchInstitucion, filterGestion, filterEstado]);

    const tablaGestion = useMemo(() => {
        const map = new Map<string, number>();
        institucionesFiltradas.forEach((item) => {
            map.set(item.tipoGestion, (map.get(item.tipoGestion) || 0) + 1);
        });

        return Array.from(map.entries()).map(([tipoGestion, cantidad]) => ({
            tipoGestion,
            cantidad,
            porcentaje: `${(institucionesFiltradas.length > 0 ? (cantidad / institucionesFiltradas.length) * 100 : 0).toFixed(2)}%`
        }));
    }, [institucionesFiltradas]);

    const tablaEstado = useMemo(() => {
        const map = new Map<string, number>();
        institucionesFiltradas.forEach((item) => {
            const estado = item.estadoSuscripcion || '-';
            map.set(estado, (map.get(estado) || 0) + 1);
        });

        return Array.from(map.entries()).map(([estado, cantidad]) => ({
            estado,
            cantidad,
            porcentaje: `${(institucionesFiltradas.length > 0 ? (cantidad / institucionesFiltradas.length) * 100 : 0).toFixed(2)}%`
        }));
    }, [institucionesFiltradas]);

    const tablaRoles = useMemo(
        () =>
            usuariosPorRol.map((item) => ({
                rol: item.nombre,
                cantidad: item.valor,
                porcentaje: `${(resumen.totalUsuariosSistema > 0 ? (item.valor / resumen.totalUsuariosSistema) * 100 : 0).toFixed(2)}%`
            })),
        [usuariosPorRol, resumen.totalUsuariosSistema]
    );

    const tablaRolesFiltrada = useMemo(() => {
        const search = normalizeText(searchInstitucion.trim());
        if (!search) return tablaRoles;

        return tablaRoles.filter((item) => normalizeText(item.rol).includes(search));
    }, [tablaRoles, searchInstitucion]);

    const activeRows = useMemo(() => {
        if (activeTab === 'instituciones') return institucionesFiltradas;
        if (activeTab === 'gestion') return tablaGestion;
        if (activeTab === 'estado') return tablaEstado;
        return tablaRolesFiltrada;
    }, [activeTab, institucionesFiltradas, tablaGestion, tablaEstado, tablaRolesFiltrada]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const institucionesPaginadas = institucionesFiltradas.slice(indexOfFirstItem, indexOfLastItem);
    const gestionPaginada = tablaGestion.slice(indexOfFirstItem, indexOfLastItem);
    const estadoPaginado = tablaEstado.slice(indexOfFirstItem, indexOfLastItem);
    const rolesPaginados = tablaRolesFiltrada.slice(indexOfFirstItem, indexOfLastItem);

    React.useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, searchInstitucion, filterGestion, filterEstado]);

    const descargarExcel = () => {
        const workbook = XLSX.utils.book_new();

        const institucionesSheet = XLSX.utils.json_to_sheet(
            institucionesFiltradas.map((row) => ({
                Institución: row.nombre,
                'Tipo de Gestión': row.tipoGestion,
                'Estado Institución': row.estadoSuscripcion || '-',
                '% Uso General': `${row.porcentajeUso.toFixed(2)}%`
            }))
        );
        institucionesSheet['!cols'] = [{ wch: 34 }, { wch: 18 }, { wch: 22 }, { wch: 15 }];

        const gestionSheet = XLSX.utils.json_to_sheet(
            tablaGestion.map((row) => ({ 'Tipo de Gestión': row.tipoGestion, Cantidad: row.cantidad, Porcentaje: row.porcentaje }))
        );
        gestionSheet['!cols'] = [{ wch: 24 }, { wch: 12 }, { wch: 14 }];

        const estadoSheet = XLSX.utils.json_to_sheet(
            tablaEstado.map((row) => ({ Estado: row.estado, Cantidad: row.cantidad, Porcentaje: row.porcentaje }))
        );
        estadoSheet['!cols'] = [{ wch: 24 }, { wch: 12 }, { wch: 14 }];

        const rolesSheet = XLSX.utils.json_to_sheet(
            tablaRoles.map((row) => ({ Rol: row.rol, Cantidad: row.cantidad, Porcentaje: row.porcentaje }))
        );
        rolesSheet['!cols'] = [{ wch: 24 }, { wch: 12 }, { wch: 14 }];

        XLSX.utils.book_append_sheet(workbook, institucionesSheet, 'Instituciones');
        XLSX.utils.book_append_sheet(workbook, gestionSheet, 'PorGestion');
        XLSX.utils.book_append_sheet(workbook, estadoSheet, 'PorEstado');
        XLSX.utils.book_append_sheet(workbook, rolesSheet, 'UsuariosPorRol');

        XLSX.writeFile(workbook, 'reporte-estadisticas-generales.xlsx');
    };

    const descargarPdf = () => {
        const doc = new jsPDF({ orientation: 'landscape' });

        doc.setFontSize(14);
        doc.text('Reporte de Estadísticas Generales', 14, 15);
        doc.setFontSize(9);
        doc.text(`Generado: ${new Date().toLocaleString()}`, 14, 22);

        autoTable(doc, {
            head: [['Institución', 'Tipo de Gestión', 'Estado', '% Uso']],
            body: institucionesFiltradas.map((item) => [
                item.nombre,
                item.tipoGestion,
                item.estadoSuscripcion || '-',
                `${item.porcentajeUso.toFixed(2)}%`
            ]),
            startY: 28,
            styles: { fontSize: 8, cellPadding: 2 },
            headStyles: { fillColor: [35, 75, 170] }
        });

        doc.save('reporte-estadisticas-generales.pdf');
    };

    const renderTable = () => {
        if (activeTab === 'instituciones') {
            return (
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institución</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo Gestión</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% Uso</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {institucionesPaginadas.map((item) => (
                            <tr key={item.idInstitucion} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.nombre}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.tipoGestion}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.estadoSuscripcion || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary">{item.porcentajeUso.toFixed(2)}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }

        if (activeTab === 'gestion') {
            return (
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo de Gestión</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Porcentaje</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {gestionPaginada.map((item) => (
                            <tr key={item.tipoGestion} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.tipoGestion}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.cantidad}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary">{item.porcentaje}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }

        if (activeTab === 'estado') {
            return (
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Porcentaje</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {estadoPaginado.map((item) => (
                            <tr key={item.estado} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.estado}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.cantidad}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary">{item.porcentaje}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }

        return (
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Porcentaje</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {rolesPaginados.map((item) => (
                        <tr key={item.rol} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.rol}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.cantidad}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary">{item.porcentaje}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    const renderMobileCards = () => {
        if (activeTab === 'instituciones') {
            return (
                <div className="space-y-3 p-3">
                    {institucionesPaginadas.map((item) => (
                        <div key={item.idInstitucion} className="rounded-lg border border-gray-200 p-3">
                            <h3 className="text-sm font-semibold text-gray-900">{item.nombre}</h3>
                            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                                <div>
                                    <p className="text-gray-500">Gestión</p>
                                    <p className="font-medium text-gray-900">{item.tipoGestion}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Estado</p>
                                    <p className="font-medium text-gray-900">{item.estadoSuscripcion || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">% Uso</p>
                                    <p className="font-semibold text-primary">{item.porcentajeUso.toFixed(2)}%</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        if (activeTab === 'gestion') {
            return (
                <div className="space-y-3 p-3">
                    {gestionPaginada.map((item) => (
                        <div key={item.tipoGestion} className="rounded-lg border border-gray-200 p-3 text-xs">
                            <p className="font-semibold text-gray-900">{item.tipoGestion}</p>
                            <p className="text-gray-600 mt-1">Cantidad: {item.cantidad}</p>
                            <p className="text-primary font-semibold">{item.porcentaje}</p>
                        </div>
                    ))}
                </div>
            );
        }

        if (activeTab === 'estado') {
            return (
                <div className="space-y-3 p-3">
                    {estadoPaginado.map((item) => (
                        <div key={item.estado} className="rounded-lg border border-gray-200 p-3 text-xs">
                            <p className="font-semibold text-gray-900">{item.estado}</p>
                            <p className="text-gray-600 mt-1">Cantidad: {item.cantidad}</p>
                            <p className="text-primary font-semibold">{item.porcentaje}</p>
                        </div>
                    ))}
                </div>
            );
        }

        return (
            <div className="space-y-3 p-3">
                {rolesPaginados.map((item) => (
                    <div key={item.rol} className="rounded-lg border border-gray-200 p-3 text-xs">
                        <p className="font-semibold text-gray-900">{item.rol}</p>
                        <p className="text-gray-600 mt-1">Cantidad: {item.cantidad}</p>
                        <p className="text-primary font-semibold">{item.porcentaje}</p>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="p-3 sm:p-4 lg:px-5 lg:py-4 overflow-x-hidden">
            <div className="mb-4 flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                <div>
                    <h1 className="text-2xl lg:text-[28px] font-bold text-gray-800 flex items-center gap-2">
                        <BarChart3 className="w-7 h-7 text-primary" />
                        <span>Estadísticas Generales</span>
                    </h1>
                    <p className="text-gray-600 mt-1 text-sm">Vista consolidada con filtros compactos y resultados por pestaña</p>
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
                    <button onClick={recargar} className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-xs sm:text-sm">
                        <RefreshCcw className="w-4 h-4" />
                        <span>Recargar</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
                <div className="rounded-lg p-2.5 border border-amber-100 bg-amber-50">
                    <p className="text-xs text-amber-700/80">Instituciones</p>
                    <p className="text-lg lg:text-xl font-bold text-amber-800">{resumen.totalInstituciones}</p>
                </div>
                <div className="rounded-lg p-2.5 border border-amber-100 bg-amber-50">
                    <p className="text-xs text-amber-700/80">Suscripciones</p>
                    <p className="text-lg lg:text-xl font-bold text-amber-800">{resumen.totalSuscripciones}</p>
                </div>
                <div className="rounded-lg p-2.5 border border-amber-100 bg-amber-50">
                    <p className="text-xs text-amber-700/80">Usuarios</p>
                    <p className="text-lg lg:text-xl font-bold text-amber-800">{resumen.totalUsuariosSistema}</p>
                </div>
                <div className="rounded-lg p-2.5 border border-amber-100 bg-amber-50">
                    <p className="text-xs text-amber-700/80">Uso del sistema</p>
                    <p className="text-lg lg:text-xl font-bold text-amber-800">{resumen.porcentajeUsoSistema.toFixed(2)}%</p>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-2.5 mb-3">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                    <div className="relative w-full lg:col-span-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Buscar institución"
                            value={searchInstitucion}
                            onChange={(e) => setSearchInstitucion(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <select
                            value={filterGestion}
                            onChange={(e) => setFilterGestion(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                        >
                            <option value="todos">Gestión: Todas</option>
                            {Array.from(new Set(institucionesDetalladas.map((item) => item.tipoGestion))).map((gestion) => (
                                <option key={gestion} value={gestion}>{gestion}</option>
                            ))}
                        </select>
                        <select
                            value={filterEstado}
                            onChange={(e) => setFilterEstado(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                        >
                            <option value="todos">Estado: Todos</option>
                            {Array.from(new Set(institucionesDetalladas.map((item) => item.estadoSuscripcion || '-'))).map((estado) => (
                                <option key={estado} value={estado}>{estado}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col">
                <div className="px-2 pt-2 border-b border-gray-200">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
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
                        <div className="md:hidden">{renderMobileCards()}</div>
                        <div className="hidden md:block p-3 overflow-x-auto">{renderTable()}</div>
                        <div className="border-t border-gray-200">
                            <Pagination
                                currentPage={currentPage}
                                totalItems={activeRows.length}
                                itemsPerPage={itemsPerPage}
                                onPageChange={setCurrentPage}
                                onItemsPerPageChange={setItemsPerPage}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default EstadisticasGeneralesPage;
