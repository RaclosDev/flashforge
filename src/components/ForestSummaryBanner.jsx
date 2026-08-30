import React, { useState } from 'react';

function ForestSummaryBanner({ summary }) {
  const [closed, setClosed] = useState(false);

  if (closed) return null;
  if (!summary || (summary.matured.length === 0 && summary.harvested.length === 0 && summary.unlocksReached.length === 0)) {
    return null;
  }

  return (
    <div className="forest-summary-banner">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-main)' }}>Mientras no mirabas...</h3>
        <button className="glass-btn" onClick={() => setClosed(true)} style={{ padding: '0.2rem 0.5rem' }}>✕</button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-dim)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {summary.matured.map((m, idx) => (
          <li key={`mat-${idx}`}>
            {m.emoji} Tu <strong>{m.speciesId}</strong> ha madurado
          </li>
        ))}
        {summary.harvested.map((h, idx) => (
          <li key={`harv-${idx}`}>
            {h.emoji} Se recolectaron <strong>{h.quantity}</strong> de {h.speciesId}
          </li>
        ))}
        {summary.unlocksReached.map((u, idx) => (
          <li key={`unl-${idx}`}>
            🎉 Nuevo elemento desbloqueado: <strong>{u}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ForestSummaryBanner;
