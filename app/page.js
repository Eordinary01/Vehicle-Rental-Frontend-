"use client";
import { useEffect, useState } from "react";
import API from "./utils/api";
import VehicleCard from "./components/VehicleCard";
import { Oval } from 'react-loader-spinner'; // Import the loader

export default function Home() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const { data } = await API.get("/vehicles");
        setVehicles(data);
        setLoading(false); // Set loading to false after fetching
        console.log(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchVehicles();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center p-10  text-white">
      <h1 className="text-4xl font-bold mb-8 text-orange-500">Available Vehicles</h1>
      {loading ? ( // Show loader if loading is true
        <div className="flex justify-center items-center h-64">
          <Oval
            height={80}
            width={80}
            color="#FFA500"
            visible={true}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle._id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </main>
  );
}
