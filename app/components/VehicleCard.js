import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaCar, FaMoneyBillWave, FaWheelchair, FaArrowRight, FaShoppingCart, FaStar, FaGasPump } from 'react-icons/fa';
import { motion } from 'framer-motion';

const VehicleCard = ({ vehicle }) => {
  const router = useRouter();

  if (!vehicle) {
    return <div className="animate-pulse bg-gray-200 h-96 rounded-xl"></div>;
  }

  const handleCardClick = () => {
    router.push(`/vehicle/${vehicle._id}`);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }
  };

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 cursor-pointer group relative"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onClick={handleCardClick}
    >
      <div className="relative h-56 overflow-hidden">
        <Image
          src={vehicle.image}
          alt={vehicle.name}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-300"></div>
        <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-full px-3 py-1 text-sm font-semibold text-gray-800">
          {vehicle.type}
        </div>
      </div>
      <div className="p-6 relative z-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-orange-500 transition-colors duration-300">{vehicle.name}</h2>
        <div className="flex items-center mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar key={star} className="text-yellow-400 mr-1" />
          ))}
          <span className="text-gray-600 ml-2">(4.5)</span>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-gray-600">
            <FaMoneyBillWave className="mr-2 text-green-500" />
            <span>₹{vehicle.pricePerDay}/day</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FaWheelchair className="mr-2 text-purple-500" />
            <span>{vehicle.wheelCount} Wheels</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FaGasPump className="mr-2 text-blue-500" />
            <span>{vehicle.fuelType}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FaCar className="mr-2 text-orange-500" />
            <span>{vehicle.transmission}</span>
          </div>
        </div>
        <div className={`text-sm font-semibold rounded-full px-3 py-1 inline-block ${
          vehicle.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {vehicle.available ? 'Available' : 'Not Available'}
        </div>
        <motion.button 
          onClick={handleCardClick} 
          className="mt-6 w-full py-3 px-4 flex items-center justify-center bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-300 shadow-md"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          View Details <FaArrowRight className="ml-2" />
        </motion.button>
      </div>
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          // Add to cart logic here
        }}
        className="absolute top-4 right-4 bg-white text-orange-500 rounded-full p-3 shadow-lg"
        whileHover={{ scale: 1.1, backgroundColor: "#FFA500", color: "#FFFFFF" }}
        whileTap={{ scale: 0.9 }}
      >
        <FaShoppingCart className="h-6 w-6" />
      </motion.button>
    </motion.div>
  );
};

export default VehicleCard;