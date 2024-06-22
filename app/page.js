"use client";
import { useEffect, useState } from "react";
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
    wheelCount: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const [types, setTypes] = useState([]);
  const [wheelCounts, setWheelCounts] = useState([]);
  const [priceRanges] = useState([
    { label: 'All', value: '' },
    { label: '₹0 - ₹1000', value: '0-1000' },
    { label: '₹1001 - ₹2000', value: '1001-2000' },
    { label: '₹2001 - ₹3000', value: '2001-3000' },
    { label: '₹3001 - ₹4000', value: '3001-4000' },
    { label: '₹4001+', value: '4001+' }
  ]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const { data } = await API.get("/vehicles");
        setVehicles(data);
        setFilteredVehicles(data);
        const uniqueTypes = [...new Set(data.map(vehicle => vehicle.type))];
        setTypes(['All', ...uniqueTypes]);
        const uniqueWheelCounts = [...new Set(data.map(vehicle => vehicle.wheelCount))];
        setWheelCounts(['All', ...uniqueWheelCounts]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  useEffect(() => {
    const filtered = vehicles.filter(vehicle => {
      const typeMatch = filters.type === '' || filters.type === 'All' || vehicle.type === filters.type;
      const availabilityMatch = filters.availability === '' || 
        (filters.availability === 'Available' && vehicle.available) ||
        (filters.availability === 'Not Available' && !vehicle.available);
      const priceMatch = isPriceInRange(vehicle.pricePerDay, filters.priceRange);
      const searchMatch = vehicle.name.toLowerCase().includes(filters.search.toLowerCase());
      const wheelCountMatch = filters.wheelCount === '' || filters.wheelCount === 'All' || vehicle.wheelCount.toString() === filters.wheelCount;
      return typeMatch && availabilityMatch && priceMatch && searchMatch && wheelCountMatch;
    });
    setFilteredVehicles(filtered);
  }, [filters, vehicles]);

  const isPriceInRange = (price, range) => {
    if (range === '') return true;
    if (range.endsWith('+')) {
      const minPrice = parseInt(range.slice(0, -1));
      return price >= minPrice;
    }
    const [min, max] = range.split('-').map(Number);
    return price >= min && price <= max;
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
      wheelCount: ''
    });
  };

  return (
    <div className="flex min-h-screen ">
      {/* Sidebar for filters */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${showFilters ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className="p-5">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Filters</h2>
            <button onClick={() => setShowFilters(false)} className="text-gray-600 hover:text-gray-800">
              <FaTimes size={24} />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="w-full p-2 rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
              >
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
              <select
                name="availability"
                value={filters.availability}
                onChange={handleFilterChange}
                className="w-full p-2 rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
              >
                <option value="">All</option>
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
              <select
                name="priceRange"
                value={filters.priceRange}
                onChange={handleFilterChange}
                className="w-full p-2 rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
              >
                {priceRanges.map(range => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Wheel Count</label>
              <select
                name="wheelCount"
                value={filters.wheelCount}
                onChange={handleFilterChange}
                className="w-full p-2 rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
              >
                {wheelCounts.map(count => (
                  <option key={count} value={count}>{count}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search vehicles..."
                className="w-full p-2 rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
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
              {filteredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle._id} vehicle={vehicle} />
              ))}
            </div>

            {filteredVehicles.length === 0 && (
              <p className="text-xl text-gray-600 mt-8 text-center">No vehicles match your current filters.</p>
            )}
          </>
        )}
      </main>
    </div>
  );
}
