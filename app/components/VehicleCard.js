// components/VehicleCard.js
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaCar, FaMoneyBillWave, FaWheelchair, FaInfoCircle } from 'react-icons/fa';

const VehicleCard = ({ vehicle }) => {
  if (!vehicle) {
    return <div>Loading vehicle data...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 hover:scale-105">
      <div className="relative h-48 group">
        <Image
          src={vehicle.image}
          alt={vehicle.name}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center">
          <Link href={`/vehicle/${vehicle._id}`} passHref>
            <span className="bg-white text-gray-800 py-2 px-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 cursor-pointer">
              <FaInfoCircle className="inline-block mr-2" />
              View Details
            </span>
          </Link> 
        </div>
      </div>
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2">{vehicle.name}</h2>
        <div className="flex items-center text-gray-600 mb-2">
          <FaCar className="mr-2 text-blue-500" />
          <span>{vehicle.type}</span>
        </div>
        <div className="flex items-center text-gray-600 mb-2">
          <FaMoneyBillWave className="mr-2 text-green-500" />
          <span>₹{vehicle.pricePerDay}/day</span>
        </div>
        <div className="flex items-center text-gray-600 mb-2">
          <FaWheelchair className="mr-2 text-purple-500" />
          <span>{vehicle.wheelCount} Wheels</span>
        </div>
        <div className={`text-sm font-semibold ${
          vehicle.available ? 'text-green-600' : 'text-red-600'
        }`}>
          {vehicle.available ? 'Available' : 'Not Available'}
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;