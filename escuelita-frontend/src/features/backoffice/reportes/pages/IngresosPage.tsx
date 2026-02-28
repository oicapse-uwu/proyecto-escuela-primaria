import { DollarSign, FileSpreadsheet, FileText, Search } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import React, { useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import Pagination from '../../../../components/common/Pagination';
import { useReportes } from '../hooks/useReportes';

type IngresoTab = 'detalle' | 'plan' | 'metodo';

const tabs: { key: IngresoTab; label: string }[] = [
    { key: 'detalle', label: 'Detalle' },
    { key: 'plan', label: 'Por Plan' },
    { key: 'metodo', label: 'Por Método de Pago' }
];

const currency = (value: number) =>
    new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN',
        minimumFractionDigits: 2
    }).format(value || 0);

const normalizeText = (value?: string | number | null) =>
    String(value ?? '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

const IngresosPage: React.FC = () => {
    const { suscripciones, ingresosPorMetodoPago, resumen, isLoading } = useReportes();

    const [activeTab, setActiveTab] = useState<IngresoTab>('detalle');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEstado, setFilterEstado] = useState('todos');
    const [filterMetodoPago, setFilterMetodoPago] = useState('todos');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const ticketPromedio = resumen.totalSuscripciones > 0 ? resumen.ingresosTotales / resumen.totalSuscripciones : 0;

    const suscripcionesFiltradas = useMemo(() => {
        const search = normalizeText(searchTerm.trim());

        return suscripciones.filter((item) => {
            const matchEstado =
                filterEstado === 'todos' || normalizeText(item.idEstado?.nombre) === normalizeText(filterEstado);

            const candidato = [
                item.idInstitucion?.nombre,
                item.idInstitucion?.codModular,
                item.idPlan?.nombrePlan,
                item.idEstado?.nombre,
                item.idCiclo?.nombre
            ]
                .map((value) => normalizeText(value))
                .join(' ');

            const matchSearch = !search || candidato.includes(search);

            return matchEstado && matchSearch;
        });
    }, [suscripciones, searchTerm, filterEstado]);

    const metodosPagoFiltrados = useMemo(() => {
        const search = normalizeText(searchTerm.trim());

        return ingresosPorMetodoPago.filter((item) => {
            const matchMetodo =
                filterMetodoPago === 'todos'
                    ? true
                    : normalizeText(item.nombreMetodo) === normalizeText(filterMetodoPago);
            const matchSearch = !search || normalizeText(item.nombreMetodo).includes(search);

            return matchMetodo && matchSearch;
        });
    }, [ingresosPorMetodoPago, filterMetodoPago, searchTerm]);

    const ingresosPorPlanFiltrado = useMemo(() => {
        const map = new Map<string, { nombrePlan: string; cantidadSuscripciones: number; ingresoTotal: number }>();

        suscripcionesFiltradas.forEach((item) => {
            const nombrePlan = item.idPlan?.nombrePlan || '-';
            const monto = Number(item.precioAcordado) || 0;

            const actual = map.get(nombrePlan);
            if (actual) {
                actual.cantidadSuscripciones += 1;
                actual.ingresoTotal += monto;
            } else {
                map.set(nombrePlan, {
                    nombrePlan,
                    cantidadSuscripciones: 1,
                    ingresoTotal: monto
                });
            }
        });

        return Array.from(map.values()).sort((a, b) => b.ingresoTotal - a.ingresoTotal);
    }, [suscripcionesFiltradas]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const suscripcionesPaginadas = suscripcionesFiltradas.slice(indexOfFirstItem, indexOfLastItem);
    const planesPaginados = ingresosPorPlanFiltrado.slice(indexOfFirstItem, indexOfLastItem);
    const metodosPagoPaginados = metodosPagoFiltrados.slice(indexOfFirstItem, indexOfLastItem);

    const totalItemsTab = activeTab === 'detalle'
        ? suscripcionesFiltradas.length
        : activeTab === 'plan'
            ? ingresosPorPlanFiltrado.length
            : metodosPagoFiltrados.length;

    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterEstado, filterMetodoPago, activeTab]);

    const totalFiltradoIngresos = useMemo(
        () => suscripcionesFiltradas.reduce((acc, item) => acc + (Number(item.precioAcordado) || 0), 0),
        [suscripcionesFiltradas]
    );

    const detalleIngresosExport = useMemo(
        () => [
            ...suscripcionesFiltradas.map((item) => ({
                institucion: item.idInstitucion?.nombre || '-',
                plan: item.idPlan?.nombrePlan || '-',
                ciclo: item.idCiclo?.nombre || '-',
                estado: item.idEstado?.nombre || '-',
                monto: Number(item.precioAcordado) || 0
            })),
            {
                institucion: 'TOTAL FILTRADO',
                plan: '-',
                ciclo: '-',
                estado: '-',
                monto: totalFiltradoIngresos
            }
        ],
        [suscripcionesFiltradas, totalFiltradoIngresos]
    );

    const metodoPagoExport = useMemo(
        () => [
            ...metodosPagoFiltrados.map((item) => ({
                metodoPago: item.nombreMetodo,
                monto: item.ingresoTotal
            })),
            {
                metodoPago: 'TOTAL MÉTODOS DE PAGO',
                monto: metodosPagoFiltrados.reduce((acc, item) => acc + item.ingresoTotal, 0)
            }
        ],
        [metodosPagoFiltrados]
    );

    const estadosDisponibles = useMemo(() => {
        const setEstados = new Set<string>();
        suscripciones.forEach((item) => {
            if (item.idEstado?.nombre) setEstados.add(item.idEstado.nombre);
        });
        return Array.from(setEstados.values());
    }, [suscripciones]);

    const metodosDisponibles = useMemo(
        () => ingresosPorMetodoPago.map((item) => item.nombreMetodo),
        [ingresosPorMetodoPago]
    );

    const descargarExcel = () => {
        const workbook = XLSX.utils.book_new();

        if (activeTab === 'plan') {
            const planWorksheet = XLSX.utils.json_to_sheet(
                ingresosPorPlanFiltrado.map((row) => ({
                    Plan: row.nombrePlan,
                    Suscripciones: row.cantidadSuscripciones,
                    Ingreso: row.ingresoTotal
                }))
            );
            planWorksheet['!cols'] = [{ wch: 30 }, { wch: 16 }, { wch: 18 }];
            XLSX.utils.book_append_sheet(workbook, planWorksheet, 'IngresosPorPlan');
            XLSX.writeFile(workbook, 'reporte-ingresos-plan.xlsx');
            return;
        }

        if (activeTab === 'metodo') {
            const metodosWorksheet = XLSX.utils.json_to_sheet(
                metodoPagoExport.map((row) => ({
                    'Método de pago': row.metodoPago,
                    Monto: row.monto
                }))
            );
            metodosWorksheet['!cols'] = [{ wch: 30 }, { wch: 16 }];
            XLSX.utils.book_append_sheet(workbook, metodosWorksheet, 'MetodosPago');
            XLSX.writeFile(workbook, 'reporte-ingresos-metodos.xlsx');
            return;
        }

        const detalleWorksheet = XLSX.utils.json_to_sheet(
            detalleIngresosExport.map((row) => ({
                Institución: row.institucion,
                Plan: row.plan,
                Ciclo: row.ciclo,
                Estado: row.estado,
                Monto: row.monto
            }))
        );
        detalleWorksheet['!cols'] = [{ wch: 34 }, { wch: 22 }, { wch: 18 }, { wch: 16 }, { wch: 14 }];
        XLSX.utils.book_append_sheet(workbook, detalleWorksheet, 'DetalleIngresos');

        XLSX.writeFile(workbook, 'reporte-ingresos.xlsx');
    };

    const descargarPdf = () => {
        const doc = new jsPDF({ orientation: 'landscape' });

        doc.setFontSize(14);
        doc.text('Reporte de Ingresos', 14, 15);
        doc.setFontSize(9);
        doc.text(`Generado: ${new Date().toLocaleString()}`, 14, 22);

        if (activeTab === 'plan') {
            autoTable(doc, {
                head: [['Plan', 'Suscripciones', 'Ingreso']],
                body: ingresosPorPlanFiltrado.map((row) => [
                    row.nombrePlan,
                    String(row.cantidadSuscripciones),
                    Number(row.ingresoTotal).toFixed(2)
                ]),
                startY: 28,
                styles: { fontSize: 8, cellPadding: 2 },
                headStyles: { fillColor: [35, 75, 170] }
            });

            doc.save('reporte-ingresos-plan.pdf');
            return;
        }

        if (activeTab === 'metodo') {
            autoTable(doc, {
                head: [['Método de pago', 'Monto']],
                body: metodoPagoExport.map((row) => [row.metodoPago, Number(row.monto).toFixed(2)]),
                startY: 28,
                styles: { fontSize: 8, cellPadding: 2 },
                headStyles: { fillColor: [35, 75, 170] }
            });

            doc.save('reporte-ingresos-metodos.pdf');
            return;
        }

        autoTable(doc, {
            head: [['Institución', 'Plan', 'Ciclo', 'Estado', 'Monto']],
            body: detalleIngresosExport.map((row) => [
                row.institucion,
                row.plan,
                row.ciclo,
                row.estado,
                Number(row.monto).toFixed(2)
            ]),
            startY: 28,
            styles: { fontSize: 8, cellPadding: 2 },
            headStyles: { fillColor: [35, 75, 170] }
        });

        doc.save('reporte-ingresos.pdf');
    };

    const renderBody = () => {
        if (activeTab === 'plan') {
            return (
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Suscripciones</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ingreso</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {planesPaginados.map((item) => (
                            <tr key={item.nombrePlan} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.nombrePlan}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.cantidadSuscripciones}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary">{currency(item.ingresoTotal)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }

        if (activeTab === 'metodo') {
            return (
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Método de pago</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {metodosPagoPaginados.map((item) => (
                            <tr key={item.nombreMetodo} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.nombreMetodo}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary">{currency(item.ingresoTotal)}</td>
                            </tr>
                        ))}
                        <tr className="bg-gray-50">
                            <td className="px-6 py-4 text-sm font-semibold text-gray-700">Total métodos de pago</td>
                            <td className="px-6 py-4 text-sm font-bold text-primary">
                                {currency(metodosPagoFiltrados.reduce((acc, item) => acc + item.ingresoTotal, 0))}
                            </td>
                        </tr>
                    </tbody>
                </table>
            );
        }

        return (
            <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institución</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ciclo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {suscripcionesPaginadas.map((item) => (
                            <tr key={item.idSuscripcion} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.idInstitucion?.nombre || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.idPlan?.nombrePlan || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.idCiclo?.nombre || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.idEstado?.nombre || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary">{currency(Number(item.precioAcordado) || 0)}</td>
                            </tr>
                        ))}
                        <tr className="bg-gray-50">
                            <td colSpan={4} className="px-6 py-4 text-sm font-semibold text-gray-700 text-right">Total filtrado</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary">{currency(totalFiltradoIngresos)}</td>
                        </tr>
                    </tbody>
                </table>
        );
    };

    const renderMobileBody = () => {
        if (activeTab === 'plan') {
            return (
                <div className="space-y-3 p-3">
                    {planesPaginados.map((item) => (
                        <div key={item.nombrePlan} className="rounded-lg border border-gray-200 p-3">
                            <h3 className="text-sm font-semibold text-gray-900">{item.nombrePlan}</h3>
                            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                                <div>
                                    <p className="text-gray-500">Suscripciones</p>
                                    <p className="font-medium text-gray-900">{item.cantidadSuscripciones}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Ingreso</p>
                                    <p className="font-semibold text-primary">{currency(item.ingresoTotal)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        if (activeTab === 'metodo') {
            return (
                <div className="space-y-3 p-3">
                    {metodosPagoPaginados.map((item) => (
                        <div key={item.nombreMetodo} className="rounded-lg border border-gray-200 p-3">
                            <h3 className="text-sm font-semibold text-gray-900">{item.nombreMetodo}</h3>
                            <p className="text-xs text-gray-500 mt-1">Ingreso total</p>
                            <p className="text-sm font-semibold text-primary">{currency(item.ingresoTotal)}</p>
                        </div>
                    ))}
                </div>
            );
        }

        return (
            <div className="space-y-3 p-3">
                {suscripcionesPaginadas.map((item) => (
                    <div key={item.idSuscripcion} className="rounded-lg border border-gray-200 p-3">
                        <h3 className="text-sm font-semibold text-gray-900">{item.idInstitucion?.nombre || '-'}</h3>
                        <p className="text-xs text-gray-500">{item.idPlan?.nombrePlan || '-'}</p>
                        <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                            <div>
                                <p className="text-gray-500">Ciclo</p>
                                <p className="font-medium text-gray-900">{item.idCiclo?.nombre || '-'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Estado</p>
                                <p className="font-medium text-gray-900">{item.idEstado?.nombre || '-'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Monto</p>
                                <p className="font-semibold text-primary">{currency(Number(item.precioAcordado) || 0)}</p>
                            </div>
                        </div>
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
                        <DollarSign className="w-7 h-7 text-primary" />
                        <span>Reporte de Ingresos</span>
                    </h1>
                    <p className="text-gray-600 mt-1 text-sm">Vista compacta con pestañas y filtros rápidos</p>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
                <div className="rounded-lg p-2.5 border border-amber-100 bg-amber-50">
                    <p className="text-xs text-amber-700/80">Ingresos totales</p>
                    <p className="text-lg lg:text-xl font-bold text-amber-800">{currency(resumen.ingresosTotales)}</p>
                </div>
                <div className="rounded-lg p-2.5 border border-amber-100 bg-amber-50">
                    <p className="text-xs text-amber-700/80">Ingreso mensual</p>
                    <p className="text-lg lg:text-xl font-bold text-amber-800">{currency(resumen.ingresoMensualEstimado)}</p>
                </div>
                <div className="rounded-lg p-2.5 border border-amber-100 bg-amber-50">
                    <p className="text-xs text-amber-700/80">Suscripciones</p>
                    <p className="text-lg lg:text-xl font-bold text-amber-800">{resumen.totalSuscripciones}</p>
                </div>
                <div className="rounded-lg p-2.5 border border-amber-100 bg-amber-50">
                    <p className="text-xs text-amber-700/80">Ticket promedio</p>
                    <p className="text-lg lg:text-xl font-bold text-amber-800">{currency(ticketPromedio)}</p>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-2.5 mb-3">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                    <div className="relative w-full lg:col-span-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Buscar institución o plan"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <select
                            value={filterEstado}
                            onChange={(e) => setFilterEstado(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                        >
                            <option value="todos">Estado: Todos</option>
                            {estadosDisponibles.map((estado) => (
                                <option key={estado} value={estado}>{estado}</option>
                            ))}
                        </select>
                        <select
                            value={filterMetodoPago}
                            onChange={(e) => setFilterMetodoPago(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                        >
                            <option value="todos">Método: Todos</option>
                            {metodosDisponibles.map((metodo) => (
                                <option key={metodo} value={metodo}>{metodo}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col">
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
                        <div className="md:hidden">{renderMobileBody()}</div>
                        <div className="hidden md:block overflow-x-auto">{renderBody()}</div>
                        <div className="border-t border-gray-200">
                            <Pagination
                                currentPage={currentPage}
                                totalItems={totalItemsTab}
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

export default IngresosPage;
