import { Route, Routes } from 'react-router-dom';
import ConceptosPagoPage from '../pages/ConceptosPagoPage';

const ConceptosPagoRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<ConceptosPagoPage />} />
        </Routes>
    );
};

export default ConceptosPagoRoutes;
