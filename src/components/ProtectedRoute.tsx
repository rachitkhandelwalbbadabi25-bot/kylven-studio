import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { UserProfile, UserRole } from "../types";

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
  requiredRole?: UserRole;
  userProfile?: UserProfile;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  isAuthenticated,
  children,
  requiredRole,
  userProfile,
}) => {
  const location = useLocation();

  if (!isAuthenticated) {
    const target = encodeURIComponent(location.pathname + location.search);
    return (
      <Navigate
        to={`/signin?redirect=${target}`}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  if (requiredRole && userProfile?.role !== requiredRole) {
    if (requiredRole === "seller") {
      return <Navigate to="/upgrade-seller" replace />;
    } else {
      return <Navigate to="/explore" replace />;
    }
  }

  return <>{children}</>;
};
