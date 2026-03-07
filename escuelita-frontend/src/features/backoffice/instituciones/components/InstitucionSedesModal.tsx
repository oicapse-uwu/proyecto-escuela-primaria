import { Building2, CreditCard, Edit, MapPin, Phone, Plus, Trash2, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { obtenerSedesPorInstitucion } from '../../sedes/api/sedesApi';
import SedeForm from '../../sedes/components/SedeForm';
import { useSedes } from '../../sedes/hooks/useSedes';
import type { Sede, SedeFormData } from '../../sedes/types';
import { getSuscripcionPorInstitucionApi } from '../../suscripciones/api/suscripcionesApi';
import type { Suscripcion } from '../../suscripciones/types';
import type { Institucion } from '../types';

interface InstitucionSedesModalProps {
    institucion: Institucion;
    onClose: () => void;
}

const InstitucionSedesModal: React.FC<InstitucionSedesModalProps> = ({
    institucion,
    onClose
}) => {
    const [sedes, setSedes] = useState<Sede[]>([]);
    const [suscripcion, setSuscripcion] = useState<Suscripcion | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showSedeForm, setShowSedeForm] = useState(false);
    const [sedeEditar, setSedeEditar] = useState<Sede | null>(null);
    const { crear, actualizar, eliminar } = useSedes();

    // Cargar sedes y suscripción de la institución
    useEffect(() => {
        cargarDatos();
    }, [institucion.idInstitucion]);

    const cargarDatos = async () => {
        setIsLoading(true);
        try {
            const [sedesData, suscripcionData] = await Promise.all([
                obtenerSedesPorInstitucion(institucion.idInstitucion),
                getSuscripcionPorInstitucionApi(institucion.idInstitucion)
            ]);
            setSedes(sedesData.sort((a, b) => {
                if (a.esSedePrincipal && !b.esSedePrincipal) return -1;
                if (!a.esSedePrincipal && b.esSedePrincipal) return 1;
                return a.nombreSede.localeCompare(b.nombreSede);
            }));
            setSuscripcion(suscripcionData);
        } catch (error) {
            console.error('Error al cargar datos:', error);
            toast.error('Error al cargar la información');
        } finally {
            setIsLoading(false);
        }
    };

    const handleNuevaSede = () => {
        // Validar límite de sedes
        if (suscripcion) {
            const limite = suscripcion.limiteSedesContratadas;
            const sedesActuales = sedes.length;
            
            if (sedesActuales >= limite) {
                toast.error(
                    `Límite alcanzado`,
                    {
                        description: `Su suscripción actual permite solo ${limite} ${limite === 1 ? 'sede' : 'sedes'}. Ya tiene ${sedesActuales} registrada${sedesActuales === 1 ? '' : 's'}.`
                    }
                );
                return;
            }
        }
        
        setSedeEditar(null);
        setShowSedeForm(true);
    };

    const handleEditarSede = (sede: Sede) => {
        setSedeEditar(sede);
        setShowSedeForm(true);
    };

    const handleEliminarSede = async (id: number) => {
        if (window.confirm('¿Está seguro de eliminar esta sede?')) {
            try {
                await eliminar(id);
                await cargarDatos(); // Recargar datos
                toast.success('Sede eliminada correctamente');
            } catch (error) {
                console.error('Error al eliminar sede:', error);
                toast.error('Error al eliminar la sede');
            }
        }
    };

    const handleSubmitSede = async (data: SedeFormData) => {
        try {
            if (sedeEditar) {
                await actualizar({
                    ...data,
                    idSede: sedeEditar.idSede,
                    idInstitucion: institucion.idInstitucion
                });
                toast.success('Sede actualizada correctamente');
            } else {
                await crear({
                    ...data,
                    idInstitucion: institucion.idInstitucion
                });
                toast.success('Sede creada correctamente');
            }
            setShowSedeForm(false);
            setSedeEditar(null);
            await cargarDatos(); // Recargar datos
        } catch (error) {
            console.error('Error al guardar sede:', error);
            toast.error('Error al guardar la sede');
        }
    };

    const handleCancelSede = () => {
        setShowSedeForm(false);
        setSedeEditar(null);
    };

    // Si se muestra el formulario de sede
    if (showSedeForm) {
        return (
            <SedeForm
                sede={sedeEditar}
                onSubmit={handleSubmitSede}
                onCancel={handleCancelSede}
                idInstitucionFijo={institucion.idInstitucion}
            />
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#1e3a8a] to-[#1e1b4b] text-white p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <Building2 className="w-7 h-7" />
                            {institucion.nombre}
                        </h2>
                        <p className="text-blue-100 mt-1">
                            Código Modular: {institucion.codModular}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <>
                            {/* Información de Suscripción */}
                            {suscripcion ? (
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-5 mb-6">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-blue-600 text-white p-3 rounded-lg">
                                            <CreditCard className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-gray-800 mb-2">
                                                Plan Contratado: {suscripcion.idPlan?.nombrePlan || 'N/A'}
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                <div>
                                                    <p className="text-gray-600">Límite de Sedes</p>
                                                    <p className="text-xl font-bold text-blue-700">
                                                        {suscripcion.limiteSedesContratadas}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">Sedes Registradas</p>
                                                    <p className="text-xl font-bold text-green-600">
                                                        {sedes.length}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">Disponibles</p>
                                                    <p className="text-xl font-bold text-orange-600">
                                                        {suscripcion.limiteSedesContratadas - sedes.length}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-5 mb-6">
                                    <p className="text-yellow-800 font-medium">
                                        ⚠️ Esta institución no tiene una suscripción activa. 
                                        Por favor, asigne una suscripción antes de agregar sedes.
                                    </p>
                                </div>
                            )}

                            {/* Header de Sedes con Botón */}
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-800">
                                    Sedes ({sedes.length})
                                </h3>
                                <button
                                    onClick={handleNuevaSede}
                                    disabled={!suscripcion}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                        suscripcion
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    <Plus className="w-5 h-5" />
                                    Nueva Sede
                                </button>
                            </div>

                            {/* Lista de Sedes */}
                            {sedes.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    <Building2 className="w-16 h-16 mx-auto mb-4 opacity-30" />
                                    <p className="text-lg">No hay sedes registradas</p>
                                    {suscripcion && (
                                        <p className="text-sm mt-2">
                                            Haga clic en "Nueva Sede" para agregar una
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {sedes.map((sede) => (
                                        <div
                                            key={sede.idSede}
                                            className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h4 className="text-lg font-bold text-gray-800">
                                                            {sede.nombreSede}
                                                        </h4>
                                                        {sede.esSedePrincipal && (
                                                            <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-1 rounded">
                                                                ⭐ Principal
                                                            </span>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="w-4 h-4 text-gray-400" />
                                                            <span>
                                                                {sede.direccion}, {sede.distrito}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Phone className="w-4 h-4 text-gray-400" />
                                                            <span>{sede.telefono}</span>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">Código SUNAT:</span> {sede.codigoEstablecimiento}
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">UGEL:</span> {sede.ugel}
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex gap-2 ml-4">
                                                    <button
                                                        onClick={() => handleEditarSede(sede)}
                                                        className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                                                        title="Editar sede"
                                                    >
                                                        <Edit className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEliminarSede(sede.idSede)}
                                                        className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                                        title="Eliminar sede"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t p-4 flex justify-end bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InstitucionSedesModal;
