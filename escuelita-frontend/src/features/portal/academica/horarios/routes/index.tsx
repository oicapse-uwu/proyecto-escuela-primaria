import { Route, Routes } from 'react-router-dom';
import HorariosPage from '../pages/HorariosPage';

const HorariosRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HorariosPage />} />
        </Routes>
    );
};

export default HorariosRoutes;