'use client'
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import API from '../utils/api';
import { 
  FaUser, FaPhone, FaCar, FaCalendarAlt, FaClock, 
  FaMoneyBillWave, FaChartBar, FaSearch, FaCheckCircle, 
  FaFilter, FaSort 
} from 'react-icons/fa';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'startDate', direction: 'desc' });
  const [filterStatus, setFilterStatus] = useState('all');

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

  const filteredAndSortedBookings = useMemo(() => {
    let result = bookings.filter(booking => 
      (filterStatus === 'all' || booking.status.toLowerCase() === filterStatus) &&
      (booking.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       booking.vehicleId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       booking.status.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    result.sort((a, b) => {
      if (sortConfig.key === 'startDate') {
        return sortConfig.direction === 'asc' 
          ? new Date(a.startDate) - new Date(b.startDate)
          : new Date(b.startDate) - new Date(a.startDate);
      }
      if (sortConfig.key === 'totalPrice') {
        return sortConfig.direction === 'asc' 
          ? (a.totalPrice || 0) - (b.totalPrice || 0)
          : (b.totalPrice || 0) - (a.totalPrice || 0);
      }
      return 0;
    });

    return result;
  }, [bookings, searchTerm, filterStatus, sortConfig]);

  const chartData = [
    { name: 'Total Bookings', value: stats.totalBookings },
    { name: 'Pending', value: stats.pendingBookings },
    { name: 'Confirmed', value: stats.confirmedBookings },
  ];

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-100 to-purple-100">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-semibold text-gray-700"
        >
          Loading dashboard...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.h1 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6"
        >
          Admin Dashboard
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { title: 'Total Bookings', value: stats.totalBookings, icon: FaChartBar, color: 'blue' },
            { title: 'Pending Bookings', value: stats.pendingBookings, icon: FaCalendarAlt, color: 'yellow' },
            { title: 'Confirmed Bookings', value: stats.confirmedBookings, icon: FaCheckCircle, color: 'green' },
            { title: 'Total Revenue', value: `₹${stats.totalRevenue.toFixed(2)}`, icon: FaMoneyBillWave, color: 'purple' },
          ].map(({ title, value, icon: Icon, color }) => (
            <motion.div 
              key={title}
              whileHover={{ scale: 1.05 }}
              className={`bg-white shadow-lg rounded-xl p-6 border-b-4 border-${color}-500 transform transition-all`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
                </div>
                <div className={`w-12 h-12 bg-${color}-100 rounded-full flex items-center justify-center`}>
                  <Icon className={`text-${color}-500`} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {/* Bookings Overview Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Bookings Overview</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#6366F1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
            <div className="flex space-x-4">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search bookings..."
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-4 text-gray-400" />
              </div>
              <select 
                className="p-3 border border-gray-300 rounded-lg"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Bookings Table */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <tr>
                  {[
                    { key: 'user', text: 'User', icon: FaUser },
                    { key: 'phone', text: 'Phone', icon: FaPhone },
                    { key: 'vehicle', text: 'Vehicle', icon: FaCar },
                    { key: 'startDate', text: 'Start Date', icon: FaCalendarAlt },
                    { key: 'startTime', text: 'Start Time', icon: FaClock },
                    { key: 'status', text: 'Status' },
                    { key: 'totalPrice', text: 'Total Price', icon: FaMoneyBillWave }
                  ].map(({ key, text, icon: Icon }) => (
                    <th 
                      key={key} 
                      onClick={() => handleSort(key)} 
                      className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-blue-600 transition"
                    >
                      <div className="flex items-center">
                        {Icon && <Icon className="mr-2" />}
                        {text}
                        {sortConfig.key === key && (
                          <FaSort className="ml-2" />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedBookings.map((booking) => (
                  <BookingRow key={booking._id} booking={booking} />
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
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
  <th
    scope="col"
    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
  >
    <div className="flex items-center">
      {icon && <span className="mr-2">{icon}</span>}
      {text}
    </div>
  </th>
);

const BookingRow = ({ booking }) => {
  const statusColor = {
    pending: "text-yellow-600 bg-yellow-100",
    confirmed: "text-green-600 bg-green-100",
    cancelled: "text-red-600 bg-red-100",
  };

  return (
    <tr className="hover:bg-gray-50">
      <TableCell>{booking.userId.name || "N/A"}</TableCell>
      <TableCell>{booking.phone || "N/A"}</TableCell>
      <TableCell>{booking.vehicleId.name || "N/A"}</TableCell>
      <TableCell>
        {booking.startDate
          ? new Date(booking.startDate).toLocaleDateString()
          : "N/A"}
      </TableCell>
      <TableCell>{booking.startTime || "N/A"}</TableCell>
      <TableCell>
        {booking.endDate
          ? new Date(booking.endDate).toLocaleDateString()
          : "N/A"}
      </TableCell>
      <TableCell>{booking.endTime || "N/A"}</TableCell>
      <TableCell>
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            statusColor[booking.status.toLowerCase()] ||
            "text-gray-600 bg-gray-100"
          }`}
        >
          {booking.status || "N/A"}
        </span>
      </TableCell>
      <TableCell>₹{booking.totalPrice || "N/A"}</TableCell>
    </tr>
  );
};

const TableCell = ({ children }) => (
  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
    {children}
  </td>
);

export default AdminDashboard;
