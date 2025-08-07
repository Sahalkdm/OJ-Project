// AuthContext.js (React Context Example)
import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { getCurrentUser, LogoutUser } from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store the logged-in user
  const [loading, setLoading] = useState(true);
  console.log(user)
  // called on page load to check if logged in
  const fetchUser = async () => {
    console.log('calledFetch')
    try {
      const res = await getCurrentUser();
      console.log("res: ", res)
      if (res.success){
        setUser(res?.user);
      }else{
        setUser(null);
      }
    } catch(err) {
      console.log("err: ", err)
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
        console.log(res)
        if (res.success){
            setUser(null);
        }
    } catch (error) {
        console.log(error)
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
