import { getInitials, getAvatarColors, getEmpTotal } from '../lib/helpers';
import { TIER_META } from '../lib/constants';

export default function TierGate({ tierFilter, members, scores, onSelectIdentity }) {
  if (!tierFilter) return null;
  
  const tm = TIER_META[tierFilter] || {};

  return (
    <div className="tier-gate">
      <div className="gate-logo">IMPACT OPS</div>
      <div className="gate-tier-label" style={{ color: tm.color }}>{tierFilter} CLEARANCE</div>
      <div className="gate-headline">Verify Identity</div>
      <div className="gate-sub">
        Please select your profile to enter the Leaderboard
      </div>
        
        <div className="gate-cards">
          {members.map((member, idx) => {
            const [bg, fg] = getAvatarColors(idx);
            const total = getEmpTotal(scores, member.id);
            const sc = total >= 0 ? `+${total.toFixed(1)}` : total.toFixed(1);

            return (
              <div key={member.id} className="gate-card" onClick={() => onSelectIdentity(member)}>
                <div className="gate-card-av" style={{ background: bg, color: fg }}>
                  {getInitials(member.name)}
                </div>
                <div>
                  <div className="gate-card-name">{member.name}</div>
                  <div className="gate-card-sub">{tierFilter} · Score: {sc}</div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
