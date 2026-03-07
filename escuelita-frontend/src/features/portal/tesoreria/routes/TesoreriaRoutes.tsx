import { Route, Routes } from 'react-router-dom';
import ConceptosPagoRoutes from '../conceptos-pago/routes/ConceptosPagoRoutes';
import DeudasAlumnosRoutes from '../deudas-alumnos/routes/DeudasAlumnosRoutes';
import MetodosPagoRoutes from '../metodos-pago/routes/MetodosPagoRoutes';
import PagosRoutes from '../pagos/routes/PagosRoutes';

const TesoreriaRoutes = () => {
    return (
        <Routes>
            <Route path="conceptos-pago/*" element={<ConceptosPagoRoutes />} />
            <Route path="deudas-alumnos/*" element={<DeudasAlumnosRoutes />} />
            <Route path="metodos-pago/*" element={<MetodosPagoRoutes />} />
            <Route path="pagos/*" element={<PagosRoutes />} />
        </Routes>
    );
};

export default TesoreriaRoutes;
