import "../styles/statsSection.css";

function StatsSection({ stats }) {
  return (
    <div className="stats-section">
      <div className="stat-card">
        <div className="stat-number">{stats.total}</div>
        <div className="stat-label">Success Stories</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{stats.reunited}</div>
        <div className="stat-label">Items Reunited</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{stats.users}</div>
        <div className="stat-label">Happy Members</div>
      </div>
    </div>
  );
}

export default StatsSection;
