'use client'
import React, { useState, useEffect } from "react";

const VehicleModal = ({ vehicle, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState(vehicle);

  useEffect(() => {
    setFormData(vehicle);
  }, [vehicle]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-orange-500">Edit Vehicle</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            value={formData.name}
            required
            className="w-full p-2 mb-4 bg-gray-700 text-white border border-gray-600 rounded"
          />
          <input
            type="text"
            name="type"
            placeholder="Type"
            onChange={handleChange}
            value={formData.type}
            required
            className="w-full p-2 mb-4 bg-gray-700 text-white border border-gray-600 rounded"
          />
          <input
            type="text"
            name="image"
            placeholder="Image URL"
            onChange={handleChange}
            value={formData.image}
            required
            className="w-full p-2 mb-4 bg-gray-700 text-white border border-gray-600 rounded"
          />
          <input
            type="number"
            name="pricePerDay"
            placeholder="Price per day"
            onChange={handleChange}
            value={formData.pricePerDay}
            required
            className="w-full p-2 mb-4 bg-gray-700 text-white border border-gray-600 rounded"
          />
          <select
            name="available"
            onChange={handleChange}
            value={formData.available}
            className="w-full p-2 mb-4 bg-gray-700 text-white border border-gray-600 rounded"
          >
            <option value="true">Available</option>
            <option value="false">Not Available</option>
          </select>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-400"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleModal;
