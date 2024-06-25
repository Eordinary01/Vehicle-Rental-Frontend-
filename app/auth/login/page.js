'use client'
import React, { useState } from 'react';
import API from '@/app/utils/api';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/authContext';
import Toast from '../../components/Toast';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await API.post('/auth/login', formData);
      const { token, role, emailVerified } = response.data;
      
      if (!token || !role) {
        console.error('Invalid response from the server:', response.data);
        setToastMessage('Error Logging In');
        setToastType('error');
        setShowToast(true);
        setLoading(false);
        return;
      }
      
      login(token, role);
      
      if (emailVerified) {
        router.push('/');
      } else {
        setToastMessage('Login Successful!');
        setToastType('success');
        setShowToast(true);
        setTimeout(() => {
          setToastMessage('Redirecting to home page...');
          setToastType('success');
          setShowToast(true);
          setTimeout(() => {
            router.push('/');
          }, 2000);
        }, 2000);
      }
    } catch (err) {
      console.error('Error during login:', err);
      if (err.response) {
        console.error('Server responded with:', err.response.data);
        setToastMessage(`Error Logging In: ${err.response.data.message || 'Unknown error'}`);
      } else {
        setToastMessage('Error Logging In: Network error');
      }
      setToastType('error');
      setShowToast(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center text-white">
      <h1 className="text-4xl font-bold mb-8 text-orange-500">Login</h1>
      <form onSubmit={handleSubmit} className="bg-gray-800 p-12 rounded-lg shadow-lg max-w-lg w-full">
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={formData.email}
          required
          className="w-full p-3 mb-6 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={formData.password}
          required
          className="w-full p-3 mb-6 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-400 text-white py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
        >
          {loading ? 'Logging In...' : 'Login'}
        </button>
      </form>
      {showToast && (
        <Toast message={toastMessage} type={toastType} onClose={() => setShowToast(false)} />
      )}
    </div>
  );
}

export default Login;
