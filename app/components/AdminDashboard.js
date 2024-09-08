import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { FaUser, FaPhone, FaCar, FaCalendarAlt, FaClock, FaMoneyBillWave, FaChartBar, FaSearch,FaCheckCircle } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    totalRevenue: 0,
  });

  const fetchAllBookings = async () => {
    try {
      const response = await API.get('/bookings/all');
      const data = response.data;
      if (Array.isArray(data)) {
        setBookings(data);
        calculateStats(data);
      } else {
        console.error('Unexpected response data format:', data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (bookingsData) => {
    const stats = bookingsData.reduce((acc, booking) => {
      acc.totalBookings++;
      acc.totalRevenue += booking.totalPrice || 0;
      if (booking.status === 'pending') acc.pendingBookings++;
      if (booking.status === 'confirmed') acc.confirmedBookings++;
      return acc;
    }, { totalBookings: 0, pendingBookings: 0, confirmedBookings: 0, totalRevenue: 0 });
    setStats(stats);
  };

  useEffect(() => {
    fetchAllBookings();
    const intervalId = setInterval(fetchAllBookings, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const filteredBookings = bookings.filter(booking =>
    booking.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.vehicleId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const chartData = [
    { name: 'Total Bookings', value: stats.totalBookings },
    { name: 'Pending', value: stats.pendingBookings },
    { name: 'Confirmed', value: stats.confirmedBookings },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-2xl font-semibold text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
        
        {/* Dashboard Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <DashboardCard title="Total Bookings" value={stats.totalBookings} icon={<FaChartBar className="text-blue-500" />} />
          <DashboardCard title="Pending Bookings" value={stats.pendingBookings} icon={<FaCalendarAlt className="text-yellow-500" />} />
          <DashboardCard title="Confirmed Bookings" value={stats.confirmedBookings} icon={<FaCheckCircle className="text-green-500" />} />
          <DashboardCard title="Total Revenue" value={`₹${stats.totalRevenue.toFixed(2)}`} icon={<FaMoneyBillWave className="text-green-500" />} />
        </div>

        {/* Bookings Chart */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Bookings Overview</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">All Bookings</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search bookings..."
                className="w-full p-2 pl-10 border border-gray-300 rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <TableHeader icon={<FaUser />} text="User" />
                  <TableHeader icon={<FaPhone />} text="Phone" />
                  <TableHeader icon={<FaCar />} text="Vehicle" />
                  <TableHeader icon={<FaCalendarAlt />} text="Start Date" />
                  <TableHeader icon={<FaClock />} text="Start Time" />
                  <TableHeader icon={<FaCalendarAlt />} text="End Date" />
                  <TableHeader icon={<FaClock />} text="End Time" />
                  <TableHeader text="Status" />
                  <TableHeader icon={<FaMoneyBillWave />} text="Total Price" />
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <BookingRow key={booking._id} booking={booking} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
        <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
      </div>
      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
        {icon}
      </div>
    </div>
  </div>
);

const TableHeader = ({ icon, text }) => (
  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    <div className="flex items-center">
      {icon && <span className="mr-2">{icon}</span>}
      {text}
    </div>
  </th>
);

const BookingRow = ({ booking }) => {
  const statusColor = {
    'pending': 'text-yellow-600 bg-yellow-100',
    'confirmed': 'text-green-600 bg-green-100',
    'cancelled': 'text-red-600 bg-red-100',
  };

  return (
    <tr className="hover:bg-gray-50">
      <TableCell>{booking.userId.name || 'N/A'}</TableCell>
      <TableCell>{booking.phone || 'N/A'}</TableCell>
      <TableCell>{booking.vehicleId.name || 'N/A'}</TableCell>
      <TableCell>{booking.startDate ? new Date(booking.startDate).toLocaleDateString() : 'N/A'}</TableCell>
      <TableCell>{booking.startTime || 'N/A'}</TableCell>
      <TableCell>{booking.endDate ? new Date(booking.endDate).toLocaleDateString() : 'N/A'}</TableCell>
      <TableCell>{booking.endTime || 'N/A'}</TableCell>
      <TableCell>
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor[booking.status.toLowerCase()] || 'text-gray-600 bg-gray-100'}`}>
          {booking.status || 'N/A'}
        </span>
      </TableCell>
      <TableCell>₹{booking.totalPrice || 'N/A'}</TableCell>
    </tr>
  );
};

const TableCell = ({ children }) => (
  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{children}</td>
);

export default AdminDashboard;