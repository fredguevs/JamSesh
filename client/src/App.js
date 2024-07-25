import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SessionProvider } from './hooks/SessionContext.js';
import AppHeader from './components/Header.js';
import LoginForm from './components/Login.js';
import UserProfile from './pages/User.js';

const App = () => {
  return (
    <SessionProvider>
      <Router>
        <AppHeader />
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/user/:username" element={<UserProfile />} />
          {/* Add more routes as needed */}
        </Routes>
      </Router>
    </SessionProvider>
  );
};

export default App;
