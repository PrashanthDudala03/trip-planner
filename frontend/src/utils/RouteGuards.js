import { Navigate } from 'react-router-dom';

export const getUserData = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isAuthenticated = !!localStorage.getItem('access_token');
  return {
    user,
    isAuthenticated,
    isUser: user && user.role === 'user',
    isAdmin: user && user.role === 'admin',
    isSuperAdmin: user && user.role === 'superadmin',
    isAnyAdmin: user && (user.role === 'admin' || user.role === 'superadmin')
  };
};

export const GuestRoute = ({ children }) => {
  const { isAuthenticated, isAnyAdmin } = getUserData();
  
  if (!isAuthenticated) return children;
  
  return <Navigate to={isAnyAdmin ? '/admin' : '/dashboard'} replace />;
};

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = getUserData();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAnyAdmin } = getUserData();
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAnyAdmin) return <Navigate to="/dashboard" replace />;
  
  return children;
};

export const SuperAdminRoute = ({ children }) => {
  const { isAuthenticated, isSuperAdmin } = getUserData();
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isSuperAdmin) return <Navigate to="/admin" replace />;
  
  return children;
};

export const UserOnlyRoute = ({ children }) => {
  const { isAuthenticated, isUser } = getUserData();
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isUser) return <Navigate to="/admin" replace />;
  
  return children;
};

export const UserOrSuperAdminRoute = ({ children }) => {
  const { isAuthenticated, isUser, isSuperAdmin } = getUserData();
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isUser && !isSuperAdmin) return <Navigate to="/admin" replace />;
  
  return children;
};