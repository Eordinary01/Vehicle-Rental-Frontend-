// app/vehicle/[id]/page.js
import { notFound } from 'next/navigation';
import API from '@/app/utils/api';
import VehicleDetails from '@/app/components/VehicleDetails';

async function getVehicleData(id) {
  if (!id) {
    console.error("Vehicle ID is undefined");
    return null;
  }
  
//   console.log("Fetching vehicle with id:", id);
  try {
    console.log("Making API request to:", `/vehicles/${id}`);
    const response = await API.get(`/vehicles/${id}`);
    // console.log("API response:", response.data);
    return response.data;
  } catch (err) {
    console.error('Error fetching vehicle data:', err.response?.data || err.message);
    return null;
  }
}

export default async function VehicleDetailsPage({ params }) {
  console.log("Params received:", params);
  
  if (!params || !params.id) {
    console.error("Invalid or missing vehicle ID");
    notFound();
  }

  const vehicle = await getVehicleData(params.id);

  if (!vehicle) {
    notFound();
  }

  return <VehicleDetails vehicle={vehicle} />;
}