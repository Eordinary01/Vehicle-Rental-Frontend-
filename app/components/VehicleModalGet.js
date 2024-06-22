// components/VehicleModal.js
import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCar, FaMoneyBillWave, FaWheelchair, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const VehicleModalGet = ({ vehicle, isOpen, onClose }) => {
  if (!vehicle) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl w-full"
          >
            <div className="relative">
              <Image
                src={vehicle.image}
                alt={vehicle.name}
                width={800}
                height={400}
                objectFit="cover"
              />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all"
              >
                <FaTimes size={24} />
              </button>
            </div>
            <div className="p-6">
              <h2 className="text-3xl font-bold mb-4">{vehicle.name}</h2>
              <p className="text-gray-600 mb-4">{vehicle.description}</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center">
                  <FaCar className="mr-2 text-blue-500" />
                  <span>{vehicle.type}</span>
                </div>
                <div className="flex items-center">
                  <FaMoneyBillWave className="mr-2 text-green-500" />
                  <span>₹{vehicle.pricePerDay}/day</span>
                </div>
                <div className="flex items-center">
                  <FaWheelchair className="mr-2 text-purple-500" />
                  <span>{vehicle.wheelCount} Wheels</span>
                </div>
                <div className="flex items-center">
                  {vehicle.available ? (
                    <FaCheckCircle className="mr-2 text-green-500" />
                  ) : (
                    <FaTimesCircle className="mr-2 text-red-500" />
                  )}
                  <span>{vehicle.available ? 'Available' : 'Not Available'}</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Features:</h3>
              <ul className="list-disc list-inside">
                {vehicle.features.map((feature, index) => (
                  <li key={index} className="text-gray-600">{feature}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VehicleModalGet;