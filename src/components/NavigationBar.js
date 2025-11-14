"use client";

import React, { useState } from 'react';
import { XIcon, MenuIcon } from 'lucide-react';

function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm fixed w-full z-50 top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Room<span className="text-green-600">Dev</span>
            </h1>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <a href="#" className="text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium">Home</a>
            <a href="#features" className="text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium">Features</a>
            <a href="#testimonials" className="text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium">Testimonials</a>
            <a href="/upload" className="text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium">Design</a>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <XIcon className="block h-6 w-6" />
              ) : (
                <MenuIcon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu (collapsible) */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a href="#" className="text-gray-600 hover:bg-gray-50 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium">Home</a>
          <a href="#features" className="text-gray-600 hover:bg-gray-50 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium">Features</a>
          <a href="#testimonials" className="text-gray-600 hover:bg-gray-50 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium">Testimonials</a>
          <a href="/upload" className="text-gray-600 hover:bg-gray-50 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium">Design Your Room</a>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;