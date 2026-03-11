import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/search.css";

function Search() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search || search) params.append("search", filters.search || search);
      if (filters.location || location) params.append("location", filters.location || location);
      if (filters.type || type) params.append("type", filters.type || type);

      const response = await fetch(`http://localhost:5000/api/items?${params}`);
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems();
  };

  return (
    <section className="search-section">
      <div className="search-hero">
        <h1>Your Lost Belongings May Be Just a Search Away</h1>
        <p>Search for items by name and location</p>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <div className="search-inputs">
          <input
            type="text"
            placeholder="Item name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="search-input"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="search-select"
          >
            <option value="">All Types</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
        </div>
        <button type="submit" className="search-btn">Search</button>
      </form>

      <div className="results-section">
        <h2>Search Results</h2>
        {loading ? (
          <p className="loading">Loading items...</p>
        ) : items.length === 0 ? (
          <p className="no-results">No items found. Try searching with different keywords.</p>
        ) : (
          <div className="items-grid">
            {items.map((item) => (
              <Link to={`/item/${item._id}`} key={item._id} className="item-card">
                {item.image && (
                  <div className="item-image">
                    <img src={item.image} alt={item.title} />
                  </div>
                )}
                <div className="item-content">
                  <h3>{item.title}</h3>
                  <p className="item-type" style={{
                    background: item.type === "lost" ? "#ff6b6b" : "#51cf66"
                  }}>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </p>
                  <p><strong>Location:</strong> {item.location}</p>
                  <p className="item-desc">{item.description.substring(0, 80)}...</p>
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

export default Search;
