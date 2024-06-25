'use client'
import React, { useState } from 'react';
import Register from '../auth/register/page';

function ParentComponent() {
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  return (
    <div>
      <Register 
        setToastMessage={setToastMessage} 
        setShowToast={setShowToast} 
        showToast={showToast}
      />
      {showToast && (
        <div>
          <p>{toastMessage}</p>
          <button onClick={() => setShowToast(false)}>Close</button>
        </div>
      )}
    </div>
  );
}

export default ParentComponent;