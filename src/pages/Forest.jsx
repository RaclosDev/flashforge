import React, { useEffect, useState } from 'react';
import useForestStore from '../store/useForestStore';
import useStore from '../store/useStore';
import useAuthStore from '../store/useAuthStore';
import ForestScene from '../components/ForestScene';
import ForestSummaryBanner from '../components/ForestSummaryBanner';
import SeedChoiceModal from '../components/SeedChoiceModal';
import './Forest.css';

function Forest() {
  const { forest, loading, error, fetchForest, fetchAvailableSpecies } = useForestStore();
  const { user } = useAuthStore();
  const [showSeedModal, setShowSeedModal] = useState(false);

  useEffect(() => {
    if (user) {
      fetchForest();
      fetchAvailableSpecies();
    }
  }, [user, fetchForest, fetchAvailableSpecies]);

  if (error) {
    return (
      <div className="forest-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px', color: 'var(--danger-color)' }}>
        <div>Error al cargar el bosque: {error}</div>
      </div>
    );
  }

  if (loading || !forest) {
    return (
      <div className="forest-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <div style={{ color: 'var(--text-dim)' }}>Cargando bosque... <span className="spinner-sm" style={{marginLeft: '10px'}} /></div>
      </div>
    );
  }

  const handlePlantClick = () => {
    setShowSeedModal(true);
  };

  return (
    <div className="forest-container">
      <div className="forest-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h1 style={{ margin: 0, fontSize: '1.8rem' }}>🌲 Mi Bosque</h1>
          <span style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
            {forest.unlocks?.length || 0} hitos alcanzados
          </span>
        </div>
        <div className="light-points">
          <span style={{ fontSize: '1.2rem' }}>✨</span>
          <strong>{forest.lightPoints}</strong>
        </div>
      </div>

      {forest.summary && (
        <ForestSummaryBanner summary={forest.summary} />
      )}

      <div className="forest-scene-wrapper">
        <ForestScene plants={forest.plants} />
      </div>

      {forest.pendingSeeds > 0 && (
        <div className="plant-seed-banner">
          <span>🌱 Tienes {forest.pendingSeeds} semilla{forest.pendingSeeds > 1 ? 's' : ''} nueva{forest.pendingSeeds > 1 ? 's' : ''}</span>
          <button className="primary-btn" onClick={handlePlantClick}>Elegir qué plantar</button>
        </div>
      )}

      {showSeedModal && (
        <SeedChoiceModal onClose={() => setShowSeedModal(false)} />
      )}
    </div>
  );
}

export default Forest;
