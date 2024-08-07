import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SessionProvider } from './hooks/SessionContext.js';
import AppHeader from './components/Header.js';
import LoginForm from './components/Login.js';
import UserProfile from './pages/User.js';
import CreateAccount from './pages/CreateAccount.js';
import EditProfile from './pages/EditProfile.js';
import SearchPage from './pages/Search.js';
import PostPage from './pages/Post.js';
import AudioPage from './pages/Audio.js';
import HomePage from './pages/HomePage.js';

const App = () => {
  return (
    <Router>
      <SessionProvider>
        <AppHeader />
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/user/:username" element={<UserProfile />} />
          <Route path="/edit-profile/:username" element={<EditProfile />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path='/search' element={<SearchPage/>} />
          <Route path="/post/:username/:postid" element={<PostPage />} />
          <Route path="/audio/:username/:audioid" element={<AudioPage />} />
          {/* Add more routes as needed */}
        </Routes>
      </SessionProvider>
    </Router>
  );
};

export default App;
