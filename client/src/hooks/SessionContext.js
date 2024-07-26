import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SessionContext = createContext();

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/session', { withCredentials: true });
        if (response.status === 200) {
          setSession(response.data);
        }
      } catch (err) {
        console.error('Error fetching session:', err);
      }
    };

    fetchSession();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/v1/login', { username, password }, { withCredentials: true });
      if (response.status === 200) {
        setSession(response.data.user);
        navigate(`/user/${username}`);
      }
    } catch (err) {
      console.error('Error logging in:', err);
    }
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:5000/api/v1/logout', {}, { withCredentials: true });
      setSession(null); // Clear session in state
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  return (
    <SessionContext.Provider value={{ session, setSession, login, logout }}>
      {children}
    </SessionContext.Provider>
  );
};
