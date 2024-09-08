// components/UserDashboard.js

import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { useAuth } from '@/app/context/authContext';

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await API.get(`/bookings/user/${user.id}`);
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [user.id]);

  if (isLoading) {
    return <div>Loading bookings...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
      <div className="grid gap-4">
        {bookings.map((booking) => (
          <BookingCard key={booking._id} booking={booking} />
        ))}
      </div>
    </div>
  );
};

const BookingCard = ({ booking }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold">{booking.vehicle.name}</h2>
      <p>Start Date: {new Date(booking.startDate).toLocaleDateString()}</p>
      <p>End Date: {new Date(booking.endDate).toLocaleDateString()}</p>
      <p>Status: {booking.status}</p>
      <p>Total Price: ₹{booking.totalPrice}</p>
    </div>
  );
};

export default UserDashboard;