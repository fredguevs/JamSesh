import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const CreateAccount = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = new URLSearchParams(location.search).get('email');
  const [username, setUsername] = useState('');
  const [fullname, setFullname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/v1/users/create-account', {
        email,
        username,
        fullname,
        password
      });
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('idToken', response.data.idToken);
      navigate('/protected');
    } catch (err) {
      setError(err.response.data.error);
    }
  };

  return (
    <div>
      <h1>Create Account</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} readOnly />
        </div>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label>Full Name:</label>
          <input type="text" value={fullname} onChange={(e) => setFullname(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p>{error}</p>}
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
};

export default CreateAccount;
