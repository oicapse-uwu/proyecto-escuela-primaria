import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import PrivateRoute from './components/common/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import SuperAdminWelcome from './pages/SuperAdminWelcome';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Ruta pública - Login */}
          <Route path="/login" element={<Login />} />

          {/* Ruta protegida - Bienvenida Super Admin */}
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <SuperAdminWelcome />
              </PrivateRoute>
            }
          />

          {/* Redirección por defecto */}
          <Route path="/" element={<Navigate to="/admin" replace />} />
          
          {/* Ruta 404 */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;