import React from 'react';

const Login = () => {
  const handleLogin = () => {
    window.location.href = 'http://localhost:5000/api/v1/auth/login';
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleLogin}>Login with Auth0</button>
    </div>
  );
};

export default Login;
