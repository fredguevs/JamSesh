import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../hooks/SessionContext.js';

const NavBar = () => {
  const navigate = useNavigate();
  const { session, logout } = useSession();
  const [showNav, setShowNav]  = useState(false);

  const handleToggleMenu = () => {
    setShowNav(!showNav);
  }

  const handleSearch = () => {
    navigate('/search');
  }

  const handleHome = () => {
    navigate('/');
  };

  const handleUserPage = () => {
    navigate(`/user/${session.username}`);
  };

  const handleLogin = () => {
    navigate('/login');
  };
  
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      <button onClick={handleToggleMenu}>
        {!showNav ? 'Menu': 'Close'}
      </button>
      {showNav && (
        <div className="Navigation">
        <button onClick={handleHome}>Feed</button>
        <button onClick={handleSearch}>Search</button>
        {session ? (
          <>
            <button onClick={handleUserPage}>Profile</button>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <button onClick={handleLogin}>Login</button>
          </>
        )}
      </div>
      )}
    </>
  );
};

export default NavBar;