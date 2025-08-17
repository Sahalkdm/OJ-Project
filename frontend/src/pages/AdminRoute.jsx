// ProtectedRoute.js
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvides";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchUser } from "../store/authSlice";

const AdminRoute = () => {
  const { user, loading } = useSelector(state => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();

  // Fetch user data if not loaded
    useEffect(() => {
      if (!user) {
        console.log("requested Fetching data");
        dispatch(fetchUser());
      }
    }, [dispatch, user,]);
    
  if (loading) return <div>Loading...</div>; // prevent redirect before checking

  return user?.isAdmin ? <Outlet /> : <Navigate to="/" state={{ from: location }} replace />;

};

export default AdminRoute;
