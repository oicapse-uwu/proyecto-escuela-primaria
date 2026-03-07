import { Route, Routes } from 'react-router-dom';
import PagosPage from '../pages/PagosPage';

const PagosRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<PagosPage />} />
        </Routes>
    );
};

export default PagosRoutes;
