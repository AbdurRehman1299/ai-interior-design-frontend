'use client';

import { useState } from 'react';
import { Ruler } from 'lucide-react';

export default function RoomConfiguration({ onComplete, selectedFile }) {
  const [config, setConfig] = useState({
    width: 5,  // meters
    depth: 4,  // meters
    height: 3, // meters
    targetWall: 'front' // which wall the photo represents
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete(config);
  };

  const wallOptions = [
    { value: 'front', label: 'Front Wall' },
    { value: 'back', label: 'Back Wall' },
    { value: 'left', label: 'Left Wall' },
    { value: 'right', label: 'Right Wall' }
  ];

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-center mb-3">
        <Ruler className="w-5 h-5 mr-2 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">Room Dimensions</h3>
      </div>
      
      {selectedFile && (
        <p className="text-sm text-gray-600 mb-4">
          Configure the room dimensions for: <span className="font-medium">{selectedFile.name}</span>
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Width (m)
            </label>
            <input
              type="number"
              min="2"
              max="20"
              step="0.5"
              value={config.width}
              onChange={(e) => setConfig({ ...config, width: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Depth (m)
            </label>
            <input
              type="number"
              min="2"
              max="20"
              step="0.5"
              value={config.depth}
              onChange={(e) => setConfig({ ...config, depth: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Height (m)
            </label>
            <input
              type="number"
              min="2"
              max="6"
              step="0.1"
              value={config.height}
              onChange={(e) => setConfig({ ...config, height: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Which wall does this photo show?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {wallOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setConfig({ ...config, targetWall: option.value })}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  config.targetWall === option.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Continue to Generate 3D Room
        </button>
      </form>
    </div>
  );
}
