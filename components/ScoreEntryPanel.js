import { useState, useEffect } from 'react';

export default function ScoreEntryPanel({ emp, onSave, editingEntry, setEditingEntry }) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [score, setScore] = useState(null);
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (editingEntry) {
      setDate(editingEntry.date);
      setScore(editingEntry.score);
      setReason(editingEntry.reason || '');
    } else {
      setDate(new Date().toISOString().slice(0, 10));
      setScore(null);
      setReason('');
    }
  }, [editingEntry]);

  const handleSubmit = () => {
    if (score === null) return;
    onSave(emp.id, date, score, reason);
    setScore(null);
    setReason('');
    if (editingEntry) setEditingEntry(null);
  };

  return (
    <div className="score-panel">
      {editingEntry && (
        <div className="edit-banner active">
          Editing entry for {emp.name} on {editingEntry.date}
          <button onClick={() => setEditingEntry(null)} style={{marginLeft: '10px', background: 'transparent', color: '#fff', border: '1px solid #fff', borderRadius: '4px', padding: '2px 8px'}}>Cancel</button>
        </div>
      )}
      
      <div className="panel-title">LOG SCORE ENTRY</div>
      <div className="score-entry-row">
        <div className="entry-field">
          <label className="entry-label">DATE</label>
          <input 
            type="date" 
            className="entry-date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={new Date().toISOString().slice(0, 10)}
          />
        </div>
        
        <div className="entry-field">
          <label className="entry-label">IMPACT SCORE</label>
          <div className="score-btn-group">
            {[1, 0.5, 0, -0.5, -1].map(val => (
              <button 
                key={val}
                className={`score-btn ${score === val ? 'selected' : ''}`}
                data-score={val}
                onClick={() => setScore(val)}
              >
                {val > 0 ? `+${val}` : val === 0.5 ? '+½' : val === -0.5 ? '-½' : val}
              </button>
            ))}
          </div>
        </div>

        <div className="entry-field reason-input">
          <label className="entry-label">REASON / EVIDENCE (Required for non-zero)</label>
          <textarea 
            className="reason-textarea" 
            placeholder="Document what happened..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <button className="submit-btn" onClick={handleSubmit} disabled={score === null}>
          <span>{editingEntry ? 'UPDATE' : 'SUBMIT'}</span> →
        </button>
      </div>
      
      <div className="score-legend">
        <div className="legend-item"><div className="legend-dot bg-p1"></div> Exceptional (+1)</div>
        <div className="legend-item"><div className="legend-dot bg-p05"></div> Stretch (+0.5)</div>
        <div className="legend-item"><div className="legend-dot bg-zero"></div> Baseline (0)</div>
        <div className="legend-item"><div className="legend-dot bg-n05"></div> Process Miss (-0.5)</div>
        <div className="legend-item"><div className="legend-dot bg-n1"></div> Serious Breach (-1)</div>
      </div>
    </div>
  );
}
