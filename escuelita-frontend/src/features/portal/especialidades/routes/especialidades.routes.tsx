import { Route, Routes } from 'react-router-dom';
import EspecialidadesPage from '../pages/EspecialidadesPage';

const EspecialidadesRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<EspecialidadesPage />} />
        </Routes>
    );
};

export default EspecialidadesRoutes;