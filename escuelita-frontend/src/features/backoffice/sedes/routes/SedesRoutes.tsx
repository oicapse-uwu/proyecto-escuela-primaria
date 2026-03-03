import { Route, Routes } from 'react-router-dom';
import SedesPage from '../pages/SedesPage';

const SedesRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<SedesPage />} />
        </Routes>
    );
};

export default SedesRoutes;
