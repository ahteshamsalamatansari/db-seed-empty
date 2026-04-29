import { useState } from 'react';
import { getInitials, getAvatarColors } from '../lib/helpers';
import { TIER_LEVELS, TIER_META } from '../lib/constants';

export default function AddMemberModal({ isOpen, onClose, onAddMember, existingNames }) {
  const [name, setName] = useState('');
  const [desig, setDesig] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (name.trim().length < 2) {
      setError('Enter full name (min 2 chars)');
      return;
    }
    if (existingNames.map(n => n.toLowerCase()).includes(name.toLowerCase())) {
      setError(`"${name}" already exists`);
      return;
    }
    if (!desig) {
      setError('Please select a designation');
      return;
    }
    
    onAddMember(name.trim(), desig);
    setName('');
    setDesig('');
    setError('');
  };

  const [bg, fg] = getAvatarColors(existingNames.length);
  const tm = TIER_META[desig] || {};

  return (
    <div className="modal-overlay open" style={{ zIndex: 700 }} onClick={(e) => e.target.className.includes('modal-overlay') && onClose()}>
      <div className="modal" style={{ maxWidth: '480px' }}>
        <div className="modal-title">ADD NEW MEMBER</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--text2)', marginBottom: '24px' }}>
          Impact Ops Roster Update
        </div>
        
        {error && <div style={{ color: 'var(--red)', marginBottom: '10px', fontSize: '13px' }}>{error}</div>}
        
        <input 
          type="text" 
          placeholder="Employee Full Name" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: '100%', background: 'var(--surface2)', border: '1px solid var(--border2)', 
            borderRadius: '8px', padding: '12px 16px', color: 'var(--text)', 
            fontFamily: "'Barlow', sans-serif", fontSize: '15px', outline: 'none', marginBottom: '20px'
          }}
        />
        
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--text3)', letterSpacing: '0.1em', marginBottom: '10px' }}>
          ASSIGN DESIGNATION
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '24px' }}>
          {TIER_LEVELS.map(t => (
            <button 
              key={t}
              onClick={() => setDesig(t)}
              style={{
                padding: '12px', background: desig === t ? 'var(--surface3)' : 'var(--surface2)',
                border: `1px solid ${desig === t ? TIER_META[t].color : 'var(--border)'}`,
                borderRadius: '8px', color: desig === t ? TIER_META[t].color : 'var(--text2)',
                cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left',
                display: 'flex', flexDirection: 'column', gap: '4px'
              }}
            >
              <div style={{ fontWeight: 600, fontSize: '14px' }}>{t}</div>
            </button>
          ))}
        </div>
        
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button 
            onClick={onClose}
            style={{ padding: '10px 20px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text)', cursor: 'pointer' }}
          >
            CANCEL
          </button>
          <button 
            onClick={handleSubmit}
            className="submit-btn"
          >
            ADD TO ROSTER
          </button>
        </div>
      </div>
    </div>
  );
}
