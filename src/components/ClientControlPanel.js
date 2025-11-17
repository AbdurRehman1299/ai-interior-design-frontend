'use client';

import { useState } from 'react';
import ControlPanel from '@/components/ControlPanel';
import dynamic from 'next/dynamic';
import { furniture as allFurniture } from '@/app/data/furnitureData';

const SceneViewer = dynamic(
  () => import('@/components/SceneViewer'),
  { 
    ssr: false,
    loading: () => <p>Loading 3D viewer...</p>
  }
);

function Upload() {
  const [isLoading, setIsLoading] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [furnitureInScene, setFurnitureInScene] = useState([]);
  const [roomConfig, setRoomConfig] = useState(null);
  const [selectedFurnitureInstanceId, setSelectedFurnitureInstanceId] = useState(null);
  const [transformMode, setTransformMode] = useState('translate');

  const BACKEND_URL = "https://abdurrehman1288-interior-backend.hf.space";

  const handleGenerate = async (file, config) => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    setFurnitureInScene([]);
    setSelectedFurnitureInstanceId(null);
    setTransformMode('translate');

    console.log("Setting new roomConfig:", config);
    setRoomConfig(config);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(BACKEND_URL + "/api/process-image", {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Server error: ${response.statusText} - ${errText}`);
      }
      const data = await response.json();
      console.log('Received results from backend:', data);
      setResults(data);
    } catch (err) {
      console.error('Error processing image:', err);
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFurniture = (furnitureItem) => {
    console.log("Attempting to add furniture:", furnitureItem.id);

    if (!roomConfig) {
      console.error("ADD FAILED: roomConfig is null. Please upload an image and generate the room first.");
      return; 
    }
    
    console.log("Room config is valid. Proceeding to add furniture.");

    const padding = 0.9;
    const x = (Math.random() - 0.5) * (roomConfig.width * padding);
    const z = (Math.random() - 0.5) * (roomConfig.depth * padding);

    const newFurniture = {
      ...furnitureItem,
      instanceId: Date.now(),
      position: [x, 0, z],
      scale: 1,
    };
    
    setFurnitureInScene((prev) => [...prev, newFurniture]);
    setSelectedFurnitureInstanceId(newFurniture.instanceId);
  };
  
  const handleGenerateWithAI = async (prompt) => {
    if (!roomConfig) {
      console.error("AI Generation FAILED: roomConfig is null.");
      setError("Please generate the 3D room first!");
      return;
    }

    setIsAiGenerating(true);
    setError(null);
    
    const availableItems = allFurniture.map(item => ({
      id: item.id,
      name: item.name,
      tags: item.tags
    }));

    try {
      const response = await fetch(BACKEND_URL + "/api/generate-room-ai", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt,
          availableItems: availableItems
        })
      });

      if (!response.ok) {
         const errData = await response.json();
         throw new Error(errData.error || "AI backend request failed.");
      }

      const data = await response.json();
      const itemIdsToadd = data.furniture_ids;

      const newFurnitureArray = itemIdsToadd.map(id => {
        const item = allFurniture.find(f => f.id === id);
        if (!item) return null;

        const padding = 0.9;
        const x = (Math.random() - 0.5) * (roomConfig.width * padding);
        const z = (Math.random() - 0.5) * (roomConfig.depth * padding);
        
        return {
          ...item,
          instanceId: Date.now() + Math.random(),
          position: [x, 0, z],
          scale: 1,
        };
      }).filter(Boolean);

      if (newFurnitureArray.length > 0) {
        setFurnitureInScene(newFurnitureArray);
      } else {
        setError("AI couldn't find matching items for that prompt.");
      }

    } catch (err) {
      console.error("Error generating with AI:", err);
      setError(err.message || "An error occurred with the AI generator.");
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleUpdateFurniturePosition = (instanceId, newPosition) => {
    setFurnitureInScene((prev) =>
      prev.map((item) =>
        item.instanceId === instanceId
          ? { ...item, position: [newPosition.x, newPosition.y, newPosition.z] }
          : item
      )
    );
  };

  const handleUpdateFurnitureScale = (instanceId, newScale) => {
    setFurnitureInScene((prev) =>
      prev.map((item) =>
        item.instanceId === instanceId
          ? { ...item, scale: newScale }
          : item
      )
    );
  };

  return (
    <div>
      <main className="flex flex-col lg:flex-row w-full min-h-screen bg-gray-100">
        
        <ControlPanel
          onGenerate={handleGenerate}
          onAddFurniture={handleAddFurniture}
          isLoading={isLoading}
          error={error}
          results={results}
          roomConfig={roomConfig}
          transformMode={transformMode}
          setTransformMode={setTransformMode}
          onGenerateWithAI={handleGenerateWithAI}
          isAiGenerating={isAiGenerating}
        />
        
        <SceneViewer 
          results={results} 
          furnitureInScene={furnitureInScene} 
          roomConfig={roomConfig}
          selectedFurnitureInstanceId={selectedFurnitureInstanceId}
          onSelectFurniture={setSelectedFurnitureInstanceId}
          onUpdateFurniturePosition={handleUpdateFurniturePosition}
          transformMode={transformMode}
          onUpdateFurnitureScale={handleUpdateFurnitureScale}
        />
      </main>
    </div>
  );
}

export default Upload;