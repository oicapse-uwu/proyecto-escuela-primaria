import { Route, Routes } from 'react-router-dom';
import InstitucionDetallePage from '../pages/InstitucionDetallePage';
import InstitucionesPage from '../pages/InstitucionesPage';

const InstitucionesRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<InstitucionesPage />} />
            <Route path="/:id" element={<InstitucionDetallePage />} />
        </Routes>
    );
};

export default InstitucionesRoutes;
