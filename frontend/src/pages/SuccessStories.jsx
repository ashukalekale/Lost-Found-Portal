import { useState, useEffect } from "react";
import "../styles/successstories.css";

function SuccessStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResolvedItems();
  }, []);

  const fetchResolvedItems = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/items?status=resolved");
      const data = await response.json();
      setStories(data);
    } catch (error) {
      console.error("Error fetching stories:", error);
    }
    setLoading(false);
  };

  return (
    <section className="success-section">
      <div className="success-hero">
        <h1>"Reunite with What Matters Most"</h1>
        <p>Lost something dear? Or found someone's cherished belonging?</p>
        <p className="sub-text">Join the community and make a difference today.</p>
        <div className="hero-buttons">
          <button onClick={() => window.location.href="/search"} className="btn btn-hero">
            Search Items
          </button>
          <button onClick={() => window.location.href="/post-item"} className="btn btn-hero secondary">
            Post Lost/Found Item
          </button>
        </div>
      </div>

      <div className="stories-section">
        <h2>Success Stories</h2>
        <p className="stories-subtitle">Did you find your belonging on this platform? Share your success story <a href="#">here</a></p>
        
        {loading ? (
          <p className="loading">Loading success stories...</p>
        ) : stories.length === 0 ? (
          <p className="no-stories">No success stories yet. Start searching or post an item!</p>
        ) : (
          <div className="stories-grid">
            {stories.map((story) => (
              <div key={story._id} className="story-card">
                {story.image && (
                  <img src={story.image} alt={story.title} className="story-image" />
                )}
                <div className="story-content">
                  <h3>{story.title}</h3>
                  <p>{story.description}</p>
                  <p className="story-quote">"{story.description}"</p>
                  <p className="story-credit">- {story.postedBy?.name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default SuccessStories;
