'use client'
import React, { useState, useEffect } from 'react';
import API from '@/app/utils/api';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/authContext';
import Toast from '../../components/Toast';

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
  const [responseMessage, setResponseMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState('');

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data: users } = await API.get('/users');
        const adminExists = users.some(user => user.role === 'admin');
        if (!adminExists) {
          setFormData(prevFormData => ({ ...prevFormData, role: 'admin' }));
        }
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };
    checkAdmin();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/auth/register', formData);
      setResponseMessage('Registration Successful!');
      setToastType('success');
      setShowToast(true);
      setTimeout(() => {
        setResponseMessage('Redirecting to login page...');
      }, 2000);
      const loginResponse = await API.post('/auth/login', { email: formData.email, password: formData.password });
      const { token, role } = loginResponse.data;
      if (!token || !role) {
        console.error('Invalid response from the server:', loginResponse.data);
        setResponseMessage('Error Logging In');
        setToastType('error');
        setShowToast(true);
        setLoading(false);
        return;
      }
      login(token, role);
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (err) {
      console.error('Error during registration:', err);
      if (err.response) {
        console.error('Server responded with:', err.response.data);
        setResponseMessage(`Error Registering User: ${err.response.data.message || 'Unknown error'}`);
      } else {
        setResponseMessage('Error Registering User: Network error');
      }
      setToastType('error');
      setShowToast(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center text-white">
      <h1 className="text-4xl font-bold mb-8 text-orange-500">Register</h1>
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-lg w-full">
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          value={formData.name}
          required
          className="w-full p-2 mb-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={formData.email}
          required
          className="w-full p-2 mb-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={formData.password}
          required
          className="w-full p-2 mb-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-400 text-white py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      {responseMessage && showToast && (
        <Toast message={responseMessage} type={toastType} onClose={() => setShowToast(false)} />
      )}
    </div>
  );
}

export default Register;
