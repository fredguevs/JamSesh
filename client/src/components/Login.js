import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../hooks/SessionContext.js';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setSession } = useSession();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/v1/users/login', {
        username,
        password,
      }, { withCredentials: true });
      if (response.status === 200) {
        setSession(response.data.username);
        navigate(`/user/${username}`);
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
    </>
  );
};

export default Login;
