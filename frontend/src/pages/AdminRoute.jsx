// ProtectedRoute.js
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingPage from "./LoadingPage";

const AdminRoute = () => {
  const location = useLocation();
  const { user, loading } = useSelector(state => state.auth);

  if (loading) return <LoadingPage/>

  //return user?.isAdmin ? <Outlet /> : <Navigate to="/" state={{ from: location }} replace />;

  return user?.isAdmin ? <Outlet /> : <Navigate to="/" state={{ from: location }} replace />;

};

export default AdminRoute;
