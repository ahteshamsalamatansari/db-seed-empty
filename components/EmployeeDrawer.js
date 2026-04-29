import { getInitials, getAvatarColors, getDesig, getEmpTotal, getEmpEntries, getStreak } from '../lib/helpers';
import CalendarGrid from './CalendarGrid';
import ScoreEntryPanel from './ScoreEntryPanel';
import ScoreLog from './ScoreLog';

export default function EmployeeDrawer({ 
  emp, 
  scores, 
  designations, 
  onClose, 
  isViewMode, 
  onSaveScore,
  onDeleteScore,
  onEditScore,
  editingEntry,
  setEditingEntry
}) {
  if (!emp) return null;

  const total = getEmpTotal(scores, emp.id);
  const entries = getEmpEntries(scores, emp.id);
  const desig = getDesig(emp.name, designations);
  
  // Need to find index for avatar color
  const empIdx = 0; // In full app, we'd pass this or find it
  const [bg, fg] = getAvatarColors(empIdx);

  // Stats
  const empScores = scores.filter(s => s.member_id === emp.id);
  const pos = empScores.filter(s => s.score > 0).length;
  const neg = empScores.filter(s => s.score < 0).length;
  
  const scoreMap = {};
  empScores.forEach(e => scoreMap[e.date] = e);
  const streak = getStreak(scoreMap, new Date());

  return (
    <div className="emp-view active">
      <div className="emp-header">
        <button className="nav-btn" onClick={onClose} title="Back to Overview">←</button>
        <div className="emp-header-avatar" style={{ background: bg, color: fg }}>
          {getInitials(emp.name)}
        </div>
        <div className="emp-header-info">
          <div className="emp-header-name">{emp.name}</div>
          <div className="emp-header-meta">
            {desig} · {entries} entries logged
          </div>
        </div>
        <div className="emp-stats">
          <div className="stat-pill">
            <span className="sv" style={{ color: total > 0 ? 'var(--p1)' : total < 0 ? 'var(--n1)' : 'var(--text)' }}>
              {total > 0 ? '+' : ''}{total.toFixed(1)}
            </span>
            <span className="sl">NET SCORE</span>
          </div>
          <div className="stat-pill">
            <span className="sv" style={{ color: 'var(--p1)' }}>{pos}</span>
            <span className="sl">POSITIVE</span>
          </div>
          <div className="stat-pill">
            <span className="sv" style={{ color: 'var(--n1)' }}>{neg}</span>
            <span className="sl">NEGATIVE</span>
          </div>
          <div className="stat-pill">
            <span className="sv" style={{ color: 'var(--orange)' }}>{streak}</span>
            <span className="sl">DAY STREAK</span>
          </div>
        </div>
      </div>

      {!isViewMode && (
        <ScoreEntryPanel 
          emp={emp} 
          onSave={onSaveScore} 
          editingEntry={editingEntry}
          setEditingEntry={setEditingEntry}
        />
      )}

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <CalendarGrid emp={emp} scoreMap={scoreMap} />
      </div>

      <ScoreLog 
        emp={emp} 
        scores={empScores} 
        isViewMode={isViewMode} 
        onDelete={onDeleteScore}
        onEdit={onEditScore}
      />
    </div>
  );
}
