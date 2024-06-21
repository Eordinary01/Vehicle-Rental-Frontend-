'use client'
// Navbar.js

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/authContext";
import ToggleThemeButton from "./ToggleThemeButton";

const Navbar = ({ theme, setTheme }) => {
  const router = useRouter();
  const { isLoggedIn, isAdmin, logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/auth/login"); // Redirect to login page after logout
  };

  return (
    <nav className={`${theme === 'light' ? 'text-black bg-transparent ' : 'text-white bg-transparent'} p-4 shadow-lg w-full`}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-lg font-semibold hover:text-orange-400 transition duration-300">
            Home
          </Link>
          {isLoggedIn ? (
            <>
              {isAdmin && (
                <Link href="/admin" className="text-lg font-semibold hover:text-orange-400 transition duration-300">
                  Admin
                </Link>
              )}
              <Link href="/profile" className="text-lg font-semibold hover:text-orange-400 transition duration-300">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-lg font-semibold hover:text-orange-400 transition duration-300 focus:outline-none"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-lg font-semibold hover:text-orange-400 transition duration-300">
                Login
              </Link>
              <Link href="/auth/register" className="text-lg font-semibold hover:text-orange-400 transition duration-300">
                Register
              </Link>
            </>
          )}
        </div>
        <ToggleThemeButton theme={theme} setTheme={setTheme} />
      </div>
    </nav>
  );
};

export default Navbar;
