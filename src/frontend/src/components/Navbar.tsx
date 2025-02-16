import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-green-600">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-white font-bold text-xl">
            ChainCycle
          </Link>
          <div className="flex space-x-4">
            <Link to="/" className="text-white hover:text-green-200">
              Marketplace
            </Link>
            <Link to="/profile" className="text-white hover:text-green-200">
              Profile
            </Link>
            <Link to="/dao" className="text-white hover:text-green-200">
              DAO
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
