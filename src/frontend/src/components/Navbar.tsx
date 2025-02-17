import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, login, logout, isInitialized } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-green-600' : '';
  };

  return (
    <nav className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-green-400 text-xl font-bold">ChainCycle</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 ${isActive('/')}`}
            >
              Home
            </Link>
            <Link
              to="/marketplace"
              className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 ${isActive('/marketplace')}`}
            >
              Marketplace
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/my-items"
                  className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 ${isActive('/my-items')}`}
                >
                  My Items
                </Link>
                <Link
                  to="/my-bids"
                  className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 ${isActive('/my-bids')}`}
                >
                  My Bids
                </Link>
                <Link
                  to="/dao"
                  className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 ${isActive('/dao')}`}
                >
                  DAO
                </Link>
              </>
            )}
          </div>

          {/* Authentication Button */}
          <div className="hidden md:block">
            {isInitialized ? (
              isAuthenticated ? (
                <button
                  onClick={logout}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Disconnect Wallet
                </button>
              ) : (
                <button
                  onClick={login}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Connect Wallet
                </button>
              )
            ) : (
              <button
                disabled
                className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed"
              >
                Initializing...
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger Icon */}
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Close Icon */}
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-gray-800`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 ${isActive('/')}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/marketplace"
            className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 ${isActive('/marketplace')}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Marketplace
          </Link>
          {isAuthenticated && (
            <>
              <Link
                to="/my-items"
                className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 ${isActive('/my-items')}`}
                onClick={() => setIsMenuOpen(false)}
              >
                My Items
              </Link>
              <Link
                to="/my-bids"
                className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 ${isActive('/my-bids')}`}
                onClick={() => setIsMenuOpen(false)}
              >
                My Bids
              </Link>
              <Link
                to="/dao"
                className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 ${isActive('/dao')}`}
                onClick={() => setIsMenuOpen(false)}
              >
                DAO
              </Link>
            </>
          )}
          <div className="mt-4">
            {isInitialized ? (
              isAuthenticated ? (
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-center rounded-md text-sm font-medium bg-red-500 hover:bg-red-600 transition-colors"
                >
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={() => {
                    login();
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-center rounded-md text-sm font-medium bg-green-500 hover:bg-green-600 transition-colors"
                >
                  Connect Wallet
                </button>
              )
            ) : (
              <button
                disabled
                className="w-full px-4 py-2 text-center rounded-md text-sm font-medium bg-gray-400 cursor-not-allowed"
              >
                Initializing...
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
