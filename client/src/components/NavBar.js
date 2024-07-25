import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../hooks/SessionContext.js';


const NavBar = () => {
  const navigate = useNavigate();
  const { session } = useSession();

  const handleHome = () => {
    navigate('/');
  };

  const handleUserPage = () => {
    navigate(`/user/${session.username}`);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="Navigation">
      <div className="Search">
        <label>
          <input 
            type="text" 
            placeholder="Search"
          />
        </label>
      </div>
      <button onClick={handleHome}>Home</button>
      {session ? (
        <button onClick={handleUserPage}>Profile</button>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
};

export default NavBar;
