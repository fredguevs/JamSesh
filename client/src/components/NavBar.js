import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../hooks/SessionContext.js';
import '../styles/NavBar.css';

const NavBar = () => {
  const navigate = useNavigate();
  const { session, logout } = useSession();
  const [showNav, setShowNav] = useState(false);

  const handleToggleMenu = () => {
    setShowNav(!showNav);
  };

  const handleSearch = () => {
    navigate('/search');
  };

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
    <div className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={handleHome}>JamSesh</div>
        <button className="navbar-toggle" onClick={handleToggleMenu}>
          {!showNav ? 'Menu': 'Close'}
        </button>
        <div className={`navbar-menu ${showNav ? 'active' : ''}`}>
          <button onClick={handleHome}>Home</button>
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
      </div>
    </div>
  );
};

export default NavBar;
