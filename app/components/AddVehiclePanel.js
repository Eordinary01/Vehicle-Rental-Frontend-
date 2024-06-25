"use client";

const AddVehiclePanel = ({ isVisible, onClose, onSubmit, formData, handleChange, loading, vehicleTypes, fuelTypeOptions, transmissionOptions, wheelCountOptions }) => {
  return (
    <div className={`fixed top-0 left-0 w-full md:w-1/2 lg:w-1/3 h-full bg-gray-800 p-8 transform transition-transform duration-300 ease-in-out ${isVisible ? 'translate-x-0' : '-translate-x-full'} overflow-y-auto z-50`}>
      <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-orange-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <h2 className="text-3xl font-bold mb-6 text-orange-500">Add a New Vehicle</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          value={formData.name}
          required
          className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <select
          name="type"
          onChange={handleChange}
          value={formData.type}
          required
          className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="">Select Vehicle Type</option>
          {vehicleTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          onChange={handleChange}
          value={formData.image}
          required
          className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <input
          type="number"
          name="pricePerDay"
          placeholder="Price per day"
          onChange={handleChange}
          value={formData.pricePerDay}
          required
          className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <select
          name="wheelCount"
          onChange={handleChange}
          value={formData.wheelCount}
          required
          className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="">Select Wheel Count</option>
          {wheelCountOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          value={formData.description}
          required
          className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <input
          type="text"
          name="features"
          placeholder="Features (comma-separated)"
          onChange={handleChange}
          value={formData.features}
          required
          className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <select
          name="fuelType"
          onChange={handleChange}
          value={formData.fuelType}
          required
          className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="">Select Fuel Type</option>
          {fuelTypeOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <select
          name="transmission"
          onChange={handleChange}
          value={formData.transmission}
          required
          className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="">Select Transmission</option>
          {transmissionOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <input
          type="number"
          name="capacity"
          placeholder="Capacity"
          onChange={handleChange}
          value={formData.capacity}
          required
          className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <input
          type="number"
          name="year"
          placeholder="Year"
          onChange={handleChange}
          value={formData.year}
          required
          className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <select
          name="available"
          onChange={handleChange}
          value={formData.available}
          className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="true">Available</option>
          <option value="false">Not Available</option>
        </select>
        <button type="submit" className="w-full bg-orange-500 hover:bg-orange-400 text-white py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
          {loading ? "Adding..." : "Add Vehicle"}
        </button>
      </form>
    </div>
  );
};


export default AddVehiclePanel;