import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutSuccess = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div>
      <h1>You have been logged out successfully.</h1>
      <button onClick={handleLoginRedirect}>Login Again</button>
    </div>
  );
};

export default LogoutSuccess;
