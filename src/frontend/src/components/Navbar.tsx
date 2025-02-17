import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, login, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-blue-700' : '';
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <Link
            to="/"
            className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/')}`}
          >
            Marketplace
          </Link>
          {isAuthenticated && (
            <>
              <Link
                to="/my-items"
                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/my-items')}`}
              >
                My Items
              </Link>
              <Link
                to="/my-bids"
                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/my-bids')}`}
              >
                My Bids
              </Link>
              <Link
                to="/dao"
                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/dao')}`}
              >
                DAO
              </Link>
            </>
          )}
        </div>
        <div>
          {isAuthenticated ? (
            <button
              onClick={() => logout()}
              className="px-3 py-2 rounded-md text-sm font-medium bg-red-500 hover:bg-red-600"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => login()}
              className="px-3 py-2 rounded-md text-sm font-medium bg-green-500 hover:bg-green-600"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
