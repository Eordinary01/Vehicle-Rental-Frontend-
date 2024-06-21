"use client"
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import API from "../utils/api";
import Toast from "../components/Toast";

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

  return (
    <div className="bg-gray-900 min-h-screen p-10 flex justify-center items-center text-orange-200">
      {toastMessage && <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage("")} />}
      {profileUser && (
        <div className="bg-orange-500 p-8 rounded-md shadow-lg text-gray-900">
          <h1 className="text-4xl font-bold text-center mb-8">User Profile</h1>
          <table className="table-auto mx-auto">
            <tbody>
              <tr>
                <td className="border px-4 py-2">Name:</td>
                <td className="border px-4 py-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={updatedName}
                      onChange={(e) => setUpdatedName(e.target.value)}
                    />
                  ) : (
                    profileUser.name
                  )}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Email:</td>
                <td className="border px-4 py-2">
                  {isEditing ? (
                    <input
                      type="email"
                      value={updatedEmail}
                      onChange={(e) => setUpdatedEmail(e.target.value)}
                    />
                  ) : (
                    profileUser.email
                  )}
                </td>
              </tr>
            </tbody>
          </table>
          {isEditing ? (
            <button className="mt-4 bg-orange-500 text-white py-2 px-4 rounded-md" onClick={handleUpdateProfile}>
              {isLoading ? "Updating..." : "Save"}
            </button>
          ) : (
            <button className="mt-4 bg-orange-500 text-white py-2 px-4 rounded-md" onClick={() => setIsEditing(true)}>
              Edit
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfile;


