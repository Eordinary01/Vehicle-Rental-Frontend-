'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaGasPump, FaCogs, FaUsers, FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaClock, FaPhone, FaInfoCircle, FaStar } from 'react-icons/fa';
import API from '../utils/api';
import { useAuth } from '@/app/context/authContext';
import useRazorpay from '../hooks/useRazorPay';
import { motion } from 'framer-motion';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

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
    const start = new Date(`${bookingDetails.startDate}T${bookingDetails.startTime}`);
    const end = new Date(`${bookingDetails.endDate}T${bookingDetails.endTime}`);
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

    console.log('Booking details:', bookingDetails);

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
          color: '#3399cc',
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
    return <div className="flex items-center justify-center h-screen">Loading vehicle details...</div>;
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <motion.div 
        className="max-w-7xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
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
                <button className="bg-white text-black px-4 py-2 rounded-full hover:bg-opacity-80 transition-colors duration-300">
                  View Gallery
                </button>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{vehicle.name}</h1>
            <div className="flex items-center mb-4">
              <p className="text-xl text-gray-600 mr-2">{vehicle.type}</p>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar key={star} className="text-yellow-400" />
                ))}
                <span className="ml-2 text-gray-600">(4.5)</span>
              </div>
            </div>
            <div className="flex items-center justify-between bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-lg mb-6 text-white">
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
            </div>
          </div>

          {/* Right column: Vehicle details and booking form */}
          <div className="md:w-1/2 p-6 bg-gray-50">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Vehicle Details</h2>
              <p className="text-gray-700 mb-4">{vehicle.description}</p>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="flex items-center bg-white p-3 rounded-lg shadow-sm">
                  <FaGasPump className="text-xl text-orange-500 mr-2" />
                  <p className="text-gray-700">{vehicle.fuelType}</p>
                </div>
                <div className="flex items-center bg-white p-3 rounded-lg shadow-sm">
                  <FaCogs className="text-xl text-gray-600 mr-2" />
                  <p className="text-gray-700">{vehicle.transmission}</p>
                </div>
                <div className="flex items-center bg-white p-3 rounded-lg shadow-sm">
                  <FaUsers className="text-xl text-green-500 mr-2" />
                  <p className="text-gray-700">{vehicle.seats} Seats</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Key Features:</h3>
                <ul className="grid grid-cols-2 gap-2">
                  {vehicle.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <FaCheckCircle className="text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Book this Vehicle</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-gray-700 mb-2" htmlFor="startDate">
                    <FaCalendarAlt className="inline mr-2" />
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={bookingDetails.startDate}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-gray-700 mb-2" htmlFor="endDate">
                    <FaCalendarAlt className="inline mr-2" />
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={bookingDetails.endDate}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="startTime">
                    <FaClock className="inline mr-2" />
                    Start Time
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={bookingDetails.startTime}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="endTime">
                    <FaClock className="inline mr-2" />
                    End Time
                  </label>
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={bookingDetails.endTime}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-gray-700 mb-2" htmlFor="phone">
                    <FaPhone className="inline mr-2" />
                    Phone
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={bookingDetails.phone}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="col-span-2">
                  <p className="text-lg font-semibold text-gray-800 mb-2">
                    Total Price: ₹{vehicle.pricePerDay}
                    <Tooltip id="price-info" />
                    <FaInfoCircle
                      className="inline-block ml-2 text-blue-500 cursor-pointer"
                      data-tooltip-id="price-info"
                      data-tooltip-content="Price may vary based on actual rental duration"
                    />
                  </p>
                </div>
                <div className="col-span-2">
                  <button
                    onClick={handleBooking}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition duration-300 focus:outline-none transform hover:scale-105"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Reviews section */}
        <div className="p-6 bg-gray-100">
          <button
            onClick={() => setShowReviews(!showReviews)}
            className="text-blue-600 font-semibold mb-4 focus:outline-none"
          >
            {showReviews ? 'Hide Reviews' : 'Show Reviews'}
          </button>
          {showReviews && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Add review components here */}
              <p>Reviews will be displayed here.</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VehicleDetails;