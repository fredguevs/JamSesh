import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SessionProvider } from './hooks/SessionContext.js';
import AppHeader from './components/Header.js';
import LoginForm from './components/Login.js';
import UserProfile from './pages/User.js';
import CreateAccount from './pages/CreateAccount.js';

const App = () => {
  return (
    <SessionProvider>
      <Router>
        <AppHeader />
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/user/:username" element={<UserProfile />} />
          <Route path="/create-account" element={<CreateAccount />} />
          {/* Add more routes as needed */}
        </Routes>
      </Router>
    </SessionProvider>
  );
};

export default App;
