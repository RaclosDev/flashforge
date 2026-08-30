import React from 'react';

// Pseudo-random seeded deterministic position generator based on plant ID
// so plants stay in the same place every render
function getPlantPosition(id) {
  const seed = id * 12345;
  // X: 10% to 90%
  const x = 10 + (seed % 80);
  // Y: 20% to 80%
  const y = 20 + ((seed * 7) % 60);
  
  // Sort order is determined by Y to handle overlapping correctly
  const zIndex = Math.floor(y);
  
  return { left: `${x}%`, top: `${y}%`, zIndex };
}

function ForestScene({ plants }) {
  if (!plants || plants.length === 0) return null;

  return (
    <div className="forest-scene">
      {plants.map(plant => {
        const { left, top, zIndex } = getPlantPosition(plant.id);
        const isGrowing = plant.status === 'growing';

        return (
          <div 
            key={plant.id}
            className={`forest-plant ${plant.status}`}
            style={{ left, top, zIndex }}
            title={`${plant.speciesId} (${plant.status})`}
          >
            <span>{plant.emoji}</span>
            {isGrowing && (
              <div className="plant-progress-bar">
                <div 
                  className="plant-progress-fill" 
                  style={{ width: `${plant.progressPercent}%` }} 
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ForestScene;
