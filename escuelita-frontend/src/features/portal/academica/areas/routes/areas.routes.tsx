import { Route, Routes } from 'react-router-dom';
import AreasYCursosPage from '../pages/AreasYCursosPage';

const AreasRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<AreasYCursosPage />} />
        </Routes>
    );
};

export default AreasRoutes;