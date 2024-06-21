"use client";
import { useEffect, useState } from "react";
import API from "../utils/api";
import { useAuth } from "../context/authContext";
import VehicleModal from "../components/VehicleModal";
import VehicleCard from "../components/VehicleCard";
import Toast from "../components/Toast";
import { Oval } from 'react-loader-spinner'; // Import the loader

const AdminDashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    image: "",
    pricePerDay: "",
    available: true,
  });
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true); // New state to handle fetching status
  const { isLoggedIn, isAdmin } = useAuth();

  const fetchVehicles = async () => {
    try {
      const { data } = await API.get("/vehicles");
      setVehicles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetching(false); // Set fetching status to false after fetching is done
    }
  };

  useEffect(() => {
    if (isLoggedIn && isAdmin) {
      fetchVehicles();
    } else {
      console.error("You must be an authenticated admin to access this page.");
    }
  }, [isLoggedIn, isAdmin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value.toUpperCase(), // Convert value to uppercase
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn || !isAdmin) {
      console.error("You must be an authenticated admin to perform this action.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      await API.post("/vehicles", formData, { headers });
      setToastType("success");
      setResponseMessage("Vehicle added successfully");
      setFormData({
        name: "",
        type: "",
        image: "",
        pricePerDay: "",
        available: true,
      });
      fetchVehicles(); // Refresh the vehicle list
    } catch (err) {
      console.error("Error adding vehicle:", err);
      setToastType("error");
      setResponseMessage("Error adding vehicle");
    } finally {
      setLoading(false);
      setTimeout(() => setResponseMessage(""), 3000); // Clear the message after 3 seconds
    }
  };

  const handleUpdate = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleSave = async (updatedVehicle) => {
    if (!isLoggedIn || !isAdmin) {
      console.error("You must be an authenticated admin to perform this action.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      await API.put(`/vehicles/${updatedVehicle._id}`, updatedVehicle, { headers });
      setToastType("success");
      setResponseMessage("Vehicle updated successfully");
      setIsModalOpen(false);
      fetchVehicles(); // Refresh the vehicle list
    } catch (err) {
      console.error("Error updating vehicle:", err);
      setToastType("error");
      setResponseMessage("Error updating vehicle");
    } finally {
      setLoading(false);
      setTimeout(() => setResponseMessage(""), 3000); // Clear the message after 3 seconds
    }
  };

  if (!isLoggedIn || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-10">
        <h1 className="text-4xl font-bold text-center mb-8 text-orange-500">
          You must be an authenticated admin to access this page.
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white p-10">
      <h1 className="text-4xl font-bold text-center mb-8 text-orange-500">
        Admin Dashboard
      </h1>
      {isFetching ? (
        <div className="flex justify-center items-center h-64">
          <Oval
            height={80}
            width={80}
            color="#FFA500"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel='oval-loading'
            secondaryColor="#FFD580"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="bg-gray-800 p-12 rounded-lg shadow-lg max-w-lg mx-auto mb-8">
            <h2 className="text-2xl font-semibold mb-4">Add a Vehicle</h2>
            <input
              type="text"
              name="name"
              placeholder="Name"
              onChange={handleChange}
              value={formData.name}
              required
              className="w-full p-3 mb-6 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="text"
              name="type"
              placeholder="Type"
              onChange={handleChange}
              value={formData.type}
              required
              className="w-full p-3 mb-6 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="text"
              name="image"
              placeholder="Image URL"
              onChange={handleChange}
              value={formData.image}
              required
              className="w-full p-3 mb-6 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="number"
              name="pricePerDay"
              placeholder="Price per day"
              onChange={handleChange}
              value={formData.pricePerDay}
              required
              className="w-full p-3 mb-6 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <select
              name="available"
              onChange={handleChange}
              value={formData.available}
              className="w-full p-3 mb-6 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="true">Available</option>
              <option value="false">Not Available</option>
            </select>
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-400 text-white py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              {loading ? "Adding..." : "Add Vehicle"}
            </button>
          </form>
          {responseMessage && (
            <Toast message={responseMessage} type={toastType} onClose={() => setResponseMessage("")} /> // Display the Toast notification
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {vehicles.map((vehicle) => (
              <div key={vehicle._id} className="relative">
                <VehicleCard vehicle={vehicle} />
                <button
                  onClick={() => handleUpdate(vehicle)}
                  className="absolute top-0 right-0 mt-2 mr-2 bg-orange-600 hover:bg-orange-400 text-white py-1 px-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
          {selectedVehicle && (
            <VehicleModal
              vehicle={selectedVehicle}
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSave={handleSave}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;