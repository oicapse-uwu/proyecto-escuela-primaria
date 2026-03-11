import React, { useEffect, useMemo } from 'react';
import Modal from '../../../../../components/common/Modal';
import SearchableSelect from '../../../../../components/common/SearchableSelect';
import type { AnioEscolarItem, Curso, Grado, MallaCurricularFormData } from '../types';

interface MallaCurricularFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: MallaCurricularFormData) => Promise<void>;
    initialData?: MallaCurricularFormData;
    cursos: Curso[];
    grados: Grado[];
    anios: AnioEscolarItem[];
    loading?: boolean;
}

const MallaCurricularForm: React.FC<MallaCurricularFormProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    cursos,
    grados,
    anios,
    loading = false
}) => {
    const [formData, setFormData] = React.useState<MallaCurricularFormData>(() =>
        initialData || { idAnioEscolar: 0, idGrado: 0, idCurso: 0, idArea: 0 }
    );

    useEffect(() => {
        if (isOpen) {
            setFormData(initialData || { idAnioEscolar: 0, idGrado: 0, idCurso: 0, idArea: 0 });
        }
    }, [isOpen, initialData]);

    const cursosFiltrados = useMemo(() => cursos.filter(c => {
        const areaId = typeof c.idArea === 'object' ? c.idArea.idArea : c.idArea;
        return areaId === formData.idArea;
    }), [cursos, formData.idArea]);

    // Derivar áreas únicas de los cursos disponibles
    const areas = useMemo(() => {
        const map = new Map<number, { idArea: number; nombreArea: string }>();
        for (const c of cursos) {
            if (typeof c.idArea === 'object' && c.idArea.idArea) {
                map.set(c.idArea.idArea, { idArea: c.idArea.idArea, nombreArea: c.idArea.nombreArea });
            }
        }
        return Array.from(map.values());
    }, [cursos]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formData.idAnioEscolar || !formData.idGrado || !formData.idCurso) {
            alert('Todos los campos son obligatorios');
            return;
        }
        try {
            await onSubmit(formData);
            onClose();
        } catch {
            // Error ya manejado en el hook
        }
    };

    const handleClose = () => {
        setFormData({ idAnioEscolar: 0, idGrado: 0, idCurso: 0, idArea: 0 });
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={initialData?.idMalla ? 'Editar Malla Curricular' : 'Nueva Malla Curricular'}
        >
            <form onSubmit={handleSubmit} className="space-y-3 py-1">
                {/* Año + Grado en fila */}
                <div className="flex gap-3">
                    <div className="flex-1">
                        <SearchableSelect
                            label="Año *"
                            value={formData.idAnioEscolar || ''}
                            onChange={(v) => setFormData({ ...formData, idAnioEscolar: Number(v) })}
                            options={anios}
                            getOptionId={(a) => a.idAnioEscolar}
                            getOptionLabel={(a) => a.nombreAnio}
                            placeholder="Buscar año..."
                            emptyMessage="No hay años disponibles"
                        />
                    </div>
                    <div className="flex-1">
                        <SearchableSelect
                            label="Grado *"
                            value={formData.idGrado || ''}
                            onChange={(v) => setFormData({ ...formData, idGrado: Number(v) })}
                            options={grados}
                            getOptionId={(g) => g.idGrado}
                            getOptionLabel={(g) => g.nombreGrado}
                            placeholder="Buscar grado..."
                            emptyMessage="No se encontraron grados"
                        />
                    </div>
                </div>

                {/* Área */}
                <SearchableSelect
                    label="Área *"
                    value={formData.idArea || ''}
                    onChange={(v) => setFormData({ ...formData, idArea: Number(v), idCurso: 0 })}
                    options={areas}
                    getOptionId={(a) => a.idArea}
                    getOptionLabel={(a) => a.nombreArea}
                    placeholder="Buscar área..."
                    emptyMessage="No se encontraron áreas"
                />

                {/* Curso */}
                <SearchableSelect
                    label="Curso *"
                    value={formData.idCurso || ''}
                    onChange={(v) => setFormData({ ...formData, idCurso: Number(v) })}
                    options={cursosFiltrados}
                    getOptionId={(c) => c.idCurso}
                    getOptionLabel={(c) => c.nombreCurso}
                    placeholder={formData.idArea ? 'Buscar curso...' : 'Primero selecciona un área'}
                    emptyMessage="No hay cursos para esta área"
                    disabled={!formData.idArea}
                    inputClassName="py-3"
                />

                <div className="flex justify-end gap-2 pt-2">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-6 py-2.5 font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="bg-gradient-to-r from-escuela to-escuela-light text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? 'Guardando...' : (initialData?.idMalla ? 'Actualizar' : 'Crear')}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default MallaCurricularForm;