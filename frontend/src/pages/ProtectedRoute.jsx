// ProtectedRoute.js
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvides";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchUser } from "../store/authSlice";
import LoadingPage from "./LoadingPage";

const ProtectedRoute = () => {
  // const { user, loading } = useAuth();
  const location = useLocation();

  const { user, loading } = useSelector((state) => state.auth);
    
  if (loading) return <LoadingPage/>; // prevent redirect before checking

  return user ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;

};

export default ProtectedRoute;
