import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import PrivateRoute from './components/common/PrivateRoute';
import ModuloRoute from './components/common/ModuloRoute';
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
            <Route path="roles/*" element={<RolesRoutes />} />
            <Route path="sedes/*" element={<SedesRoutes />} />
            <Route path="suscripciones/*" element={<SuscripcionesRoutes />} />
            <Route path="usuarios/*" element={<UsuariosRoutes />} />
            <Route path="reportes/*" element={<ReportesRoutes />} />
            {/* etc... */}
          </Route>

          {/* Módulos del Backoffice */}
          <Route path="instituciones/*" element={<InstitucionesRoutes />} />
          <Route path="sedes/*" element={<SedesRoutes />} />
          <Route path="suscripciones/*" element={<SuscripcionesRoutes />} />
          <Route path="usuarios/*" element={<UsuariosRoutes />} />
          <Route path="reportes/*" element={<ReportesRoutes />} />
          {/* etc... */}

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
          <Route 
            path="dashboard" 
            element={
              <ModuloRoute requiredModule={1}>
                <DashboardEscuela />
              </ModuloRoute>
            } 
          />

          {/* Módulos del Portal Escuela - Protegidos por módulo */}
          <Route 
            path="alumnos/*" 
            element={
              <ModuloRoute requiredModule={5}>
                <AlumnosRoutes />
              </ModuloRoute>
            } 
          />
          <Route 
            path="infraestructura/*" 
            element={
              <ModuloRoute requiredModule={3}>
                <InfraestructuraRoutes />
              </ModuloRoute>
            } 
          />
          <Route 
            path="configuracion/usuarios/*" 
            element={
              <ModuloRoute requiredModule={2}>
                <UsuariosPortalRoutes />
              </ModuloRoute>
            } 
          />
          <Route 
            path="apoderados/*" 
            element={
              <ModuloRoute requiredModule={5}>
                <ApoderadosRoutes />
              </ModuloRoute>
            } 
          />
          <Route 
            path="matriculas/*" 
            element={
              <ModuloRoute requiredModule={6}>
                <MatriculasRoutes />
              </ModuloRoute>
            } 
          />
          <Route 
            path="academica/areas-cursos/*" 
            element={
              <ModuloRoute requiredModule={4}>
                <AreasRoutes />
              </ModuloRoute>
            } 
          />
          <Route 
            path="academica/especialidades/*" 
            element={
              <ModuloRoute requiredModule={4}>
                <EspecialidadesRoutes />
              </ModuloRoute>
            } 
          />
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