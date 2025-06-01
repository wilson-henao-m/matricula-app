import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function PrivateRoute({ children }) {
  const { user, loadingAuth } = useAuth();
  if (loadingAuth) {
    return <div>Cargando...</div>;
  }
  console.log('PrivateRoute: Usuario actual:', user);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
