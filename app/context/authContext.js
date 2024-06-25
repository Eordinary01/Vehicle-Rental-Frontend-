// authContext.js
'use client'

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken';
import API from '@/app/utils/api';
import { Oval } from 'react-loader-spinner';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [theme, setTheme] = useState('light'); // Theme state
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const storedTheme = localStorage.getItem('theme'); // Retrieve theme from local storage
    if (storedTheme) {
      setTheme(storedTheme); // Set theme from local storage
    }
    if (token) {
      try {
        const decodedToken = jwt.decode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken && decodedToken.exp > currentTime) {
          setUser({ id: decodedToken.id, role: decodedToken.role });
          setIsLoggedIn(true);
          setIsAdmin(role === 'admin');
          setIsEmailVerified(decodedToken.emailVerified);
        } else {
          logout();
          router.push('/auth/login');
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        logout();
        router.push('/auth/login');
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme); // Set theme on body
    localStorage.setItem('theme', theme); // Save theme to local storage
  }, [theme]); // Update theme when it changes

  const login = (token, role) => {
    try {
      const decodedToken = jwt.decode(token);
      if (decodedToken) {
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp > currentTime) {
          setUser({ id: decodedToken.id, role: decodedToken.role });
          localStorage.setItem('token', token);
          localStorage.setItem('role', role);
          setIsLoggedIn(true);
          setIsAdmin(role === 'admin');
          setIsEmailVerified(decodedToken.emailVerified);
        } else {
          throw new Error('Token expired');
        }
      } else {
        throw new Error('Invalid token');
      }
    } catch (error) {
      console.error('Error during login:', error);
      logout();
      router.push('/auth/login');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUser(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
    setIsEmailVerified(false);
  };

  const verifyEmail = async (userId, verificationCode) => {
    try {
      const response = await API.post('/auth/verify-email', {
        userId,
        verificationCode,
      });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);
        setIsEmailVerified(true);
        login(response.data.token, response.data.role);
        setToastMessage('Email verified successfully');
        setShowToast(true);
      }
    } catch (error) {
      console.error('Verification failed', error);
      setToastMessage('Verification failed');
      setShowToast(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Oval
          height={80}
          width={80}
          color="#3498db"
          visible={true}
          ariaLabel="oval-loading"
          secondaryColor="#f3f3f3"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
      </div>
    ); // Or any loading component
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isAdmin,
        user,
        login,
        logout,
        isEmailVerified,
        verifyEmail,
        toastMessage,
        showToast,
        setShowToast,
        theme, // Provide theme to consumers
        setTheme, // Provide setTheme to consumers
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
