import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const SessionContext = createContext();

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);

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

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
};
