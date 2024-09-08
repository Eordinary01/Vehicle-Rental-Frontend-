'use client'
import React, { useEffect, useState } from "react";
import API from "./utils/api";
import VehicleCard from "./components/VehicleCard";
import { ThreeDots } from 'react-loader-spinner';
import { FaFilter, FaTimes } from 'react-icons/fa';

export default function Home() {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    availability: '',
    priceRange: '',
    search: '',
    wheelCount: '',
    fuelType: '',
    transmission: '',
    capacity: '',
    year: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const vehiclesPerPage = 6;

  const [filterOptions, setFilterOptions] = useState({
    types: ['All'],
    wheelCounts: ['All'],
    fuelTypes: ['All'],
    transmissions: ['All'],
    capacities: ['All'],
    years: ['All'],
    priceRanges: [
      { label: 'All', value: '' },
      { label: '₹0 - ₹1000', value: '0-1000' },
      { label: '₹1001 - ₹2000', value: '1001-2000' },
      { label: '₹2001 - ₹3000', value: '2001-3000' },
      { label: '₹3001 - ₹4000', value: '3001-4000' },
      { label: '₹4001+', value: '4001+' }
    ],
    availabilities: [
      { label: 'All', value: '' },
      { label: 'Available', value: 'Available' },
      { label: 'Not Available', value: 'Not Available' }
    ]
  });

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const { data } = await API.get("/vehicles");
        setVehicles(data);
        setFilteredVehicles(data);
        
        // Extract unique values for filter options
        const types = ['All', ...new Set(data.map(v => v.type))];
        const wheelCounts = ['All', ...new Set(data.map(v => v.wheelCount))];
        const fuelTypes = ['All', ...new Set(data.map(v => v.fuelType))];
        const transmissions = ['All', ...new Set(data.map(v => v.transmission))];
        const capacities = ['All', ...new Set(data.map(v => v.capacity))];
        const years = ['All', ...new Set(data.map(v => v.year))];

        setFilterOptions(prev => ({
          ...prev,
          types,
          wheelCounts,
          fuelTypes,
          transmissions,
          capacities,
          years: years.sort((a, b) => b - a)
        }));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      const filtered = vehicles.filter(vehicle => {
        const typeMatch = filters.type === '' || filters.type === 'All' || vehicle.type === filters.type;
        const availabilityMatch = filters.availability === '' || 
          (filters.availability === 'Available' && vehicle.available) ||
          (filters.availability === 'Not Available' && !vehicle.available);
        const priceMatch = isPriceInRange(vehicle.pricePerDay, filters.priceRange);
        const searchMatch = vehicle.name.toLowerCase().includes(filters.search.toLowerCase());
        const wheelCountMatch = filters.wheelCount === '' || filters.wheelCount === 'All' || 
          (vehicle.wheelCount && vehicle.wheelCount.toString() === filters.wheelCount);
        const fuelTypeMatch = filters.fuelType === '' || filters.fuelType === 'All' || vehicle.fuelType === filters.fuelType;
        const transmissionMatch = filters.transmission === '' || filters.transmission === 'All' || vehicle.transmission === filters.transmission;
        const capacityMatch = filters.capacity === '' || filters.capacity === 'All' || 
          (vehicle.capacity && vehicle.capacity.toString() === filters.capacity);
        const yearMatch = filters.year === '' || filters.year === 'All' || 
          (vehicle.year && vehicle.year.toString() === filters.year);
        return typeMatch && availabilityMatch && priceMatch && searchMatch && wheelCountMatch && 
               fuelTypeMatch && transmissionMatch && capacityMatch && yearMatch;
      });
      setFilteredVehicles(filtered);
    };

    applyFilters();
  }, [filters, vehicles]);

  const isPriceInRange = (price, range) => {
    if (range === '' || range === 'All') return true;
    
    const [min, max] = range.split('-').map(value => parseInt(value.replace('₹', '').replace(',', '')));
  
    if (range.endsWith('+')) {
      return price >= min;
    } else {
      return price >= min && price <= max;
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      availability: '',
      priceRange: '',
      search: '',
      wheelCount: '',
      fuelType: '',
      transmission: '',
      capacity: '',
      year: ''
    });
  };

  const renderSelect = (name, options, label) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        name={name}
        value={filters[name]}
        onChange={handleFilterChange}
        className="w-full p-2 rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
      >
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );

  const indexOfLastVehicle = currentPage * vehiclesPerPage;
  const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage;
  const currentVehicles = filteredVehicles.slice(indexOfFirstVehicle, indexOfLastVehicle);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar for filters */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${showFilters ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out overflow-y-auto`}>
        <div className="p-5">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Filters</h2>
            <button onClick={() => setShowFilters(false)} className="text-gray-600 hover:text-gray-800">
              <FaTimes size={24} />
            </button>
          </div>
          <div className="space-y text-black">
            {renderSelect("type", filterOptions.types, "Vehicle Type")}
            {renderSelect("availability", filterOptions.availabilities.map(a => a.label), "Availability")}
            {renderSelect("priceRange", filterOptions.priceRanges.map(range => range.label), "Price Range")}
            {renderSelect("wheelCount", filterOptions.wheelCounts, "Wheel Count")}
            {renderSelect("fuelType", filterOptions.fuelTypes, "Fuel Type")}
            {renderSelect("transmission", filterOptions.transmissions, "Transmission")}
            {renderSelect("capacity", filterOptions.capacities, "Capacity")}
            {renderSelect("year", filterOptions.years, "Year")}
            <div>
              <label className="block text-sm font-medium text-black mb-1">Search</label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search vehicles..."
                className="w-full p-2 rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 text-black"
              />
            </div>
            <button
              onClick={clearFilters}
              className="w-full py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 transition duration-300"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 p-10 ml-0 sm:ml-64">
        {loading ? (
          <div className="flex justify-center items-center min-h-screen">
            <ThreeDots 
              height="100" 
              width="100" 
              radius="9"
              color="#4F46E5" 
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClassName=""
              visible={true}
            />
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold text-gray-500">Available Vehicles</h1>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center py-2 px-4 bg-orange-600 text-white rounded hover:bg-blue-700 transition duration-300"
              >
                <FaFilter className="mr-2" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentVehicles.map((vehicle) => (
                <VehicleCard key={vehicle._id} vehicle={vehicle} />
              ))}
            </div>

            {filteredVehicles.length === 0 && (
              <p className="text-xl text-gray-600 mt-8 text-center">No vehicles match your current filters.</p>
            )}

            <div className="flex justify-center items-center mt-8">
              {Array.from({ length: Math.ceil(filteredVehicles.length / vehiclesPerPage) }, (_, i) => (
                <button key={i} onClick={() => paginate(i + 1)} className={`mx-1 px-3 py-2 rounded-md ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                  {i + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
