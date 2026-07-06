import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/userprofile.css";

function UserItemsList({ items, isOwnProfile = false, onItemStatusChange }) {
  const [filterType, setFilterType] = useState("all");

  const filteredItems = filterType === "all" 
    ? items 
    : items.filter(item => item.type === filterType);

  if (items.length === 0) {
    return (
      <div className="no-items">
        <p>No items posted yet</p>
      </div>
    );
  }

  return (
    <div className="user-items-section">
      <div className="items-filter">
        <button 
          className={`filter-btn ${filterType === "all" ? "active" : ""}`}
          onClick={() => setFilterType("all")}
        >
          All Items ({items.length})
        </button>
        <button 
          className={`filter-btn ${filterType === "lost" ? "active" : ""}`}
          onClick={() => setFilterType("lost")}
        >
          Lost ({items.filter(i => i.type === "lost").length})
        </button>
        <button 
          className={`filter-btn ${filterType === "found" ? "active" : ""}`}
          onClick={() => setFilterType("found")}
        >
          Found ({items.filter(i => i.type === "found").length})
        </button>
      </div>

      <div className="items-grid">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const content = (
              <>
                {item.image && (
                  <div className="item-image">
                    <img src={item.image} alt={item.title} />
                  </div>
                )}
                <div className="item-content">
                  <h3>{item.title}</h3>
                  <p className="item-category">{item.category}</p>
                  <p className="item-location">📍 {item.location}</p>
                  <div className="item-meta">
                    <span className={`item-type ${item.type}`}>
                      {item.type === "lost" ? "🔍 Lost" : "📦 Found"}
                    </span>
                    <span className={`item-status ${item.status}`}>
                      {item.status}
                    </span>
                    {isOwnProfile && (
                      <select
                        aria-label={`Change status for ${item.title}`}
                        value={item.status}
                        onChange={(e) => onItemStatusChange && onItemStatusChange(item._id, e.target.value)}
                        className="status-select"
                      >
                        <option value="open">Open</option>
                        <option value="claimed">Claimed</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    )}
                  </div>
                </div>
              </>
            );

            if (isOwnProfile) {
              return (
                <div key={item._id} className="item-card">
                  {content}
                </div>
              );
            }

            return (
              <Link to={`/item/${item._id}`} key={item._id} className="item-card">
                {content}
              </Link>
            );
          })
        ) : (
          <p className="no-results">No {filterType} items</p>
        )}
      </div>
    </div>
  );
}

export default UserItemsList;
