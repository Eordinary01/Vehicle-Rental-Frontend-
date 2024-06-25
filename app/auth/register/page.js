'use client'
import React, { useState, useEffect } from 'react';
import API from '@/app/utils/api';
import { useRouter } from 'next/navigation';
import Toast from '@/app/components/Toast';
import { useAuth } from '@/app/context/authContext';

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [userId, setUserId] = useState('');

  const { login } = useAuth();

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

  const handleVerificationCodeChange = (e) => {
    setVerificationCode(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const registerResponse = await API.post('/auth/register', formData);
      if (registerResponse.status === 201) {
        setUserId(registerResponse.data.userId); // Make sure this is correctly set
        console.log('User ID after registration:', registerResponse.data.userId); // Debug log
        setShowVerification(true);
        setToastMessage('Registration Successful! Please check your email for the verification code.');
        setShowToast(true);
      } else {
        setToastMessage('Unexpected error during registration');
        setShowToast(true);
      }
    } catch (err) {
      console.error('Error during registration:', err);
      setToastMessage('Error Registering User: ' + (err.response?.data?.message || 'Unknown error'));
      setShowToast(true);
    }
    setLoading(false);
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log('Submitting verification:', { userId, verificationCode }); // Debug log
      const response = await API.post('/auth/verify-email', { userId, verificationCode });
      if (response.status === 200) {
        const { token, role } = response.data;
        login(token, role);
        setToastMessage('Verification Successful! Redirecting to home page...');
        setShowToast(true);
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
    } catch (err) {
      console.error('Error during verification:', err);
      if (err.response) {
        setToastMessage(`Error Verifying Code: ${err.response.data.message || 'Invalid verification code'}`);
      } else if (err.request) {
        setToastMessage('Error Verifying Code: No response from server');
      } else {
        setToastMessage('Error Verifying Code: ' + err.message);
      }
      setShowToast(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center text-white">
      <h1 className="text-4xl font-bold mb-8 text-orange-500">Register</h1>
      {!showVerification ? (
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
      ) : (
        <form onSubmit={handleVerificationSubmit} className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-lg w-full">
          <input
            type="text"
            name="verificationCode"
            placeholder="Verification Code"
            onChange={handleVerificationCodeChange}
            value={verificationCode}
            required
            className="w-full p-2 mb-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-400 text-white py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
      )}
      {showToast && (
        <Toast message={toastMessage} type="error" onClose={() => setShowToast(false)} />
      )}
    </div>
  );
}

export default Register;
