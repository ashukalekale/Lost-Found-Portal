import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/dashboard.css";

function Dashboard() {
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);

  useEffect(() => {
    fetchRecentItems();
  }, []);

  const fetchRecentItems = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/items");
      const data = await response.json();
      setRecentItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
    setLoading(false);
  };

  const handleToggleSelect = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const handleDeleteSelected = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please login to delete items");
      return;
    }

    if (selectedItems.length === 0) {
      alert("Please select at least one item to delete");
      return;
    }

    if (!window.confirm("Delete selected items?")) return;

    for (const itemId of selectedItems) {
      try {
        const response = await fetch(`http://localhost:5000/api/items/${itemId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Failed deleting", itemId, errorData);
        }
      } catch (error) {
        console.error("Error deleting item", itemId, error);
      }
    }

    setRecentItems((prev) => prev.filter((item) => !selectedItems.includes(item._id)));
    setSelectedItems([]);
  };

  return (
    <section className="dashboard-section">
      <div className="dashboard-hero">
        <div className="hero-content">
          <h1>"Reunite with What Matters Most"</h1>
          <p>Lost something dear? Or found someone's cherished belonging?</p>
          <p className="sub-text">Join the community and make a difference today.</p>
          <div className="hero-buttons">
            <Link to="/search" className="btn btn-hero">
              Search Items
            </Link>
            <Link to="/post-item" className="btn btn-hero secondary">
              Post Lost/Found Item
            </Link>
            <Link to="/success-stories" className="btn btn-hero outlined">
              Success stories
            </Link>
          </div>
        </div>
        <div className="hero-decoration">
          <div className="hands-illustration">
            {/* Decorative hands - can be styled with CSS */}
            <span>👐</span>
          </div>
        </div>
      </div>

      <div className="recent-items-section">
        <div className="recent-items-header">
          <h2>Recent Posts</h2>
          <button
            className={`toggle-select-btn ${selectionMode ? "active" : ""}`}
            onClick={() => {
              setSelectionMode((prev) => !prev);
              if (selectionMode) setSelectedItems([]);
            }}
          >
            {selectionMode ? "Cancel Select" : "Select Items"}
          </button>
        </div>

        {selectedItems.length > 0 && (
          <div className="remove-selected-container">
            <button className="remove-selected-btn" onClick={handleDeleteSelected}>
              Delete Selected ({selectedItems.length})
            </button>
          </div>
        )}

        {loading ? (
          <p className="loading">Loading items...</p>
        ) : recentItems.length === 0 ? (
          <p className="no-items">No items posted yet. Be the first to post!</p>
        ) : (
          <div className="items-grid">
            {recentItems.map((item) => {
              const isSelected = selectedItems.includes(item._id);
              return (
                <div
                  key={item._id}
                  className={`item-card-wrapper ${isSelected ? "selected" : ""}`}
                >
                  {selectionMode && (
                    <input
                      type="checkbox"
                      className="item-checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleToggleSelect(item._id);
                      }}
                    />
                  )}

                  {selectionMode ? (
                    <div
                      className="item-card selectable"
                      onClick={() => handleToggleSelect(item._id)}
                    >
                      {item.image && (
                        <div className="item-image">
                          <img src={item.image} alt={item.title} />
                        </div>
                      )}
                      <div className="item-content">
                        <h3>{item.title}</h3>
                        <p className="item-type" style={{
                          background: item.type === "lost" ? "#dc2626" : "#16a34a"
                        }}>
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </p>
                        <p><strong>Location:</strong> {item.location}</p>
                        <p className="item-desc">{item.description.substring(0, 60)}...</p>
                        <p className="posted-by">Posted by: {item.postedBy?.name}</p>
                      </div>
                    </div>
                  ) : (
                    <Link to={`/item/${item._id}`} className="item-card">
                      {item.image && (
                        <div className="item-image">
                          <img src={item.image} alt={item.title} />
                        </div>
                      )}
                      <div className="item-content">
                        <h3>{item.title}</h3>
                        <p className="item-type" style={{
                          background: item.type === "lost" ? "#dc2626" : "#16a34a"
                        }}>
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </p>
                        <p><strong>Location:</strong> {item.location}</p>
                        <p className="item-desc">{item.description.substring(0, 60)}...</p>
                        <p className="posted-by">Posted by: {item.postedBy?.name}</p>
                      </div>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default Dashboard;