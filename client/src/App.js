import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SessionProvider } from './hooks/SessionContext.js';
import AppHeader from './components/Header.js';
import LoginForm from './components/Login.js';
import UserProfile from './pages/User.js';
import CreateAccount from './pages/CreateAccount.js';
import EditProfile from './pages/EditProfile.js';
import SearchPage from './pages/Search.js';

const App = () => {
  return (
    <Router>
      <SessionProvider>
        <AppHeader />
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/user/:username" element={<UserProfile />} />
          <Route path="/edit-profile/:username" element={<EditProfile />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path='/search' element={<SearchPage/>} />
          {/* Add more routes as needed */}
        </Routes>
      </SessionProvider>
    </Router>
  );
};

export default App;
