export default function Header({ todayCount, totalMembers, teamTotal, teamAvg, openSharePanel, isViewMode, openBatch, openAddMember }) {
  const isPositive = teamTotal >= 0;
  
  return (
    <header className="header">
      <div className="header-left">
        <div className="logo-block">
          <div className="logo-icon">io</div>
          <div className="logo-text">
            <span className="logo-team">Impact Ops</span>
            <span className="logo-sub">Leader Dashboard</span>
          </div>
        </div>
        <div className="header-divider"></div>
        <div className="live-indicator">
          <div className="live-dot"></div>
          LIVE SYSTEM
        </div>
      </div>
      
      <div className="header-right">
        <div className="header-stat">
          <span className="lbl">LOGGED TODAY:</span>
          <span className="val">{todayCount}/{totalMembers}</span>
        </div>
        <div className="header-stat">
          <span className="lbl">TEAM NET:</span>
          <span className="val" style={{ color: isPositive ? 'var(--p1)' : 'var(--n1)' }}>
            {isPositive ? '+' : ''}{teamTotal.toFixed(1)}
          </span>
        </div>
        <div className="header-stat" style={{ marginRight: '10px' }}>
          <span className="lbl">AVG:</span>
          <span className="val" style={{ color: teamAvg >= 0 ? 'var(--p1)' : 'var(--n1)' }}>
            {teamAvg >= 0 ? '+' : ''}{teamAvg.toFixed(2)}
          </span>
        </div>
        
        {!isViewMode && (
          <button 
            className="submit-btn add-member-btn" 
            style={{ 
              height: '32px', 
              fontSize: '12px', 
              background: 'linear-gradient(135deg, #00c853, #00e676)',
              color: '#0a0a0a',
              fontWeight: 700,
              border: 'none',
              boxShadow: '0 0 12px rgba(0, 200, 83, 0.3)',
            }} 
            onClick={openAddMember}
            title="Add New Member (Ctrl+M)"
          >
            <span style={{ fontSize: '14px', fontWeight: 800 }}>＋</span> ADD MEMBER
          </button>
        )}

        {!isViewMode && (
          <button className="submit-btn" style={{ height: '32px', fontSize: '12px' }} onClick={openBatch}>
            <span>⚡</span> BATCH UPDATE
          </button>
        )}
        
        <button 
          className="submit-btn" 
          style={{ height: '32px', fontSize: '12px', background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border2)' }}
          onClick={openSharePanel}
        >
          <span>🔗</span> SHARE VIEW
        </button>
      </div>
    </header>
  );
}
