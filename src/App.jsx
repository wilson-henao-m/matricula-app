import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './pages/Dashboard';
import Matricula from './pages/Matricula';
import Horario from './pages/Horario';
import Profile from './pages/Profile';

import { useAuth } from './hooks/useAuth';
import PrivateRoute from './components/Layout/PrivateRoute';
import DashboardLayout from './components/Layout/DashboardLayout';

function App() {
  const { user, loadingAuth } = useAuth();

  if (loadingAuth) {
    return <div>Cargando...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route
          path="/login"
          element={
            user
              ? <Navigate to="/dashboard" replace />
              : <Login />
          }
        />
        <Route
          path="/register"
          element={
            user
              ? <Navigate to="/dashboard" replace />
              : <Register />
          }
        />

        {/* Rutas protegidas: agrupadas bajo /dashboard con layout */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="matricula" element={<Matricula />} />
          <Route path="horario" element={<Horario />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Catch-all: cualquier ruta desconocida muestra 404 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
