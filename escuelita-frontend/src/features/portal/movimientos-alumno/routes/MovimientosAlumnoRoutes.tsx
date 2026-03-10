import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MovimientosAlumnoPage from '../pages/MovimientosAlumnoPage';

const MovimientosAlumnoRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<MovimientosAlumnoPage />} />
        </Routes>
    );
};

export default MovimientosAlumnoRoutes;
