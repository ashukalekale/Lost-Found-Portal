import "../styles/userprofile.css";

function UserStats({ stats }) {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <h3>📊 Total Items Posted</h3>
        <p className="stat-value">{stats.totalItems}</p>
      </div>

      <div className="stat-card">
        <h3>🔍 Lost Items</h3>
        <p className="stat-value">{stats.lostItems}</p>
      </div>

      <div className="stat-card">
        <h3>📦 Found Items</h3>
        <p className="stat-value">{stats.foundItems}</p>
      </div>

      {/* Active Days removed per request */}
    </div>
  );
}

export default UserStats;
