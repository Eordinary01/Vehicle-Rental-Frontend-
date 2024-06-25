import React, { useState, useEffect } from "react";

const VehicleModal = ({ vehicle, isOpen, onClose, onSave, vehicleTypes, fuelTypeOptions, transmissionOptions, wheelCountOptions }) => {
  const [formData, setFormData] = useState(vehicle);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setFormData(vehicle);
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 50);
    } else {
      setIsVisible(false);
    }
  }, [vehicle, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]:
        name === "wheelCount" || name === "capacity" || name === "year"
          ? parseInt(value)
          : name === "pricePerDay"
          ? parseFloat(value)
          : name === "features"
          ? value.split(",").map((item) => item.trim())
          : name === "available"
          ? value === "true"
          : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
      <div 
        className={`fixed top-0 left-0 w-full sm:w-2/3 md:w-1/2 lg:w-1/3 h-full bg-gray-800 p-8 overflow-y-auto transition-transform duration-300 ease-in-out transform ${
          isVisible ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <h2 className="text-2xl font-semibold mb-6 text-white">Edit Vehicle</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField name="name" label="Name" value={formData.name} onChange={handleChange} />
          <SelectField 
            name="type" 
            label="Type" 
            value={formData.type} 
            onChange={handleChange}
            options={vehicleTypes.map(option => ({ value: option, label: option }))}
          />
          <InputField name="image" label="Image URL" value={formData.image} onChange={handleChange} />
          <InputField name="pricePerDay" label="Price per day" value={formData.pricePerDay} onChange={handleChange} type="number" />
          <SelectField 
            name="wheelCount" 
            label="Wheel Count" 
            value={formData.wheelCount} 
            onChange={handleChange}
            options={wheelCountOptions.map(option => ({ value: option, label: option }))}
          />
          <TextAreaField name="description" label="Description" value={formData.description} onChange={handleChange} />
          <InputField 
            name="features" 
            label="Features (comma-separated)" 
            value={Array.isArray(formData.features) ? formData.features.join(", ") : formData.features} 
            onChange={handleChange} 
          />
          <SelectField 
            name="available" 
            label="Availability" 
            value={formData.available} 
            onChange={handleChange}
            options={[
              { value: "true", label: "Available" },
              { value: "false", label: "Not Available" }
            ]}
          />
          <SelectField 
            name="fuelType" 
            label="Fuel Type" 
            value={formData.fuelType} 
            onChange={handleChange}
            options={fuelTypeOptions.map(option => ({ value: option, label: option }))}
          />
          <SelectField 
            name="transmission" 
            label="Transmission" 
            value={formData.transmission} 
            onChange={handleChange}
            options={transmissionOptions.map(option => ({ value: option, label: option }))}
          />
          <InputField name="capacity" label="Capacity" value={formData.capacity} onChange={handleChange} type="number" />
          <InputField name="year" label="Year" value={formData.year} onChange={handleChange} type="number" />

          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={handleClose}
              className="bg-gray-500 hover:bg-gray-400 text-white py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-400 text-white py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const InputField = ({ name, label, value, onChange, type = "text" }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required
      className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
    />
  </div>
);

const TextAreaField = ({ name, label, value, onChange }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required
      className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
    />
  </div>
);

const SelectField = ({ name, label, value, onChange, options }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export default VehicleModal;