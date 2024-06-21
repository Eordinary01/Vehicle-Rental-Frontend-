// import Image from "next/image";

const VehicleCard = ({ vehicle }) => {
  return (
    <div className="relative max-w-sm rounded-lg overflow-hidden shadow-lg bg-gray-800 text-white">
      <div className="relative h-48">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
        <div className="absolute inset-0 bg-black opacity-25"></div>
      </div>
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2 text-orange-500">
          {vehicle.name}
        </div>
        <p className="text-gray-400">Type: {vehicle.type}</p>
        <p className="text-gray-400">Price per day: ₹{vehicle.pricePerDay}</p>
        <p
          className={`text-base ${
            vehicle.available ? "text-green-500" : "text-red-500"
          }`}
        >
          {vehicle.available ? "Available" : "Not Available"}
        </p>
      </div>
    </div>
  );
};

export default VehicleCard;
