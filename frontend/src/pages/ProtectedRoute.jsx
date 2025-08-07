// ProtectedRoute.js
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvides";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
    
  if (loading) return <div>Loading...</div>; // prevent redirect before checking

  return user ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;

};

export default ProtectedRoute;
