import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import PrivateRoute from './components/common/PrivateRoute';

import {
  Dashboard,
  InstitucionesRoutes,
  ReportesRoutes,
  SedesRoutes,
  SuscripcionesRoutes,
  UsuariosRoutes
} from './features/backoffice';

import AlumnosRoutes from './features/portal/alumnos/routes/AlumnosRoutes';
import ApoderadosRoutes from './features/portal/apoderados/routes/apoderados.routes';
import InfraestructuraRoutes from './features/portal/infraestructura/routes/InfraestructuraRoutes';
import MatriculasRoutes from './features/portal/matriculas/routes/matriculas.routes';
import UsuariosPortalRoutes from './features/portal/usuarios/routes/UsuariosPortalRoutes';
import TesoreriaRoutes from './features/portal/tesoreria/routes/TesoreriaRoutes';

import EscuelaLayout from './layouts/EscuelaLayout';
import SuperAdminLayout from './layouts/SuperAdminLayout';

import DashboardEscuela from './pages/DashboardEscuela';
import Login from './pages/Login';
import LoginEscuela from './pages/LoginEscuela';

function App() {
  return (
    <Router>
      <Routes>

        {/* ==================== RUTAS PÚBLICAS ==================== */}
        <Route path="/login" element={<Login />} />
        <Route path="/escuela/login" element={<LoginEscuela />} />

        {/* ==================== SUPER ADMIN ==================== */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <SuperAdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />

          {/* Backoffice */}
          <Route path="instituciones/*" element={<InstitucionesRoutes />} />
          <Route path="sedes/*" element={<SedesRoutes />} />
          <Route path="suscripciones/*" element={<SuscripcionesRoutes />} />
          <Route path="usuarios/*" element={<UsuariosRoutes />} />
          <Route path="reportes/*" element={<ReportesRoutes />} />
        </Route>

        {/* ==================== PORTAL ESCUELA ==================== */}
        <Route
          path="/escuela"
          element={
            <PrivateRoute>
              <EscuelaLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/escuela/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardEscuela />} />

          {/* Módulos del Portal */}
          <Route path="alumnos/*" element={<AlumnosRoutes />} />
          <Route path="infraestructura/*" element={<InfraestructuraRoutes />} />
          <Route path="configuracion/usuarios/*" element={<UsuariosPortalRoutes />} />
          <Route path="apoderados/*" element={<ApoderadosRoutes />} />
          <Route path="matriculas/*" element={<MatriculasRoutes />} />
          <Route path="tesoreria/*" element={<TesoreriaRoutes />} />
        </Route>

        {/* ==================== REDIRECCIONES ==================== */}
        <Route path="/" element={<Navigate to="/escuela/login" replace />} />
        <Route path="*" element={<Navigate to="/escuela/login" replace />} />

      </Routes>
    </Router>
  );
}

export default App;