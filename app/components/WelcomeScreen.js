"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FaUserCircle } from 'react-icons/fa';
import API from "../utils/api"; // Ensure this utility is correctly implemented to handle your API calls

export default function WelcomeScreen() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await API.get("/users"); // Adjust the endpoint based on your API
        setUser(data);
      } catch (err) {
        console.error(err);
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const handleProceed = () => {
    router.push('/'); // Adjust this based on your home route
  };

  const handleRegister = () => {
    router.push('/auth/register'); // Adjust this based on your register route
  };

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/path/to/your/background/image.jpg)' }}>
      <div className="flex items-center justify-center h-full bg-black bg-opacity-50">
        <div className="text-center text-white p-10 rounded-lg bg-opacity-80 bg-black">
          <h1 className="text-5xl font-bold mb-6">Welcome to Our Service</h1>
          <p className="text-xl mb-8">Experience the best we have to offer</p>
          {user ? (
            <>
              <div className="flex flex-col items-center">
                <FaUserCircle size={80} className="mb-4" />
                <h2 className="text-2xl mb-6">Hello, {user.name}!</h2>
                <button
                  onClick={handleProceed}
                  className="py-2 px-6 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300"
                >
                  Proceed to Home
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center">
                <button
                  onClick={handleRegister}
                  className="py-2 px-6 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition duration-300 mb-4"
                >
                  Register Now
                </button>
                <button
                  onClick={handleProceed}
                  className="py-2 px-6 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition duration-300"
                >
                  Already have an account? Login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

