import { Route, Routes } from 'react-router-dom';
import MetodosPagoPage from '../pages/MetodosPagoPage';

const MetodosPagoRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<MetodosPagoPage />} />
        </Routes>
    );
};

export default MetodosPagoRoutes;
