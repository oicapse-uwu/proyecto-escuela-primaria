import { Route, Routes } from 'react-router-dom';
import AsignacionDocentePage from '../pages/AsignacionDocentePage';

const AsignacionDocenteRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<AsignacionDocentePage />} />
        </Routes>
    );
};

export default AsignacionDocenteRoutes;