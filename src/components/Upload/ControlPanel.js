'use client';

import { useState, useMemo } from 'react';
import { Upload, Wand2, Sofa, Move, Scale, Sparkles } from 'lucide-react';
import { furniture as allFurniture } from '@/app/data/furnitureData';
import RoomConfiguration from './RoomConfiguration';

function isColorSimilar(roomColor, tag) {
    if (!roomColor || !tag) return false;
    if (roomColor.length < 7) return false; 
    
    try {
      const r = parseInt(roomColor.slice(1, 3), 16);
      if (tag.includes('grey') && r > 100) return true;
      if (tag.includes('brown') && r > 100) return true;
    } catch (e) {
      console.error("Error parsing color:", roomColor, e);
      return false;
    }
    return false;
}

function ControlPanel({ 
  onGenerate, 
  onAddFurniture, 
  isLoading, 
  error, 
  results, 
  roomConfig,
  transformMode,
  setTransformMode,
  onGenerateWithAI,
  isAiGenerating
}) {
  const [aiRecommendations, setAiRecommendations] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showRoomConfig, setShowRoomConfig] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');


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
    <div className="w-full h-auto lg:w-1/3 lg:h-screen bg-white p-4 md:p-6 shadow-lg lg:overflow-y-auto">
      
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">AI Interior Designer</h1>
        <p className="text-gray-500">Create your dream room in seconds</p>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">1. Upload Photo</h2>
        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-2 text-gray-500" />
            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span></p>
          </div>
          <input 
            id="dropzone-file" 
            type="file" 
            className="hidden" 
            onChange={handleFileChange} 
            accept="image/*" 
          />
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
      {isAiGenerating && (
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center">
            <Sparkles className="mr-2 animate-spin text-green-600" />
            <span className="text-lg font-medium text-green-700">AI is generating your room...</span>
          </div>
        </div>
      )}
      {error && <div className="text-red-500 bg-red-100 p-3 rounded-lg my-4">Error: {error}</div>}

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">3. AI Room Generator</h2>
        <p className="text-sm text-gray-500 mb-2">Describe your room and let AI build it. (e.g., &quot;A modern living room with a grey sofa and a plant&quot;)</p>
        <textarea
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          placeholder="Enter your thoughts here..."
          className="w-full p-2 border border-gray-300 rounded-md min-h-20 focus:ring-2 focus:ring-green-500"
          disabled={!roomConfig}
        />
        <button
          onClick={() => onGenerateWithAI(aiPrompt)}
          disabled={!roomConfig || isAiGenerating || isLoading}
          className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
        >
          <Sparkles className="w-4 h-4" />
          {isAiGenerating ? "Generating..." : "Generate with AI"}
        </button>
      </div>
      
      <hr className="my-6 lg:my-8" />

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">4. Tools</h2>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setTransformMode('translate')}
            disabled={!roomConfig}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:bg-gray-100 disabled:text-gray-400 ${
              transformMode === 'translate'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Move className="w-4 h-4" />
            Move
          </button>
          <button
            onClick={() => setTransformMode('scale')}
            disabled={!roomConfig}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:bg-gray-100 disabled:text-gray-400 ${
              transformMode === 'scale'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Scale className="w-4 h-4" />
            Resize
          </button>
        </div>
      </div>

      <hr className="my-6 lg:my-8" />

      <div>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4 sm:gap-0">
          <h2 className="text-xl font-semibold text-gray-700">5. Add Furniture</h2>
          <div className="flex items-center">
            <label htmlFor="ai-toggle" className="text-sm font-medium text-gray-900 mr-3">AI Suggestions</label>
            <button 
              id="ai-toggle"
              onClick={() => setAiRecommendations(!aiRecommendations)} 
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${aiRecommendations ? 'bg-green-600' : 'bg-gray-300'}`}
            >
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
              <button 
                onClick={() => onAddFurniture(item)} 
                disabled={!roomConfig} 
                className="text-green-600 font-semibold hover:text-green-800 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ControlPanel;