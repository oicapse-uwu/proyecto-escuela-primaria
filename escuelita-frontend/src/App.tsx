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

import AlumnosRoutes from './features/portal/alumnos/routes/AlumnosRoutes';
import ApoderadosRoutes from './features/portal/apoderados/routes/apoderados.routes';
import AreasRoutes from './features/portal/areas/routes/areas.routes';
import EspecialidadesRoutes from './features/portal/especialidades/routes/especialidades.routes';
import InfraestructuraRoutes from './features/portal/infraestructura/routes/InfraestructuraRoutes';
import MatriculasRoutes from './features/portal/matriculas/routes/matriculas.routes';
import UsuariosPortalRoutes from './features/portal/usuarios/routes/UsuariosPortalRoutes';
import TesoreriaRoutes from './features/portal/tesoreria/routes/TesoreriaRoutes';
import MallaCurricularRoutes from './features/portal/malla-curricular/routes';
import AsignacionDocenteRoutes from './features/portal/asignacion-docente/routes';
import HorariosRoutes from './features/portal/horarios/routes';
import DocentesRoutes from './features/portal/docentes/routes';

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
          <Route path="configuracion/usuarios/*" element={<UsuariosPortalRoutes />} />
          <Route path="apoderados/*" element={<ApoderadosRoutes />} />
          <Route path="matriculas/*" element={<MatriculasRoutes />} />
          <Route path="academica/areas-cursos/*" element={<AreasRoutes />} />
          <Route path="academica/especialidades/*" element={<EspecialidadesRoutes />} />
          <Route path="academica/malla-curricular/*" element={<MallaCurricularRoutes />} />
          <Route path="academica/asignacion-docente/*" element={<AsignacionDocenteRoutes />} />
          <Route path="academica/horarios/*" element={<HorariosRoutes />} />
          <Route path="academica/docentes/*" element={<DocentesRoutes />} />
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