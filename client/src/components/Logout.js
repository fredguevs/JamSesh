import React, { useEffect } from 'react';

const Logout = () => {
  useEffect(() => {
    // Clear the tokens from local storage or any other storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('idToken');

    // Redirect the user to the Auth0 logout endpoint
    const auth0Domain = 'dev-tihwrzh4huci7lzd.us.auth0.com'; // Replace with your Auth0 domain
    const clientId = 'hlduUNSpo643IX8B9zXNwIr1sg6C19LG'; // Replace with your Auth0 client ID
    const returnTo = 'http://localhost:3000'; // Change this to your application's home URL

    window.location.href = `https://${auth0Domain}/v2/logout?client_id=${clientId}&returnTo=${returnTo}`;
  }, []);

  return (
    <div>
      <h1>Logging out...</h1>
    </div>
  );
};

export default Logout;
