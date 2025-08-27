// AuthContext.js (React Context Example)
import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { getCurrentUser, LogoutUser } from "../api/authApi";
import { handleError } from "../utils/toastFunctions";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store the logged-in user
  const [loading, setLoading] = useState(true);
  // called on page load to check if logged in
  const fetchUser = async () => {
    try {
      const res = await getCurrentUser();
      if (res.success){
        setUser(res?.user);
      }else{
        setUser(null);
      }
    } catch(err) {
      setUser(null);
    }finally {
        setLoading(false); // stop loading after response
      }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = async () => {
    try {
        const res = await LogoutUser();
        if (res.success){
            setUser(null);
        }
    } catch (error) {
      handleError(error?.message)
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
