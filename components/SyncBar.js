export default function SyncBar({ syncStatus, lastUpdate }) {
  return (
    <div className="sync-bar">
      <div className="sync-status">
        <div className={`sync-dot ${syncStatus.state}`}></div>
        <span className={syncStatus.state}>{syncStatus.label}</span>
      </div>
      <div className="sync-time">{lastUpdate ? `Last updated: ${lastUpdate}` : 'Awaiting data...'}</div>
    </div>
  );
}
