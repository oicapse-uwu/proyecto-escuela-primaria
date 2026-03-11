import { Route, Routes } from 'react-router-dom';
import DocentesPage from '../pages/DocentesPage';

const DocentesRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<DocentesPage />} />
        </Routes>
    );
};

export default DocentesRoutes;