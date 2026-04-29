import { getScoreClass } from '../lib/helpers';

export default function ScoreLog({ emp, scores, isViewMode, onDelete, onEdit }) {
  const sortedScores = [...scores].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="log-section">
      <div className="log-title">SCORE LOG ({sortedScores.length})</div>
      <div className="log-list">
        {sortedScores.length === 0 ? (
          <div className="log-empty">NO ENTRIES RECORDED FOR THIS MEMBER</div>
        ) : (
          sortedScores.map(entry => (
            <div key={entry.id} className="log-item">
              <div className="log-date">{entry.date}</div>
              <div className={`log-score-badge ${getScoreClass(entry.score)}`}>
                {entry.score > 0 ? `+${entry.score}` : entry.score}
              </div>
              <div className="log-reason" title={entry.reason}>
                {entry.reason || 'No reason provided'}
              </div>
              {!isViewMode ? (
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button className="log-delete" onClick={() => onEdit(entry)} title="Edit entry" style={{ color: 'var(--blue)' }}>✏</button>
                  <button className="log-delete" onClick={() => onDelete(entry.id)} title="Delete entry">✕</button>
                </div>
              ) : <div></div>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
