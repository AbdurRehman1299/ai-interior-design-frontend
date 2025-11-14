import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h1 className="text-2xl font-bold text-white">
              Room<span className="text-green-600">Dev</span>
            </h1>
            <p className="mt-2 text-sm">Your Personal AI Interior Designer</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-green-500">About</a>
            <a href="#" className="hover:text-green-500">Privacy</a>
            <a href="#" className="hover:text-green-500">Terms</a>
            <a href="#" className="hover:text-green-500">Contact</a>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm">
          <p>&copy; 2025 RoomDev. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;