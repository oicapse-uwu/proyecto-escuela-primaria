import { Route, Routes } from 'react-router-dom';
import InstitucionesPage from '../pages/InstitucionesPage';

const InstitucionesRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<InstitucionesPage />} />
        </Routes>
    );
};

export default InstitucionesRoutes;
