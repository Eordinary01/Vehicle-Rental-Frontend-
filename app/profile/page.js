"use client"
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import API from "../utils/api";
import Toast from "../components/Toast";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaPencilAlt, FaSave, FaTimes } from "react-icons/fa";

const UserProfile = () => {
  const { isLoggedIn, user } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");

  useEffect(() => {
    if (isLoggedIn && user && user.id) {
      fetchUserProfile(user.id);
    }
  }, [isLoggedIn, user]);

  const fetchUserProfile = async (userId) => {
    try {
      const { data } = await API.get(`/users/${userId}`);
      setProfileUser(data);
      setUpdatedName(data.name);
      setUpdatedEmail(data.email);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setToastMessage("Failed to fetch profile");
      setToastType("error");
    }
  };

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      await API.put(`/users/${user.id}`, { name: updatedName, email: updatedEmail });
      fetchUserProfile(user.id);
      setIsEditing(false);
      setToastMessage("Profile updated successfully");
      setToastType("success");
    } catch (error) {
      console.error("Error updating user profile:", error);
      setToastMessage("Failed to update profile");
      setToastType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const inputVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen p-10 flex justify-center items-center text-white">
      {toastMessage && <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage("")} />}
      {profileUser && (
        <motion.div
          className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-8 rounded-xl shadow-2xl text-white w-full max-w-md"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-4xl font-bold text-center mb-8 text-orange-400">User Profile</h1>
          <div className="space-y-6">
            <div className="relative">
              <FaUser className="absolute top-3 left-3 text-orange-400" />
              {isEditing ? (
                <motion.input
                  type="text"
                  value={updatedName}
                  onChange={(e) => setUpdatedName(e.target.value)}
                  className="w-full bg-gray-800 bg-opacity-50 py-2 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  variants={inputVariants}
                  initial="hidden"
                  animate="visible"
                />
              ) : (
                <div className="w-full bg-gray-800 bg-opacity-50 py-2 pl-10 pr-4 rounded-lg">
                  {profileUser.name}
                </div>
              )}
            </div>
            <div className="relative">
              <FaEnvelope className="absolute top-3 left-3 text-orange-400" />
              {isEditing ? (
                <motion.input
                  type="email"
                  value={updatedEmail}
                  onChange={(e) => setUpdatedEmail(e.target.value)}
                  className="w-full bg-gray-800 bg-opacity-50 py-2 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  variants={inputVariants}
                  initial="hidden"
                  animate="visible"
                />
              ) : (
                <div className="w-full bg-gray-800 bg-opacity-50 py-2 pl-10 pr-4 rounded-lg">
                  {profileUser.email}
                </div>
              )}
            </div>
          </div>
          <div className="mt-8 flex justify-center">
            {isEditing ? (
              <div className="space-x-4">
                <motion.button
                  className="bg-green-500 text-white py-2 px-4 rounded-lg flex items-center"
                  onClick={handleUpdateProfile}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaSave className="mr-2" />
                  {isLoading ? "Updating..." : "Save"}
                </motion.button>
                <motion.button
                  className="bg-red-500 text-white py-2 px-4 rounded-lg flex items-center"
                  onClick={() => setIsEditing(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaTimes className="mr-2" />
                  Cancel
                </motion.button>
              </div>
            ) : (
              <motion.button
                className="bg-orange-500 text-white py-2 px-4 rounded-lg flex items-center"
                onClick={() => setIsEditing(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPencilAlt className="mr-2" />
                Edit Profile
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default UserProfile;