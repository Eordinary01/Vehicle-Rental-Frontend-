'use client'
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import './globals.css';
import { AuthProvider } from './context/authContext'; // Import AuthProvider

export default function RootLayout({ children }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Retrieve theme from localStorage or default to 'light'
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme); // Save theme to localStorage
  }, [theme]);

  return (
    <html lang="en">
      <head>
        <title>Vehicle Rental</title>
      </head>
      <body className={`bg-${theme === 'light' ? 'white' : 'gray-900'} text-${theme === 'light' ? 'black' : 'white'}`}>
        <AuthProvider> {/* Wrap with AuthProvider */}
          <header>
            <Navbar theme={theme} setTheme={setTheme} />
          </header>
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
