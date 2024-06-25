// components/VerifyEmail.js
'use client'
import React, { useState } from 'react';
import { useAuth } from '../context/authContext';

const VerifyEmail = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const { user, verifyEmail } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await verifyEmail(user.id, verificationCode);
  };

  return (
    <div>
      <h2>Verify your Email</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          placeholder="Enter verification code"
        />
        <button type="submit">Verify</button>
      </form>
    </div>
  );
};

export default VerifyEmail;