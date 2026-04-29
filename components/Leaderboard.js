import { useState, useEffect, useRef } from 'react';
import { getTier, getDesig, getEmpTotal, getEmpEntries, getSparkDots, getInitials, getAvatarColors } from '../lib/helpers';
import { TIER_META } from '../lib/constants';

// Animated Counter Hook
function useAnimatedCounter(end, duration = 1000) {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  
  useEffect(() => {
    let startTimestamp = null;
    const startValue = countRef.current;
    const distance = end - startValue;
    
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutQuart
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      const current = startValue + distance * easeProgress;
      
      setCount(current);
      countRef.current = current;
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(end);
        countRef.current = end;
      }
    };
    
    window.requestAnimationFrame(step);
  }, [end, duration]);
  
  return count;
}

export default function Leaderboard({ members, scores, designations, onSelectEmp, isViewMode, activeFilter, setActiveFilter }) {
  const [sortParam, setSortParam] = useState('score'); // score, name, entries
  
  // KPI Calculations
  const todayKey = new Date().toISOString().slice(0, 10);
  let visibleMembers = members;
  
  if (activeFilter !== 'ALL') {
    visibleMembers = members.filter(m => getDesig(m.name, designations) === activeFilter);
  }
  
  let teamTotal = 0, todayCount = 0, atRisk = 0;
  
  const memberData = visibleMembers.map((m, idx) => {
    const total = getEmpTotal(scores, m.id);
    const entries = getEmpEntries(scores, m.id);
    const todayLogged = scores.some(s => s.member_id === m.id && s.date === todayKey);
    const desig = getDesig(m.name, designations);
    
    teamTotal += total;
    if (total < 0) atRisk++;
    if (todayLogged) todayCount++;
    
    return { ...m, idx, total, entries, todayLogged, desig };
  });
  
  const avg = visibleMembers.length ? teamTotal / visibleMembers.length : 0;
  
  // Sorting
  memberData.sort((a, b) => {
    if (sortParam === 'score') return b.total - a.total;
    if (sortParam === 'name') return a.name.localeCompare(b.name);
    if (sortParam === 'entries') return b.entries - a.entries;
    return 0;
  });

  // Animated KPIs
  const animatedTeamTotal = useAnimatedCounter(teamTotal);
  const animatedAvg = useAnimatedCounter(avg);
  const animatedRisk = Math.round(useAnimatedCounter(atRisk));
  const animatedToday = Math.round(useAnimatedCounter(todayCount));

  return (
    <div className="ov-wrap">
      <div className="ov-lb-head">
        <div className="ov-lb-title">
          Leaderboard
          <span style={{ fontSize: '9px', color: 'var(--text3)' }}>
            {new Date().toLocaleDateString('en-GB',{weekday:'short',day:'2-digit',month:'short',year:'numeric'}).toUpperCase()}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div className="ov-sort-group">
            <button className={`ov-sort-btn ${activeFilter === 'ALL' ? 'active' : ''}`} onClick={() => setActiveFilter('ALL')}>ALL</button>
            <button className={`ov-sort-btn ${activeFilter === 'L1' ? 'active' : ''}`} onClick={() => setActiveFilter('L1')}>L1</button>
            <button className={`ov-sort-btn ${activeFilter === 'L2' ? 'active' : ''}`} onClick={() => setActiveFilter('L2')}>L2</button>
            <button className={`ov-sort-btn ${activeFilter === 'L3' ? 'active' : ''}`} onClick={() => setActiveFilter('L3')}>L3</button>
            <button className={`ov-sort-btn ${activeFilter === 'L4' ? 'active' : ''}`} onClick={() => setActiveFilter('L4')}>L4</button>
          </div>
          <select className="ov-sort-btn" style={{ background: 'var(--surface2)', outline: 'none' }} value={sortParam} onChange={e => setSortParam(e.target.value)}>
            <option value="score">Sort: Net Score</option>
            <option value="name">Sort: Name (A-Z)</option>
            <option value="entries">Sort: Total Entries</option>
          </select>
        </div>
      </div>

      <div className="ov-kpi-strip">
        <div className="ov-kpi kpi-total">
          <div className="ov-kpi-label">TEAM NET SCORE</div>
          <div className="ov-kpi-val" style={{ color: teamTotal >= 0 ? 'var(--p1)' : 'var(--n1)' }}>
            {teamTotal >= 0 ? '+' : ''}{animatedTeamTotal.toFixed(1)}
          </div>
        </div>
        <div className="ov-kpi kpi-today">
          <div className="ov-kpi-label">LOGGED TODAY</div>
          <div className="ov-kpi-val" style={{ color: 'var(--blue)' }}>
            {animatedToday}/{visibleMembers.length}
          </div>
        </div>
        <div className="ov-kpi kpi-avg">
          <div className="ov-kpi-label">TEAM AVERAGE</div>
          <div className="ov-kpi-val" style={{ color: avg >= 0 ? 'var(--p1)' : 'var(--n1)' }}>
            {avg >= 0 ? '+' : ''}{animatedAvg.toFixed(2)}
          </div>
        </div>
        <div className="ov-kpi kpi-risk">
          <div className="ov-kpi-label">AT RISK (NEGATIVE)</div>
          <div className="ov-kpi-val" style={{ color: atRisk > 0 ? 'var(--n1)' : 'var(--text2)' }}>
            {animatedRisk}
          </div>
          <div className="ov-kpi-sub" style={{ color: atRisk === 0 ? 'var(--p1)' : 'var(--n1)' }}>
            {atRisk === 0 ? 'all positive ✓' : `${atRisk} need attention`}
          </div>
        </div>
      </div>

      <div className="ov-table">
        {memberData.map((m, rank) => {
          const tier = getTier(m.total);
          const [bg, fg] = getAvatarColors(m.idx);
          const scoreColor = m.total > 0 ? 'var(--p1)' : m.total < 0 ? 'var(--n1)' : 'var(--text2)';
          const tm = TIER_META[m.desig] || {};
          
          let rankLabel = rank + 1;
          let rankCls = '';
          let rankRowCls = '';
          if (rank === 0) { rankLabel = '🥇'; rankCls = 'r1'; rankRowCls = 'rank-1'; }
          else if (rank === 1) { rankLabel = '🥈'; rankCls = 'r2'; rankRowCls = 'rank-2'; }
          else if (rank === 2) { rankLabel = '🥉'; rankCls = 'r3'; rankRowCls = 'rank-3'; }

          const sparkDots = getSparkDots(scores, m.id);

          return (
            <div 
              key={m.id} 
              className={`ov-row ${tier.rowCls} ${rankRowCls}`}
              style={{ animationDelay: `${rank * 0.03}s` }}
              onClick={() => { if (!isViewMode) onSelectEmp(m); }}
            >
              <div className={`ov-rank ${rankCls}`}>{rankLabel}</div>
              <div className="ov-av" style={{ background: bg, color: fg }}>{getInitials(m.name)}</div>
              <div className="ov-info">
                <div className="ov-nm">{m.name}</div>
                <div className="ov-entries-sub">{m.entries} entr{m.entries === 1 ? 'y' : 'ies'}</div>
              </div>
              <div className="ov-tier" style={{ justifyContent: 'center' }}>
                <span 
                  className="ov-desig-pill" 
                  style={{ color: tm.color || 'var(--text3)', borderColor: (tm.color || 'var(--border)') + '44', background: tm.glow || 'transparent' }}
                >
                  {m.desig}
                </span>
              </div>
              <div className="ov-spark">
                {sparkDots.map((d, i) => (
                  <div key={i} className="spark-dot" style={{ background: d.bg }} title={`${d.date}: ${d.score}`}></div>
                ))}
              </div>
              <div className="ov-score" style={{ color: scoreColor }}>
                {m.total > 0 ? '+' : ''}{m.total.toFixed(1)}
              </div>
              <div className="ov-tier">
                <span className={`tier-badge ${tier.cls}`}>{tier.label}</span>
              </div>
              <div className="ov-today">
                <span className={m.todayLogged ? 'today-logged' : 'today-pending'}>
                  {m.todayLogged ? '✓ DONE' : '— NIL'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
