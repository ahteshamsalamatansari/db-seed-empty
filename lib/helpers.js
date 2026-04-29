import { AVATAR_COLORS, TIER_META } from './constants';

export function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
}

export function getAvatarColors(index) {
  return AVATAR_COLORS[Math.max(index, 0) % AVATAR_COLORS.length];
}

export function getDesig(name, designations) {
  return designations[name] || 'L3';
}

export function getEmpTotal(scores, memberId) {
  const entries = scores.filter(s => s.member_id === memberId);
  return entries.reduce((sum, e) => sum + parseFloat(e.score), 0);
}

export function getEmpEntries(scores, memberId) {
  return scores.filter(s => s.member_id === memberId).length;
}

export function getEmpScoresByDate(scores, memberId) {
  const entries = scores.filter(s => s.member_id === memberId);
  const map = {};
  entries.forEach(e => {
    map[e.date] = { score: parseFloat(e.score), reason: e.reason || '', id: e.id, ts: e.updated_at };
  });
  return map;
}

export function getTier(total) {
  if (total >= 3)  return { label:'ELITE',    cls:'tb-elite',    rowCls:'tier-elite'   };
  if (total >= 1)  return { label:'STRONG',   cls:'tb-strong',   rowCls:'tier-strong'  };
  if (total >= 0)  return { label:'STEADY',   cls:'tb-steady',   rowCls:'tier-steady'  };
  if (total >= -1) return { label:'AT RISK',  cls:'tb-risk',     rowCls:'tier-risk'    };
  return             { label:'CRITICAL', cls:'tb-critical', rowCls:'tier-critical' };
}

export function getScoreColor(total) {
  if (total > 0) return 'var(--p1)';
  if (total < 0) return 'var(--n1)';
  return 'var(--text2)';
}

export function getScoreClass(score) {
  if (score >= 1)  return 'score-p1';
  if (score > 0)   return 'score-p05';
  if (score === 0)  return 'score-zero';
  if (score > -1)  return 'score-n05';
  return 'score-n1';
}

export function getScoreTextClass(score) {
  if (score >= 1)  return 'text-p1';
  if (score > 0)   return 'text-p05';
  if (score === 0)  return 'text-zero';
  if (score > -1)  return 'text-n05';
  return 'text-n1';
}

export function getScoreLabel(score) {
  if (score >= 1)  return 'Exceptional (+1)';
  if (score > 0)   return 'Stretch (+0.5)';
  if (score === 0)  return 'Baseline (0)';
  if (score > -1)  return 'Process Miss (-0.5)';
  return 'Serious Breach (-1)';
}

export function formatScoreDisplay(score) {
  return score > 0 ? `+${score}` : `${score}`;
}

export function formatDateKey(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatHeaderDate(date) {
  return date.toLocaleDateString('en-GB', {
    weekday: 'short', day: '2-digit', month: 'short', year: 'numeric'
  }).toUpperCase();
}

export function getSparkDots(scores, memberId) {
  const entries = scores.filter(s => s.member_id === memberId);
  const sorted = entries.sort((a, b) => a.date.localeCompare(b.date)).slice(-7);
  return sorted.map(e => {
    const sc = parseFloat(e.score);
    const bg = sc >= 1 ? 'var(--p1)' : sc > 0 ? 'var(--p05)' : sc === 0 ? 'var(--zero)' : sc > -1 ? 'var(--n05)' : 'var(--n1)';
    return { bg, score: sc, date: e.date };
  });
}

export function getTierMembers(members, designations, tier) {
  return members.filter(m => getDesig(m.name, designations) === tier);
}

export function getStreak(scoreMap, today) {
  let streak = 0;
  let check = new Date(today);
  while (true) {
    const key = formatDateKey(check);
    if (scoreMap[key] !== undefined) {
      streak++;
      check.setDate(check.getDate() - 1);
    } else break;
  }
  return streak;
}
