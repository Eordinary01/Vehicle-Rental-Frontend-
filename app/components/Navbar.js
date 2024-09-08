"use client";
// Navbar.js

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/authContext";
import {
  Sun,
  Moon,
  Home,
  User,
  LogIn,
  UserPlus,
  LogOut,
  Settings,
  Car,
  LayoutDashboard
} from "lucide-react";

const Navbar = ({ theme, setTheme }) => {
  const router = useRouter();
  const { isLoggedIn, isAdmin, logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <nav
      className={`${
        theme === "light" ? "bg-white text-gray-800" : "bg-gray-900 text-white"
      } p-4 shadow-lg w-full transition-colors duration-300`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="flex items-center space-x-2 text-xl font-bold hover:text-orange-500 transition duration-300"
        >
          <Car size={28} />
          <span>RentWheels</span>
        </Link>

        <div className="flex items-center space-x-6">
          <Link href="/" className="nav-link">
            <Home size={20} />
            <span>Home</span>
          </Link>

          {isLoggedIn ? (
            <>
              <Link href="/Dashboard" className="nav-link">
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </Link>
              {isAdmin && (
                <Link href="/admin" className="nav-link">
                  <Settings size={20} />
                  <span>Admin</span>
                </Link>
              )}
              <Link href="/profile" className="nav-link">
                <User size={20} />
                <span>Profile</span>
              </Link>
              <button onClick={handleLogout} className="nav-link">
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="nav-link">
                <LogIn size={20} />
                <span>Login</span>
              </Link>
              <Link href="/auth/register" className="nav-link">
                <UserPlus size={20} />
                <span>Register</span>
              </Link>
            </>
          )}

          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
