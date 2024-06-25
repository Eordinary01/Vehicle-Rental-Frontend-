import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaCar, FaMoneyBillWave, FaWheelchair } from 'react-icons/fa';

const VehicleCard = ({ vehicle }) => {
  const router = useRouter();

  if (!vehicle) {
    return <div>Loading vehicle data...</div>;
  }

  const handleCardClick = () => {
    router.push(`/vehicle/${vehicle._id}`);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative h-48">
        <Image
          src={vehicle.image}
          alt={vehicle.name}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 group-hover:scale-110"
        />
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