import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Protected from './components/Protected';
import Logout from './components/Logout';
import CreateAccount from './components/CreateAccount';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/protected" element={<Protected />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/create-account" element={<CreateAccount />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
