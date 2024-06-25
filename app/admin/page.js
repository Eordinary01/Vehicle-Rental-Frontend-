"use client";
import { useEffect, useState } from "react";
import API from "../utils/api";
import { useAuth } from "../context/authContext";
import VehicleModal from "../components/VehicleModal";
import VehicleCard from "../components/VehicleCard";
import Toast from "../components/Toast";
import { Oval } from "react-loader-spinner";
import AddVehiclePanel from "../components/AddVehiclePanel";

const AdminDashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    image: "",
    pricePerDay: "",
    available: true,
    wheelCount: "",
    description: "",
    features: "",
    fuelType: "",
    transmission: "",
    capacity: "",
    year: "",
  });
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const { isLoggedIn, isAdmin } = useAuth();
  const [isAddPanelVisible, setIsAddPanelVisible] = useState(false);

  const vehicleTypes = [
    'Sedan', 'Hatchback', 'Coupe', 'Convertible', 'SUV', 'Crossover SUV',
    'Minivan', 'Pickup Truck', 'Van', 'Wagon', 'Sports Car', 'Luxury Car',
    'Electric Vehicle', 'Hybrid', 'Motorcycle', 'Scooter', 'Bicycle'
  ];
  const fuelTypeOptions = ['petrol', 'diesel', 'electric', 'hybrid', 'plug-in hybrid'];
  const transmissionOptions = ['manual', 'automatic', 'CVT', 'semi-automatic'];
  const wheelCountOptions = [2, 3, 4, 6, 8];

  const fetchVehicles = async () => {
    try {
      const { data } = await API.get("/vehicles");
      setVehicles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetching(false);
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
      [name]:
        name === "wheelCount" || name === "capacity" || name === "year"
          ? parseInt(value)
          : name === "pricePerDay"
          ? parseFloat(value)
          : name === "features"
          ? value.split(",").map((item) => item.trim())
          : name === "available"
          ? value === "true"
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn || !isAdmin) {
      console.error(
        "You must be an authenticated admin to perform this action."
      );
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
        wheelCount: "",
        description: "",
        features: "",
        fuelType: "",
        transmission: "",
        capacity: "",
        year: "",
      });
      fetchVehicles();
      setIsAddPanelVisible(false);
    } catch (err) {
      console.error("Error adding vehicle:", err);
      setToastType("error");
      setResponseMessage("Error adding vehicle");
    } finally {
      setLoading(false);
      setTimeout(() => setResponseMessage(""), 3000);
    }
  };

  const handleUpdate = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleSave = async (updatedVehicle) => {
    if (!isLoggedIn || !isAdmin) {
      console.error(
        "You must be an authenticated admin to perform this action."
      );
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const vehicleToUpdate = {
        ...updatedVehicle,
        features: Array.isArray(updatedVehicle.features)
          ? updatedVehicle.features
          : updatedVehicle.features.split(",").map((item) => item.trim()),
        available:
          updatedVehicle.available === "true" ||
          updatedVehicle.available === true,
        pricePerDay: Number(updatedVehicle.pricePerDay),
        wheelCount: Number(updatedVehicle.wheelCount),
        capacity: Number(updatedVehicle.capacity),
        year: Number(updatedVehicle.year),
      };

      console.log("Sending update:", vehicleToUpdate);

      const response = await API.put(
        `/vehicles/${updatedVehicle._id}`,
        vehicleToUpdate,
        {
          headers,
        }
      );

      console.log("Server response:", response.data);

      setToastType("success");
      setResponseMessage("Vehicle updated successfully");
      setIsModalOpen(false);
      fetchVehicles();
    } catch (err) {
      console.error("Error updating vehicle:", err);
      if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
        console.error("Response headers:", err.response.headers);
      }
      setToastType("error");
      setResponseMessage("Error updating vehicle");
    } finally {
      setLoading(false);
      setTimeout(() => setResponseMessage(""), 3000);
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
    <div className="min-h-screen text-white p-10 relative">
      <h1 className="text-4xl font-bold text-center mb-8 text-orange-500">
        Admin Dashboard
      </h1>
      <button
        onClick={() => setIsAddPanelVisible(true)}
        className="fixed bottom-8 left-8 bg-orange-500 hover:bg-orange-400 text-white py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 z-10"
      >
        Add New Vehicle
      </button>
      {isFetching ? (
        <div className="flex justify-center items-center h-64">
          <Oval
            height={80}
            width={80}
            color="#FFA500"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel="oval-loading"
            secondaryColor="#FFD580"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        </div>
      ) : (
        <>
          <AddVehiclePanel
            isVisible={isAddPanelVisible}
            onClose={() => setIsAddPanelVisible(false)}
            onSubmit={handleSubmit}
            formData={formData}
            handleChange={handleChange}
            loading={loading}
            vehicleTypes={vehicleTypes}
            fuelTypeOptions={fuelTypeOptions}
            transmissionOptions={transmissionOptions}
            wheelCountOptions={wheelCountOptions}
          />
          {responseMessage && (
            <Toast
              message={responseMessage}
              type={toastType}
              onClose={() => setResponseMessage("")}
            />
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
              vehicleTypes={vehicleTypes}
              fuelTypeOptions={fuelTypeOptions}
              transmissionOptions={transmissionOptions}
              wheelCountOptions={wheelCountOptions}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;