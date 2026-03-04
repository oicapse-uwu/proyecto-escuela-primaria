import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MatrizRolesPage from '../pages/MatrizRolesPage';

const RolesRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<MatrizRolesPage />} />
        </Routes>
    );
};

export default RolesRoutes;
