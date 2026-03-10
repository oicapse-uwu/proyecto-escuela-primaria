import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ModuloGuard from '../../../../hooks/ModuloGuard';
import { escuelaAuthService } from '../../../../services/escuelaAuth.service';
import MallaCurricularPage from '../pages/MallaCurricularPage';

const MallaCurricularRoutes: React.FC = () => {
    const usuarioActual = escuelaAuthService.getCurrentUser();
    const idUsuario = usuarioActual?.idUsuario || null;

    return (
        <ModuloGuard requiereModulo={4} idUsuario={idUsuario}>
            <Routes>
                <Route path="/" element={<MallaCurricularPage />} />
            </Routes>
        </ModuloGuard>
    );
};

export default MallaCurricularRoutes;