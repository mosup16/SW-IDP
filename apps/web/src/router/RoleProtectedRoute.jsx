import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function RoleProtectedRoute({ authority }) {
  const { currentUser, loading, hasAuthority } = useAuth();
  if (loading) return null;
  if (!currentUser) return <Navigate to="/" replace />;
  if (authority && !hasAuthority(authority)) {
    return <Navigate to="/forbidden" replace />;
  }
  return <Outlet />;
}
