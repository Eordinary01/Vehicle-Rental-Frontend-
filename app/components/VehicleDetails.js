// components/VehicleDetails.js
import React from 'react';
import Image from 'next/image';
import { FaCar, FaGasPump, FaCogs, FaUsers, FaCalendarAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const VehicleDetails = ({ vehicle }) => {
  if (!vehicle) {
    return <div className="h-screen flex items-center justify-center">Loading vehicle details...</div>;
  }

  return (
    <div className="h-screen flex flex-col lg:flex-row">
      <div className="lg:w-3/5 relative h-1/2 lg:h-full">
        <Image
          src={vehicle.image}
          alt={vehicle.name}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
          <h1 className="text-4xl font-bold text-white mb-2">{vehicle.name}</h1>
          <p className="text-xl text-gray-200">{vehicle.type}</p>
        </div>
      </div>
      <div className="lg:w-2/5 bg-white p-8 overflow-y-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Vehicle Overview</h2>
          <p className="text-gray-600 leading-relaxed">{vehicle.description}</p>
        </div>
        <div className="grid grid-cols-2 gap-6 mb-8">
          <DetailItem icon={<FaGasPump />} title="Fuel Type" value={vehicle.fuelType} />
          <DetailItem icon={<FaCogs />} title="Transmission" value={vehicle.transmission} />
          <DetailItem icon={<FaUsers />} title="Capacity" value={`${vehicle.capacity} persons`} />
          <DetailItem icon={<FaCalendarAlt />} title="Year" value={vehicle.year} />
        </div>
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-3xl font-bold text-blue-600">₹{vehicle.pricePerDay}</p>
            <p className="text-gray-500">per day</p>
          </div>
          <div className="flex items-center">
            {vehicle.available ? (
              <FaCheckCircle className="text-3xl text-green-500 mr-2" />
            ) : (
              <FaTimesCircle className="text-3xl text-red-500 mr-2" />
            )}
            <p className={`font-semibold ${vehicle.available ? 'text-green-600' : 'text-red-600'}`}>
              {vehicle.available ? 'Available' : 'Not Available'}
            </p>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Features</h2>
          <ul className="grid grid-cols-2 gap-y-3 gap-x-4">
            {vehicle.features.map((feature, index) => (
              <li key={index} className="flex items-center text-gray-600">
                <FaCheckCircle className="text-green-500 mr-2" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ icon, title, value }) => (
  <div className="flex items-center bg-gray-100 p-4 rounded-lg transition-all duration-300 hover:shadow-md hover:bg-gray-200">
    <div className="text-2xl text-blue-500 mr-4">{icon}</div>
    <div>
      <p className="font-semibold text-gray-700">{title}</p>
      <p className="text-gray-600">{value}</p>
    </div>
  </div>
);

export default VehicleDetails;