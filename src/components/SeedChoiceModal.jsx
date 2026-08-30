import React from 'react';
import useForestStore from '../store/useForestStore';

function SeedChoiceModal({ onClose }) {
  const { availableSpecies, plantSeed } = useForestStore();
  const [planting, setPlanting] = React.useState(false);

  const handlePlant = async (speciesId) => {
    if (planting) return;
    setPlanting(true);
    try {
      await plantSeed(speciesId);
      onClose();
    } catch (e) {
      console.error(e);
      setPlanting(false);
    }
  };

  // Only show species that are unlocked
  const unlockedOptions = availableSpecies.filter(s => s.unlocked);

  return (
    <div className="seed-modal-overlay">
      <div className="seed-modal">
        <h2 style={{ color: 'var(--text-main)', textAlign: 'center', margin: '0 0 1rem 0' }}>
          🌱 ¿Qué te apetece plantar?
        </h2>
        <p style={{ color: 'var(--text-dim)', textAlign: 'center' }}>
          Elige una semilla. Crecerá pasivamente mientras estudias.
        </p>

        <div className="seed-options">
          {unlockedOptions.map(s => (
            <div 
              key={s.id} 
              className="seed-card"
              onClick={() => handlePlant(s.id)}
            >
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{s.emoji}</div>
              <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{s.name}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <button className="glass-btn" onClick={onClose} disabled={planting}>
            Ahora no, más tarde
          </button>
        </div>
      </div>
    </div>
  );
}

export default SeedChoiceModal;
