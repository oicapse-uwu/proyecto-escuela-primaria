import { Route, Routes } from 'react-router-dom';
import MallaCurricularPage from '../pages/MallaCurricularPage';

const MallaCurricularRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<MallaCurricularPage />} />
        </Routes>
    );
};

export default MallaCurricularRoutes;