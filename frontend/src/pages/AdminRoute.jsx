// ProtectedRoute.js
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvides";

const AdminRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
    
  if (loading) return <div>Loading...</div>; // prevent redirect before checking

  return user?.isAdmin ? <Outlet /> : <Navigate to="/" state={{ from: location }} replace />;

};

export default AdminRoute;
