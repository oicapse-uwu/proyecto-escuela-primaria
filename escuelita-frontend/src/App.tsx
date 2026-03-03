import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import PrivateRoute from './components/common/PrivateRoute';
import { Dashboard } from './features/backoffice';
import InstitucionesRoutes from './features/backoffice/instituciones/routes/InstitucionesRoutes';
import ReportesRoutes from './features/backoffice/reportes/routes/ReportesRoutes';
import SuscripcionesRoutes from './features/backoffice/suscripciones/routes/SuscripcionesRoutes';
import UsuariosRoutes from './features/backoffice/usuarios/routes/UsuariosRoutes';
import AlumnosRoutes from './features/portal/alumnos/routes/AlumnosRoutes';
import UsuariosPortalRoutes from './features/portal/usuarios/routes/UsuariosPortalRoutes';
import EscuelaLayout from './layouts/EscuelaLayout';
import SuperAdminLayout from './layouts/SuperAdminLayout';
import DashboardEscuela from './pages/DashboardEscuela';
import Login from './pages/Login';
import LoginEscuela from './pages/LoginEscuela';

function App() {
  return (
    <Router>
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
            <Route path="suscripciones/*" element={<SuscripcionesRoutes />} />
            <Route path="usuarios/*" element={<UsuariosRoutes />} />
            <Route path="reportes/*" element={<ReportesRoutes />} />
            {/* etc... */}
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
            
            {/* Rutas futuras para módulos de escuela */}
            <Route path="alumnos/*" element={<AlumnosRoutes />} />
            <Route path="configuracion/usuarios/*" element={<UsuariosPortalRoutes />} />
            {/* <Route path="matriculas/*" element={<MatriculasRoutes />} /> */}
            {/* <Route path="evaluaciones/*" element={<EvaluacionesRoutes />} /> */}
            {/* <Route path="pagos/*" element={<PagosRoutes />} /> */}
            {/* etc... */}
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