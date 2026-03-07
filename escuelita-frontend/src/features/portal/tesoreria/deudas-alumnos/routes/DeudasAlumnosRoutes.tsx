import { Route, Routes } from 'react-router-dom';
import DeudasAlumnosPage from '../pages/DeudasAlumnosPage';

const DeudasAlumnosRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<DeudasAlumnosPage />} />
        </Routes>
    );
};

export default DeudasAlumnosRoutes;
