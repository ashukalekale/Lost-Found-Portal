import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/search.css";

function Search() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

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

    setItems((prev) => prev.filter((item) => !selectedItems.includes(item._id)));
    setSelectedItems([]);
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
        <div className="results-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
          <h2>Search Results</h2>
          <button
            type="button"
            className={`toggle-select-btn ${selectionMode ? 'active' : ''}`}
            onClick={() => {
              setSelectionMode((prev) => !prev);
              if (selectionMode) setSelectedItems([]);
            }}
          >
            {selectionMode ? 'Cancel Select' : 'Select Items'}
          </button>
        </div>

        {selectionMode && selectedItems.length > 0 && (
          <div className="remove-selected-container" style={{ marginBottom: '1rem', textAlign: 'center' }}>
            <button className="remove-selected-btn" onClick={handleDeleteSelected}>
              Delete Selected ({selectedItems.length})
            </button>
          </div>
        )}

        {loading ? (
          <p className="loading">Loading items...</p>
        ) : items.length === 0 ? (
          <p className="no-results">No items found. Try searching with different keywords.</p>
        ) : (
          <div className="items-grid">
            {items.map((item) => {
              const isSelected = selectedItems.includes(item._id);
              return (
                <div
                  key={item._id}
                  className={`item-card-wrapper ${isSelected ? 'selected' : ''}`}
                  style={{ position: 'relative' }}
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
                          background: item.type === 'lost' ? '#ff6b6b' : '#51cf66'
                        }}>
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </p>
                        <p><strong>Location:</strong> {item.location}</p>
                        <p className="item-desc">{item.description.substring(0, 80)}...</p>
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
                          background: item.type === 'lost' ? '#ff6b6b' : '#51cf66'
                        }}>
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </p>
                        <p><strong>Location:</strong> {item.location}</p>
                        <p className="item-desc">{item.description.substring(0, 80)}...</p>
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

export default Search;
