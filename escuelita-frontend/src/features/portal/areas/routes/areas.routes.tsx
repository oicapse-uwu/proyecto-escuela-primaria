import { Route, Routes } from 'react-router-dom';
import AreasPage from '../pages/AreasPage';

const AreasRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<AreasPage />} />
        </Routes>
    );
};

export default AreasRoutes;