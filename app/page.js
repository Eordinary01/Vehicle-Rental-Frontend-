'use client'
import React, { useEffect, useState } from "react";
import API from "./utils/api";
import { ThreeDots } from 'react-loader-spinner';
import { 
  Car, Filter, X, Search, CalendarRange, Droplets, 
  Gauge, Users, GitCommit, BadgeIndianRupee, Calendar
} from "lucide-react";
import VehicleCard from "./components/VehicleCard";

// Import shadcn components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";



export default function Home() {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: 'all',
    availability: 'all',
    priceRange: 'all',
    search: '',
    wheelCount: 'all',
    fuelType: 'all',
    transmission: 'all',
    capacity: 'all',
    year: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const vehiclesPerPage = 6;
  const [activeCategory, setActiveCategory] = useState("all");

  const [filterOptions, setFilterOptions] = useState({
    types: ['All'],
    wheelCounts: ['All'],
    fuelTypes: ['All'],
    transmissions: ['All'],
    capacities: ['All'],
    years: ['All'],
    priceRanges: [
      { label: 'All', value: 'all' },
      { label: '₹0 - ₹1000', value: '0-1000' },
      { label: '₹1001 - ₹2000', value: '1001-2000' },
      { label: '₹2001 - ₹3000', value: '2001-3000' },
      { label: '₹3001 - ₹4000', value: '3001-4000' },
      { label: '₹4001+', value: '4001+' }
    ],
    availabilities: [
      { label: 'All', value: 'all' },
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
        const typeMatch = activeCategory === "all" 
          ? (filters.type === 'all' || filters.type === 'All' || vehicle.type === filters.type)
          : vehicle.type === activeCategory;
        const availabilityMatch = filters.availability === 'all' || 
          (filters.availability === 'Available' && vehicle.available) ||
          (filters.availability === 'Not Available' && !vehicle.available);
        const priceMatch = isPriceInRange(vehicle.pricePerDay, filters.priceRange);
        const searchMatch = vehicle.name.toLowerCase().includes(filters.search.toLowerCase());
        const wheelCountMatch = filters.wheelCount === 'all' || filters.wheelCount === 'All' || 
          (vehicle.wheelCount && vehicle.wheelCount.toString() === filters.wheelCount);
        const fuelTypeMatch = filters.fuelType === 'all' || filters.fuelType === 'All' || vehicle.fuelType === filters.fuelType;
        const transmissionMatch = filters.transmission === 'all' || filters.transmission === 'All' || vehicle.transmission === filters.transmission;
        const capacityMatch = filters.capacity === 'all' || filters.capacity === 'All' || 
          (vehicle.capacity && vehicle.capacity.toString() === filters.capacity);
        const yearMatch = filters.year === 'all' || filters.year === 'All' || 
          (vehicle.year && vehicle.year.toString() === filters.year);
        return typeMatch && availabilityMatch && priceMatch && searchMatch && wheelCountMatch && 
               fuelTypeMatch && transmissionMatch && capacityMatch && yearMatch;
      });
      setFilteredVehicles(filtered);
      setCurrentPage(1); // Reset to first page when filters change
    };

    applyFilters();
  }, [filters, vehicles, activeCategory]);

  const isPriceInRange = (price, range) => {
    if (range === 'all' || range === 'All') return true;
    
    const [min, max] = range.split('-').map(value => parseInt(value.replace('₹', '').replace(',', '')));
  
    if (range.endsWith('+')) {
      return price >= min;
    } else {
      return price >= min && price <= max;
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      type: 'all',
      availability: 'all',
      priceRange: 'all',
      search: '',
      wheelCount: 'all',
      fuelType: 'all',
      transmission: 'all',
      capacity: 'all',
      year: 'all'
    });
    setActiveCategory("all");
  };

  const indexOfLastVehicle = currentPage * vehiclesPerPage;
  const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage;
  const currentVehicles = filteredVehicles.slice(indexOfFirstVehicle, indexOfLastVehicle);
  const totalPages = Math.ceil(filteredVehicles.length / vehiclesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Get unique vehicle types for category tabs
  const vehicleCategories = ['all', ...new Set(vehicles.map(v => v.type))];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Hero section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-800 text-white">
        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Journey, Your Choice</h1>
            <p className="text-xl opacity-90 mb-8">Discover the perfect vehicle for every adventure. Premium rentals at competitive prices.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-gray-100">
                Browse Vehicles
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                Learn More
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-black/40 -z-10"></div>
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center -z-20"></div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search and filter section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold text-gray-800">Explore Our Fleet</h2>
          
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64 text-gray-950">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search vehicles..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10 bg-white border-gray-200"
              />
            </div>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter size={18} />
                  <span className="hidden sm:inline">Filters</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Refine Your Search</SheetTitle>
                  <SheetDescription className='text-blue-950'>
                    Customize your vehicle search based on your preferences.
                  </SheetDescription>
                </SheetHeader>
                
                <div className="py-6 space-y-6">
                  <div className="space-y-2">
                    <Label>Availability</Label>
                    <Select 
                      value={filters.availability} 
                      onValueChange={(value) => handleFilterChange('availability', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select availability" />
                      </SelectTrigger>
                      <SelectContent>
                        {filterOptions.availabilities.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="priceRange">Price Range</Label>
                    <Select 
                      value={filters.priceRange} 
                      onValueChange={(value) => handleFilterChange('priceRange', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select price range" />
                      </SelectTrigger>
                      <SelectContent>
                        {filterOptions.priceRanges.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />
                  
                  <div className="space-y-2">
                    <Label>Vehicle Specifications</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Gauge size={16} className="text-gray-500" />
                          <Label>Wheel Count</Label>
                        </div>
                        <Select 
                          value={filters.wheelCount} 
                          onValueChange={(value) => handleFilterChange('wheelCount', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {filterOptions.wheelCounts.map(option => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Droplets size={16} className="text-gray-500" />
                          <Label>Fuel Type</Label>
                        </div>
                        <Select 
                          value={filters.fuelType} 
                          onValueChange={(value) => handleFilterChange('fuelType', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {filterOptions.fuelTypes.map(option => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <GitCommit size={16} className="text-gray-500" />
                          <Label>Transmission</Label>
                        </div>
                        <Select 
                          value={filters.transmission} 
                          onValueChange={(value) => handleFilterChange('transmission', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {filterOptions.transmissions.map(option => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-gray-500" />
                          <Label>Capacity</Label>
                        </div>
                        <Select 
                          value={filters.capacity} 
                          onValueChange={(value) => handleFilterChange('capacity', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {filterOptions.capacities.map(option => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-500" />
                      <Label>Year</Label>
                    </div>
                    <Select 
                      value={filters.year} 
                      onValueChange={(value) => handleFilterChange('year', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {filterOptions.years.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <SheetFooter className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" onClick={clearFilters} className="w-full">
                    Reset Filters
                  </Button>
                  <SheetClose asChild>
                    <Button className="w-full">Apply Filters</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Vehicle category tabs */}
        <Tabs defaultValue="all" className="mb-10" value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="mb-6 flex w-full overflow-x-auto">
            {vehicleCategories.map(category => (
              <TabsTrigger 
                key={category}
                value={category}
                className="flex-1"
              >
                {category === 'all' ? 'All Vehicles' : category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <ThreeDots 
                height="80" 
                width="80" 
                radius="9"
                color="#4F46E5" 
                ariaLabel="loading"
                visible={true}
              />
            </div>
          ) : (
            <div>
              {filteredVehicles.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Car size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No vehicles found</h3>
                  <p className="text-gray-500 mb-6">Try adjusting your filters to find what you're looking for.</p>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear All Filters
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentVehicles.map((vehicle) => (
                      <VehicleCard key={vehicle._id} vehicle={vehicle} />
                    ))}
                  </div>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-12">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => paginate(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="h-8 w-8"
                        >
                          &lt;
                        </Button>
                        
                        {Array.from({ length: totalPages }, (_, i) => {
                          // Show current page, first, last and pages close to current
                          const pageNum = i + 1;
                          if (
                            pageNum === 1 || 
                            pageNum === totalPages || 
                            (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                          ) {
                            return (
                              <Button
                                key={pageNum}
                                variant={currentPage === pageNum ? "default" : "outline"}
                                size="sm"
                                onClick={() => paginate(pageNum)}
                                className="h-8 w-8"
                              >
                                {pageNum}
                              </Button>
                            );
                          } else if (
                            (pageNum === currentPage - 2 && currentPage > 3) || 
                            (pageNum === currentPage + 2 && currentPage < totalPages - 2)
                          ) {
                            return <span key={pageNum} className="px-1">...</span>;
                          }
                          return null;
                        })}
                        
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="h-8 w-8"
                        >
                          &gt;
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </Tabs>
      </div>
    </div>
  );
}