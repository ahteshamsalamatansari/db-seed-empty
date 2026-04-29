import { useState, useEffect } from 'react';
import { getInitials, getAvatarColors, getEmpTotal, getEmpEntries } from '../lib/helpers';

export default function BatchUpdateOverlay({ isOpen, onClose, members, scores, onBatchSubmit }) {
  const [batchState, setBatchState] = useState({});
  const [batchDate, setBatchDate] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    if (isOpen) {
      const initialState = {};
      members.forEach(m => {
        initialState[m.id] = { score: null, reason: '' };
      });
      setBatchState(initialState);
      setBatchDate(new Date().toISOString().slice(0, 10));
    }
  }, [isOpen, members]);

  if (!isOpen) return null;

  const handleScoreSelect = (memberId, val) => {
    setBatchState(prev => ({
      ...prev,
      [memberId]: { ...prev[memberId], score: val === 'skip' ? null : val }
    }));
  };

  const handleReasonChange = (memberId, val) => {
    setBatchState(prev => ({
      ...prev,
      [memberId]: { ...prev[memberId], reason: val }
    }));
  };

  const stagedCount = Object.values(batchState).filter(s => s.score !== null).length;
  const skipCount = members.length - stagedCount;

  const handleSubmit = () => {
    // Validation
    let missingReason = null;
    for (const member of members) {
      const st = batchState[member.id];
      if (st.score !== null && st.score !== 0 && st.reason.trim().length < 5) {
        missingReason = member.name;
        break;
      }
    }
    
    if (missingReason) {
      alert(`Add a reason (min 5 chars) for ${missingReason}`);
      return;
    }

    const entriesToSave = [];
    members.forEach(member => {
      const st = batchState[member.id];
      if (st.score !== null) {
        entriesToSave.push({
          member_id: member.id,
          date: batchDate,
          score: st.score,
          reason: st.reason.trim() || (st.score === 0 ? 'Baseline - no notable event' : '')
        });
      }
    });

    onBatchSubmit(entriesToSave);
  };

  return (
    <div className="batch-overlay open">
      <div className="batch-panel">
        <div className="batch-header">
          <div>
            <div className="batch-title">
              <span style={{ fontSize: '24px' }}>⚡</span> BATCH UPDATE
            </div>
            <div className="batch-sub">Log scores for multiple members efficiently</div>
          </div>
          <div className="batch-controls">
            <input 
              type="date" 
              className="batch-date-input" 
              value={batchDate}
              onChange={(e) => setBatchDate(e.target.value)}
              max={new Date().toISOString().slice(0, 10)}
            />
            <div className="batch-counter">
              <span>{stagedCount}</span> STAGED &nbsp;·&nbsp; {skipCount} SKIPPED
            </div>
            <button className="batch-close-btn" onClick={onClose}>✕</button>
          </div>
        </div>
        
        <div className="batch-body" id="batchRows">
          {members.map((member, idx) => {
            const st = batchState[member.id] || { score: null, reason: '' };
            const total = getEmpTotal(scores, member.id);
            const entries = getEmpEntries(scores, member.id);
            const [bg, fg] = getAvatarColors(idx);
            const scoreColor = total > 0 ? 'var(--p1)' : total < 0 ? 'var(--n1)' : 'var(--text3)';
            const hasScore = st.score !== null;

            return (
              <div key={member.id} className={`batch-row ${hasScore ? 'has-score' : ''}`}>
                <div className="batch-avatar" style={{ background: bg, color: fg }}>{getInitials(member.name)}</div>
                <div>
                  <div className="batch-name">{member.name}</div>
                  <div className="batch-current" style={{ color: scoreColor }}>
                    Net: {total > 0 ? '+' : ''}{total.toFixed(1)} &nbsp;·&nbsp; {entries} entr{entries === 1 ? 'y' : 'ies'}
                  </div>
                </div>
                <div className="batch-score-group">
                  <button className={`batch-score-btn ${st.score === null ? 'selected' : ''}`} onClick={() => handleScoreSelect(member.id, 'skip')}>SKIP</button>
                  {[1, 0.5, 0, -0.5, -1].map(val => (
                    <button 
                      key={val}
                      className={`batch-score-btn ${st.score === val ? 'selected' : ''}`} 
                      onClick={() => handleScoreSelect(member.id, val)}
                    >
                      {val > 0 ? `+${val}` : val === 0.5 ? '+½' : val === -0.5 ? '-½' : val}
                    </button>
                  ))}
                </div>
                <input 
                  type="text" 
                  className="batch-reason" 
                  placeholder="Reason / evidence (required for non-zero)…"
                  disabled={!hasScore}
                  value={st.reason}
                  onChange={(e) => handleReasonChange(member.id, e.target.value)}
                />
              </div>
            );
          })}
        </div>
        
        <div className="batch-footer">
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--text3)' }}>
            STAGED: <span style={{ color: 'var(--text)' }}>{stagedCount}</span> &nbsp;/&nbsp; TOTAL: {members.length}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="submit-btn" style={{ background: 'var(--surface3)', color: 'var(--text)' }} onClick={() => setBatchState({})}>RESET ALL</button>
            <button className="submit-btn" disabled={stagedCount === 0} onClick={handleSubmit}>
              SUBMIT BATCH →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
