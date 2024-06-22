// components/VehicleDetails.js
import React from 'react';
import Image from 'next/image';
import { FaCar, FaMoneyBillWave, FaWheelchair, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const VehicleDetails = ({ vehicle }) => {
  if (!vehicle) {
    return <div>Loading vehicle details...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-96">
          <Image
            src={vehicle.image}
            alt={vehicle.name}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="p-6">
          <h1 className="text-4xl font-bold mb-4">{vehicle.name}</h1>
          <p className="text-gray-600 mb-6">{vehicle.description}</p>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="flex items-center">
              <FaCar className="text-3xl text-blue-500 mr-3" />
              <div>
                <p className="font-semibold">Type</p>
                <p className="text-gray-600">{vehicle.type}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FaMoneyBillWave className="text-3xl text-green-500 mr-3" />
              <div>
                <p className="font-semibold">Price</p>
                <p className="text-gray-600">₹{vehicle.pricePerDay}/day</p>
              </div>
            </div>
            <div className="flex items-center">
              <FaWheelchair className="text-3xl text-purple-500 mr-3" />
              <div>
                <p className="font-semibold">Wheels</p>
                <p className="text-gray-600">{vehicle.wheelCount} Wheels</p>
              </div>
            </div>
            <div className="flex items-center">
              {vehicle.available ? (
                <FaCheckCircle className="text-3xl text-green-500 mr-3" />
              ) : (
                <FaTimesCircle className="text-3xl text-red-500 mr-3" />
              )}
              <div>
                <p className="font-semibold">Availability</p>
                <p className={vehicle.available ? 'text-green-600' : 'text-red-600'}>
                  {vehicle.available ? 'Available' : 'Not Available'}
                </p>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-3">Features</h2>
            <ul className="list-disc list-inside grid grid-cols-2 gap-2">
              {vehicle.features.map((feature, index) => (
                <li key={index} className="text-gray-600">{feature}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;