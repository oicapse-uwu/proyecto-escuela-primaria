import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import PrivateRoute from './components/common/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import { Dashboard } from './features/superadmin';
import SuperAdminLayout from './layouts/SuperAdminLayout';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Ruta pública - Login */}
          <Route path="/login" element={<Login />} />

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
            
            {/* Rutas futuras para otros módulos */}
            {/* <Route path="instituciones/*" element={<InstitucionesRoutes />} /> */}
            {/* <Route path="suscripciones/*" element={<SuscripcionesRoutes />} /> */}
            {/* etc... */}
          </Route>

          {/* Redirección por defecto */}
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          
          {/* Ruta 404 */}
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;