'use client';

import { useState } from 'react';
import ControlPanel from '@/components/ControlPanel';
import SceneViewer from '@/components/SceneViewer';

function Upload() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [furnitureInScene, setFurnitureInScene] = useState([]);
  const [roomConfig, setRoomConfig] = useState(null);

  const handleGenerate = async (file, config) => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    setRoomConfig(config);
    const formData = new FormData();
    formData.append('image', file);

    try {
      // We fetch from our Python server
      const response = await fetch('http://localhost:5001/api/process-image', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
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
    setFurnitureInScene((prev) => [
      ...prev,
      {
        ...furnitureItem,
        instanceId: Date.now(),
        position: [Math.random() * 2 - 1, 0, Math.random() * 2 - 1], // Place on the floor
      },
    ]);
  };

  return (
    <div>
      <main className="flex h-screen w-full bg-gray-100">
        <ControlPanel
          onGenerate={handleGenerate}
          onAddFurniture={handleAddFurniture}
          isLoading={isLoading}
          error={error}
          results={results}
        />
        <SceneViewer results={results} furnitureInScene={furnitureInScene} roomConfig={roomConfig} />
      </main>
    </div>
  );
}

export default Upload;