'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaGasPump, FaCogs, FaUsers, FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaClock, FaPhone, FaInfoCircle, FaStar } from 'react-icons/fa';
import API from '../utils/api';
import { useAuth } from '@/app/context/authContext';
import useRazorpay from '../hooks/useRazorPay';
import { motion } from 'framer-motion';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const VehicleDetails = ({ vehicle }) => {
  const { user } = useAuth();
  const isRazorpayLoaded = useRazorpay();
  const [bookingDetails, setBookingDetails] = useState({
    userId: '',
    vehicleId: '',
    phone: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    pricePerDay: 0,
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [showReviews, setShowReviews] = useState(false);

  useEffect(() => {
    if (user && vehicle) {
      setBookingDetails((prev) => ({
        ...prev,
        userId: user.id,
        vehicleId: vehicle._id,
        pricePerDay: vehicle.pricePerDay,
      }));
    }
  }, [user, vehicle]);

  useEffect(() => {
    calculateTotalPrice();
  }, [bookingDetails]);

  const calculateTotalPrice = () => {
    if (!bookingDetails.startDate || !bookingDetails.endDate || !bookingDetails.startTime || !bookingDetails.endTime) {
      setTotalPrice(vehicle?.pricePerDay || 0);
      return;
    }
    
    const start = new Date(`${bookingDetails.startDate}T${bookingDetails.startTime}`);
    const end = new Date(`${bookingDetails.endDate}T${bookingDetails.endTime}`);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setTotalPrice(vehicle?.pricePerDay || 0);
      return;
    }
    
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setTotalPrice(diffDays * vehicle.pricePerDay);
  };

  const handleChange = (e) => {
    setBookingDetails({ ...bookingDetails, [e.target.name]: e.target.value });
  };

  const handleBooking = async () => {
    if (!user || !user.id) {
      alert('User data not available. Please log in again.');
      return;
    }

    if (!isRazorpayLoaded) {
      alert('Payment system is not ready. Please try again.');
      return;
    }

    if (!window.Razorpay) {
      alert('Razorpay script not loaded. Please refresh the page.');
      return;
    }

    try {
      const response = await API.post('/bookings/create', bookingDetails);
      const { order } = response.data;

      const options = {
        key: 'rzp_test_tuyMEdztTfSRdP',
        amount: order.amount,
        currency: order.currency,
        name: 'Vehicle Booking',
        description: `Booking for ${vehicle.name}`,
        order_id: order.id,
        handler: async (response) => {
          try {
            const paymentResult = await API.post('/bookings/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              bookingId: order.receipt,
            });
            if (paymentResult.data.message === 'Payment verified successfully') {
              alert('Booking confirmed!');
            } else {
              alert('Payment verification failed!');
            }
          } catch (error) {
            console.error('Error verifying payment:', error);
            alert('Error verifying payment. Please contact support.');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: bookingDetails.phone,
        },
        theme: {
          color: '#3366FF',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Error creating booking. Please try again.');
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  if (!vehicle) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800">Loading vehicle details...</h2>
          <div className="mt-4 animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <motion.div 
        className="max-w-7xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <Card className="mb-6 overflow-hidden border-none shadow-xl">
          <div className="md:flex">
            {/* Left column: Image and basic info */}
            <div className="md:w-1/2 p-6">
              <div className="relative h-64 md:h-96 mb-6 rounded-lg overflow-hidden group">
                <Image
                  src={vehicle.image}
                  alt={vehicle.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button variant="secondary" className="hover:bg-opacity-80 transition-colors duration-300">
                    View Gallery
                  </Button>
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-gray-800 mb-2">{vehicle.name}</CardTitle>
              <div className="flex items-center mb-4">
                <Badge variant="outline" className="mr-3 text-base bg-gray-100 text-gray-600">{vehicle.type}</Badge>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar key={star} className="text-yellow-400" />
                  ))}
                  <span className="ml-2 text-gray-600">(4.5)</span>
                </div>
              </div>
              <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-none mb-6">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold">₹{vehicle.pricePerDay}</p>
                    <p className="text-sm">per day</p>
                  </div>
                  <div className="flex items-center">
                    {vehicle.available ? (
                      <FaCheckCircle className="text-3xl text-green-300 mr-2" />
                    ) : (
                      <FaTimesCircle className="text-3xl text-red-300 mr-2" />
                    )}
                    <p className="font-semibold">
                      {vehicle.available ? 'Available' : 'Not Available'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right column: Vehicle details and booking form */}
            <div className="md:w-1/2 p-6 bg-gray-50">
              <Card className="border-none shadow-none bg-transparent">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-2xl font-bold text-gray-800">Vehicle Details</CardTitle>
                </CardHeader>
                <CardContent className="px-0 py-2">
                  <p className="text-gray-700 mb-4">{vehicle.description}</p>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <Card className="bg-white shadow-sm">
                      <CardContent className="p-3 flex items-center">
                        <FaGasPump className="text-xl text-orange-500 mr-2" />
                        <p className="text-gray-700">{vehicle.fuelType}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-white shadow-sm">
                      <CardContent className="p-3 flex items-center">
                        <FaCogs className="text-xl text-gray-600 mr-2" />
                        <p className="text-gray-700">{vehicle.transmission}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-white shadow-sm">
                      <CardContent className="p-3 flex items-center">
                        <FaUsers className="text-xl text-green-500 mr-2" />
                        <p className="text-gray-700">{vehicle.seats} Seats</p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6 bg-white shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-semibold text-gray-800">Key Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-2 gap-2">
                    {vehicle.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-600">
                        <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-md">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-800">Book this Vehicle</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 sm:col-span-1">
                      <Label htmlFor="startDate" className="flex items-center mb-2">
                        <FaCalendarAlt className="mr-2" />
                        Start Date
                      </Label>
                      <Input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={bookingDetails.startDate}
                        onChange={handleChange}
                        className="focus:border-blue-500"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <Label htmlFor="endDate" className="flex items-center mb-2">
                        <FaCalendarAlt className="mr-2" />
                        End Date
                      </Label>
                      <Input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={bookingDetails.endDate}
                        onChange={handleChange}
                        className="focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="startTime" className="flex items-center mb-2">
                        <FaClock className="mr-2" />
                        Start Time
                      </Label>
                      <Input
                        type="time"
                        id="startTime"
                        name="startTime"
                        value={bookingDetails.startTime}
                        onChange={handleChange}
                        className="focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="endTime" className="flex items-center mb-2">
                        <FaClock className="mr-2" />
                        End Time
                      </Label>
                      <Input
                        type="time"
                        id="endTime"
                        name="endTime"
                        value={bookingDetails.endTime}
                        onChange={handleChange}
                        className="focus:border-blue-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="phone" className="flex items-center mb-2">
                        <FaPhone className="mr-2" />
                        Phone
                      </Label>
                      <Input
                        type="text"
                        id="phone"
                        name="phone"
                        value={bookingDetails.phone}
                        onChange={handleChange}
                        className="focus:border-blue-500"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center">
                        <p className="text-lg font-semibold text-gray-800">
                          Total Price: ₹{totalPrice || vehicle.pricePerDay}
                        </p>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <FaInfoCircle className="ml-2 text-blue-500 cursor-pointer" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Price may vary based on actual rental duration</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleBooking}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition duration-300 transform hover:scale-105"
                  >
                    Book Now
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </Card>
        
        {/* Reviews section */}
        <Card className="bg-gray-50 border-none shadow-lg">
          <CardContent className="p-6">
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button variant="link" className="text-blue-600 font-semibold mb-4 -ml-3 focus:outline-none">
                  {showReviews ? 'Hide Reviews' : 'Show Reviews'}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Sample review card */}
                  <Card className="mb-4 shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg font-semibold">John Doe</CardTitle>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star, i) => (
                            <FaStar key={i} className={i < 4 ? "text-yellow-400" : "text-gray-300"} />
                          ))}
                        </div>
                      </div>
                      <CardDescription>3 days ago</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">Great vehicle! Very smooth ride and excellent fuel efficiency.</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg font-semibold">Jane Smith</CardTitle>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star, i) => (
                            <FaStar key={i} className={i < 5 ? "text-yellow-400" : "text-gray-300"} />
                          ))}
                        </div>
                      </div>
                      <CardDescription>1 week ago</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">Amazing experience! The vehicle was clean and well-maintained. Will definitely book again.</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default VehicleDetails;