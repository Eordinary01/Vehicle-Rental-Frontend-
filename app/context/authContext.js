// AuthContext.js
'use client'
import { createContext, useContext, useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) {
      const decodedToken = jwt.decode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        logout();
        window.location.href = '/auth/login';
      } else {
        setUser({ id: decodedToken.id, role: decodedToken.role });
        setIsLoggedIn(true);
        setIsAdmin(role === "admin");
      }
    }
  }, []);

  const login = (token, role) => {
    try {
      const decodedToken = jwt.decode(token);
      setUser({ id: decodedToken.id, role: decodedToken.role });
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      setIsLoggedIn(true);
      setIsAdmin(role === "admin");
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUser(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAdmin, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
