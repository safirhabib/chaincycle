import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { isAuthenticated, login, logout } = useAuth();

  return (
    <nav className="bg-green-600">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-white font-bold text-xl">
            ChainCycle
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-white hover:text-green-200">
              Marketplace
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="text-white hover:text-green-200">
                  Profile
                </Link>
                <Link to="/dao" className="text-white hover:text-green-200">
                  DAO
                </Link>
                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={login}
                className="bg-white hover:bg-green-100 text-green-600 font-bold py-2 px-4 rounded"
              >
                Login with Internet Identity
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
