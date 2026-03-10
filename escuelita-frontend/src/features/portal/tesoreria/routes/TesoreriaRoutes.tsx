import { Navigate, Route, Routes } from 'react-router-dom';
import ModuloGuard from '../../../../hooks/ModuloGuard';
import { escuelaAuthService } from '../../../../services/escuelaAuth.service';
import ConceptosPagoRoutes from '../conceptos-pago/routes/ConceptosPagoRoutes';
import DeudasAlumnosRoutes from '../deudas-alumnos/routes/DeudasAlumnosRoutes';
import MetodosPagoRoutes from '../metodos-pago/routes/MetodosPagoRoutes';
import PagosRoutes from '../pagos/routes/PagosRoutes';

const TesoreriaRoutes = () => {
    const currentUser = escuelaAuthService.getCurrentUser();

    return (
        <ModuloGuard
            requiereModulo={8}  // Módulo 8 = PAGOS Y PENSIONES
            idUsuario={currentUser?.idUsuario ?? null}
            fallback={<Navigate to="/escuela/dashboard" replace />}
        >
            <Routes>
                <Route path="conceptos-pago/*" element={<ConceptosPagoRoutes />} />
                <Route path="deudas-alumnos/*" element={<DeudasAlumnosRoutes />} />
                <Route path="metodos-pago/*" element={<MetodosPagoRoutes />} />
                <Route path="pagos/*" element={<PagosRoutes />} />
            </Routes>
        </ModuloGuard>
    );
};

export default TesoreriaRoutes;
