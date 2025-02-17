import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Marketplace from './pages/Marketplace';
import Profile from './pages/Profile';
import DAO from './pages/DAO';
import MyItems from './pages/MyItems';
import MyBids from './pages/MyBids';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Marketplace />} />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route path="/my-items" element={<MyItems />} />
              <Route path="/my-bids" element={<MyBids />} />
              <Route 
                path="/dao" 
                element={
                  <ProtectedRoute>
                    <DAO />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
