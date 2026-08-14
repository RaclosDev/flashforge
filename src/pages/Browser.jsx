import { useState, useEffect } from 'react';
import { decksApi, notesApi } from '../services/api';

export default function Browser() {
  const [decks, setDecks] = useState([]);
  const [selectedDeckId, setSelectedDeckId] = useState('');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch decks on mount
  useEffect(() => {
    decksApi.getAll()
      .then(data => {
        setDecks(data);
        if (data.length > 0) {
          setSelectedDeckId(data[0].id);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Fetch notes when deck changes
  useEffect(() => {
    if (!selectedDeckId) return;
    setLoading(true);
    notesApi.getByDeck(selectedDeckId)
      .then(data => setNotes(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedDeckId]);

  const handleDelete = async (noteId) => {
    if (!window.confirm('¿Seguro que quieres borrar esta tarjeta?')) return;
    try {
      await notesApi.delete(noteId);
      setNotes(notes.filter(n => n.id !== noteId));
    } catch (err) {
      alert('Error al borrar la tarjeta');
    }
  };

  return (
    <div className="dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title">Explorador de Tarjetas</h1>
          <p className="page-subtitle">Gestiona y edita tus tarjetas</p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <label style={{ color: 'var(--text-muted)' }}>Mazo:</label>
        <select 
          className="glass-input" 
          value={selectedDeckId} 
          onChange={(e) => setSelectedDeckId(e.target.value)}
          style={{ width: '250px' }}
        >
          {decks.map(deck => (
            <option key={deck.id} value={deck.id}>{deck.name}</option>
          ))}
        </select>
      </div>

      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Cargando...</div>
        ) : notes.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No hay tarjetas en este mazo.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Anverso (Front)</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Reverso (Back)</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500, width: '100px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {notes.map(note => {
                  const fields = JSON.parse(note.fieldsJson || '{}');
                  return (
                    <tr key={note.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'var(--transition-fast)' }}>
                      <td style={{ padding: '1rem', color: 'var(--text-main)' }}>{fields.front || fields.Front || ''}</td>
                      <td style={{ padding: '1rem', color: 'var(--text-dim)' }}>{fields.back || fields.Back || ''}</td>
                      <td style={{ padding: '1rem' }}>
                        <button 
                          onClick={() => handleDelete(note.id)}
                          className="danger-btn"
                          style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                        >
                          Borrar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
