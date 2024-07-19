import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Protected = () => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    if (!accessToken) {
      navigate('/');
    }
  }, [accessToken, navigate]);

  const handleLogout = () => {
    navigate('/logout');
  };

  if (!accessToken) {
    return null; // or a loading indicator while checking for the token
  }

  return (
    <div>
      <h1>Protected Content</h1>
      <p>This content is only accessible with a valid access token.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Protected;
