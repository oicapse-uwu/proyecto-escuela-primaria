import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ModuloGuard from '../../../../hooks/ModuloGuard';
import { escuelaAuthService } from '../../../../services/escuelaAuth.service';
import AsignacionDocentePage from '../pages/AsignacionDocentePage';

const AsignacionDocenteRoutes: React.FC = () => {
    const usuarioActual = escuelaAuthService.getCurrentUser();
    const idUsuario = usuarioActual?.idUsuario || null;

    return (
        <ModuloGuard requiereModulo={4} idUsuario={idUsuario}>
            <Routes>
                <Route path="/" element={<AsignacionDocentePage />} />
            </Routes>
        </ModuloGuard>
    );
};

export default AsignacionDocenteRoutes;