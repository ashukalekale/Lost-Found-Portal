import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/dashboard.css";

function Dashboard() {
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentItems();
  }, []);

  const fetchRecentItems = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/items");
      const data = await response.json();
      setRecentItems(data.slice(0, 6)); // Get first 6 items
    } catch (error) {
      console.error("Error fetching items:", error);
    }
    setLoading(false);
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
        <h2>Recent Posts</h2>
        {loading ? (
          <p className="loading">Loading items...</p>
        ) : recentItems.length === 0 ? (
          <p className="no-items">No items posted yet. Be the first to post!</p>
        ) : (
          <div className="items-grid">
            {recentItems.map((item) => (
              <Link to={`/item/${item._id}`} key={item._id} className="item-card">
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
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Dashboard;