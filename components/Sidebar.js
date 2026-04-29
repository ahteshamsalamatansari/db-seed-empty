import { getInitials, getAvatarColors, getDesig, getEmpTotal, getEmpEntries } from '../lib/helpers';

export default function Sidebar({ 
  members, 
  scores, 
  currentEmp, 
  onSelectEmp, 
  searchQuery, 
  setSearchQuery, 
  isViewMode, 
  onRemoveMember,
  designations
}) {
  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="sidebar">
      <div className="sidebar-search">
        <div className="search-wrapper">
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search employee..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="sidebar-label">TEAM ROSTER ({filteredMembers.length})</div>
      
      <div className="employee-list">
        {filteredMembers.map((member, idx) => {
          const total = getEmpTotal(scores, member.id);
          const entries = getEmpEntries(scores, member.id);
          const desig = getDesig(member.name, designations);
          const [bg, fg] = getAvatarColors(idx);
          const isActive = currentEmp?.id === member.id;
          
          const scoreColor = total > 0 ? 'var(--p1)' : total < 0 ? 'var(--n1)' : 'var(--text3)';
          const bgBadge = total > 0 ? 'color-mix(in srgb,var(--p1) 15%,transparent)' : 
                          total < 0 ? 'color-mix(in srgb,var(--n1) 15%,transparent)' : 'var(--surface2)';

          return (
            <div 
              key={member.id} 
              className={`emp-item ${isActive ? 'active' : ''}`}
              onClick={() => onSelectEmp(member)}
            >
              <div className="emp-avatar" style={{ background: bg, color: fg }}>
                {getInitials(member.name)}
              </div>
              <div className="emp-info">
                <div className="emp-name">{member.name}</div>
                <div className="emp-score-mini" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em' }}>{desig}</span>
                  <span style={{ color: 'var(--text3)' }}>·</span>
                  <span>{entries} entries</span>
                </div>
              </div>
              <div className="emp-total-badge" style={{ color: scoreColor, background: bgBadge }}>
                {total > 0 ? '+' : ''}{total.toFixed(1)}
              </div>
              
              {!isViewMode && (
                <button 
                  className="emp-remove-btn" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveMember(member);
                  }}
                  title={`Remove ${member.name}`}
                >✕</button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
