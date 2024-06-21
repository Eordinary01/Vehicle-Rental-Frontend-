'use client'
import React from 'react';

import { FaTimes } from 'react-icons/fa';

const Toast = ({ message, type, onClose }) => {
  return (
    <div className={`fixed top-4 left-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-4 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
      <span className="text-white">{message}</span>
      <button onClick={onClose} className="text-white">
        <FaTimes />
      </button>
    </div>
  );
};



export default Toast;
