import { useEffect, useState } from 'react';

export default function SharePanel({ isOpen, onClose }) {
  const [copied, setCopied] = useState('');
  
  if (!isOpen) return null;

  const links = [
    { label: 'Full Team View', sub: 'All members — read only', hash: 'view', color: 'var(--text3)', dot: '#6b7280' },
    { label: 'L1 Leaderboard', sub: `L1 only`, hash: 'tier-L1', color: '#0891b2', dot: '#0891b2' },
    { label: 'L2 Leaderboard', sub: `L2 only`, hash: 'tier-L2', color: '#2d7aed', dot: '#2d7aed' },
    { label: 'L3 Leaderboard', sub: `L3 only`, hash: 'tier-L3', color: '#f0a500', dot: '#f0a500' },
    { label: 'L4 Leaderboard', sub: `L4 only`, hash: 'tier-L4', color: '#16a34a', dot: '#16a34a' },
  ];

  const handleCopy = (hash) => {
    const url = `${window.location.origin}${window.location.pathname}#${hash}`;
    navigator.clipboard.writeText(url);
    setCopied(hash);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="share-panel-overlay open" onClick={(e) => e.target.className.includes('overlay') && onClose()}>
      <div className="share-panel">
        <div className="share-header">
          <div className="share-title">SHARE LEADERBOARD</div>
          <button className="share-close" onClick={onClose}>✕</button>
        </div>
        <div className="share-body">
          {links.map(link => (
            <div key={link.hash} className="share-link-row">
              <div className="slr-dot" style={{ background: link.dot }}></div>
              <div className="slr-info">
                <div className="slr-label" style={{ color: link.color }}>{link.label}</div>
                <div className="slr-sub">{link.sub}</div>
              </div>
              <button 
                className={`slr-copy ${copied === link.hash ? 'copied' : ''}`} 
                onClick={() => handleCopy(link.hash)}
              >
                {copied === link.hash ? '✓ COPIED' : 'COPY'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
