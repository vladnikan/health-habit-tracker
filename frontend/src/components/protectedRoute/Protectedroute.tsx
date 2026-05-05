// src/components/ProtectedRoute/Protectedroute.tsx
import { useAppSelector } from '../../hooks/hooks';
import { Preloader } from '../../ui/preloader';
import { Navigate, useLocation } from 'react-router-dom';
import type { ReactElement } from 'react';

export type ProtectedRouteProps = {
  element: ReactElement;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  element,
  onlyUnAuth = false,
}: ProtectedRouteProps) => {
  const location = useLocation();
  const { userData, isAuthChecked, token } = useAppSelector((store) => store.auth);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  // Страницы только для НЕавторизованных
  if (onlyUnAuth) {
    return userData || token ? <Navigate to="/" replace /> : element;
  }

  // Защищённые страницы
  if (!userData && !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return element;
};