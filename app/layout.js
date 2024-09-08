'use client'
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import './globals.css';
import { AuthProvider, useAuth } from './context/authContext';

function Layout({ children }) {
  const { theme, changeTheme } = useAuth();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className={`bg-${theme === 'light' ? 'white' : 'gray-900'} text-${theme === 'light' ? 'black' : 'white'}`}>
      <header>
        <Navbar theme={theme} setTheme={changeTheme} />
      </header>
      <main>{children}</main>
    </div>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Vehicle Rental</title>
      </head>
      <body>
        <AuthProvider>
          <Layout>{children}</Layout>
        </AuthProvider>
      </body>
    </html>
  );
}