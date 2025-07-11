import React from 'react';
import { Navigate } from 'react-router-dom';
import { useKeycloak } from '../../hooks/useKeycloak';
import { ROUTES } from '../../utils/constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useKeycloak();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
