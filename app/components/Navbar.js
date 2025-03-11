"use client";

import React, { useState } from "react";
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
  LayoutDashboard,
  Menu,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = ({ theme, setTheme }) => {
  const router = useRouter();
  const { isLoggedIn, isAdmin, logout, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navLinks = [
    { href: "/", icon: Home, label: "Home" },
    ...(isLoggedIn ? [
      { href: "/Dashboard", icon: LayoutDashboard, label: "Dashboard" },
      ...(isAdmin ? [{ href: "/admin", icon: Settings, label: "Admin" }] : []),
      { href: "/profile", icon: User, label: "Profile" }
    ] : [
      { href: "/auth/login", icon: LogIn, label: "Login" },
      { href: "/auth/register", icon: UserPlus, label: "Register" }
    ])
  ];

  return (
    <motion.nav 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`${
        theme === "light" ? "bg-white text-gray-800" : "bg-gray-900 text-white"
      } p-4 shadow-lg w-full sticky top-0 z-50 transition-colors duration-300`}
    >
      <div className="container mx-auto flex justify-between items-center relative">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-2 text-xl font-bold 
                     hover:text-orange-800 transition duration-300"
        >
          <Car size={28} />
          <span>RentWheels</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className="nav-link flex items-center space-x-2 
                         hover:text-blue-500 transition duration-300"
            >
              <link.icon size={20} />
              <span>{link.label}</span>
            </Link>
          ))}

          {isLoggedIn && (
            <button 
              onClick={handleLogout} 
              className="nav-link flex items-center space-x-2 
                         hover:text-blue-500 transition duration-300"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          )}

          {/* Theme Toggle */}
          <motion.button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full hover:bg-gray-200 
                       dark:hover:bg-gray-700 transition duration-300"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </motion.button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button 
            onClick={toggleMobileMenu} 
            className="text-current hover:text-orange-500 transition"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 w-full 
                         bg-white dark:bg-gray-900 
                         shadow-lg rounded-b-xl 
                         md:hidden"
            >
              <div className="flex flex-col p-4 space-y-4">
                {navLinks.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href} 
                    onClick={toggleMobileMenu}
                    className="flex items-center space-x-3 
                               hover:text-orange-500 transition"
                  >
                    <link.icon size={20} />
                    <span>{link.label}</span>
                  </Link>
                ))}
                
                {isLoggedIn && (
                  <button 
                    onClick={() => {
                      handleLogout();
                      toggleMobileMenu();
                    }} 
                    className="flex items-center space-x-3 
                               hover:text-red-500 transition"
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                )}

                {/* Mobile Theme Toggle */}
                <button 
                  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                  className="flex items-center space-x-3 
                             hover:text-orange-500 transition"
                >
                  {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                  <span>Toggle Theme</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;