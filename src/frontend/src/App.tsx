import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Marketplace from './pages/Marketplace';
import Profile from './pages/Profile';
import DAO from './pages/DAO';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Marketplace />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dao" element={<DAO />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
