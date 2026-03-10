import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import PrivateRoute from './components/common/PrivateRoute';

import {
  Dashboard,
  InstitucionesRoutes,
  ReportesRoutes,
  RolesRoutes,
  SedesRoutes,
  SuscripcionesRoutes,
  UsuariosRoutes
} from './features/backoffice';

import GestionAcademicaRoutes from './features/portal/academica/routes/GestionAcademicaRoutes';
import AlumnosRoutes from './features/portal/alumnos/routes/AlumnosRoutes';
import ApoderadosRoutes from './features/portal/apoderados/routes/apoderados.routes';
import ConfiguracionRoutes from './features/portal/configuracion/routes/ConfiguracionRoutes';
import EvaluacionesRoutes from './features/portal/evaluaciones/routes/EvaluacionesRoutes';
import InfraestructuraRoutes from './features/portal/infraestructura/routes/InfraestructuraRoutes';
import MatriculasRoutes from './features/portal/matriculas/routes/matriculas.routes';
import TesoreriaRoutes from './features/portal/tesoreria/routes/TesoreriaRoutes';

import EscuelaLayout from './layouts/EscuelaLayout';
import SuperAdminLayout from './layouts/SuperAdminLayout';

import DashboardEscuela from './pages/DashboardEscuela';
import Login from './pages/Login';
import LoginEscuela from './pages/LoginEscuela';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Rutas públicas - Login */}
        <Route path="/login" element={<Login />} /> {/* Super Admin Login */}
        <Route path="/escuela/login" element={<LoginEscuela />} /> {/* Escuela Login */}

        {/* Rutas protegidas - Super Admin */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <SuperAdminLayout />
            </PrivateRoute>
          }
        >
          {/* Dashboard por defecto */}
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Módulos del Backoffice */}
          <Route path="instituciones/*" element={<InstitucionesRoutes />} />
          <Route path="roles/*" element={<RolesRoutes />} />
          <Route path="sedes/*" element={<SedesRoutes />} />
          <Route path="suscripciones/*" element={<SuscripcionesRoutes />} />
          <Route path="usuarios/*" element={<UsuariosRoutes />} />
          <Route path="reportes/*" element={<ReportesRoutes />} />
        </Route>

        {/* Rutas protegidas - Escuela */}
        <Route
          path="/escuela"
          element={
            <PrivateRoute>
              <EscuelaLayout />
            </PrivateRoute>
          }
        >
          {/* Dashboard por defecto */}
          <Route index element={<Navigate to="/escuela/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardEscuela />} />

          {/* Módulos del Portal Escuela - Protegidos con ModuloGuard en frontend + @RequireModulo en backend */}
          <Route path="alumnos/*" element={<AlumnosRoutes />} />
          <Route path="infraestructura/*" element={<InfraestructuraRoutes />} />
          <Route path="configuracion/*" element={<ConfiguracionRoutes />} />
          <Route path="apoderados/*" element={<ApoderadosRoutes />} />
          <Route path="matriculas/*" element={<MatriculasRoutes />} />
          <Route path="academica/*" element={<GestionAcademicaRoutes />} />
          <Route path="evaluaciones/*" element={<EvaluacionesRoutes />} />
          <Route path="tesoreria/*" element={<TesoreriaRoutes />} />
        </Route>

        {/* Redirección por defecto */}
        <Route path="/" element={<Navigate to="/escuela/login" replace />} />
        
        {/* Ruta 404 */}
        <Route path="*" element={<Navigate to="/escuela/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;