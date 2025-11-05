'use client';

import { useState, useMemo } from 'react';
import { Upload, Wand2, Sofa } from 'lucide-react';
import { furniture as allFurniture } from '@/app/data/furnitureData';
import RoomConfiguration from './RoomConfiguration';

// A simple helper function to simulate color matching
function isColorSimilar(roomColor, tag) {
    const r = parseInt(roomColor.slice(1, 3), 16);
    if (tag.includes('grey') && r > 100) return true;
    if (tag.includes('brown') && r > 100) return true;
    return false;
}

export default function ControlPanel({ onGenerate, onAddFurniture, isLoading, error, results }) {
  const [aiRecommendations, setAiRecommendations] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showRoomConfig, setShowRoomConfig] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setShowRoomConfig(true);
    }
  };

  const handleRoomConfigComplete = (config) => {
    if (selectedFile) {
      onGenerate(selectedFile, config);
      setShowRoomConfig(false);
    }
  };

  const displayedFurniture = useMemo(() => {
    if (aiRecommendations && results?.colors) {
      const recommended = allFurniture.filter(item =>
        item.tags.some(tag =>
          results.colors.some(roomColor => isColorSimilar(roomColor, tag))
        )
      );
      return recommended.length > 0 ? recommended : allFurniture;
    }
    return allFurniture;
  }, [aiRecommendations, results]);

  return (
    <div className="w-1/3 h-screen bg-white p-6 shadow-lg overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">AI Interior Designer</h1>
        <p className="text-gray-500">Create your dream room in seconds</p>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">1. Upload Photo</h2>
        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-2 text-gray-500" />
            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span></p>
          </div>
          <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
        </label>
        {selectedFile && <p className="text-sm text-center text-gray-600 mt-2">Selected: {selectedFile.name}</p>}
      </div>
      
      {showRoomConfig && selectedFile && (
        <RoomConfiguration 
          onComplete={handleRoomConfigComplete}
          selectedFile={selectedFile}
        />
      )}
      
      {isLoading && (
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center">
            <Wand2 className="mr-2 animate-spin" />
            <span className="text-lg font-medium text-gray-700">Generating 3D Room...</span>
          </div>
        </div>
      )}
      {error && <div className="text-red-500 bg-red-100 p-3 rounded-lg my-4">Error: {error}</div>}
      <hr className="my-8" />
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">2. Add Furniture</h2>
          <div className="flex items-center">
            <label htmlFor="ai-toggle" className="text-sm font-medium text-gray-900 mr-3">AI Suggestions</label>
            <button onClick={() => setAiRecommendations(!aiRecommendations)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${aiRecommendations ? 'bg-green-600' : 'bg-gray-300'}`}>
              <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${aiRecommendations ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
        <div className="space-y-3">
          {displayedFurniture.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
              <div className="flex items-center">
                <Sofa className="w-8 h-8 text-gray-600 mr-4" />
                <span className="font-medium">{item.name}</span>
              </div>
              <button onClick={() => onAddFurniture(item)} className="text-green-600 font-semibold hover:text-green-800">Add</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
