import { useState, useEffect } from "react";
import StatsSection from "../components/StatsSection";
import StoryForm from "../components/StoryForm";
import StoriesGrid from "../components/StoriesGrid";
import StoryDetail from "../components/StoryDetail";
import "../styles/successstories.css";

function SuccessStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [stats, setStats] = useState({ total: 0, reunited: 0, users: 0 });

  useEffect(() => {
    fetchResolvedItems();
  }, []);

  const fetchResolvedItems = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/stories");
      const data = await response.json();
      setStories(data);
      setStats({
        total: data.length,
        reunited: data.length,
        users: new Set(data.map((s) => s.postedBy?._id)).size,
      });
    } catch (error) {
      console.error("Error fetching stories:", error);
    }
    setLoading(false);
  };

  const handleStorySubmitted = () => {
    setShowForm(false);
    fetchResolvedItems();
  };

  return (
    <section className="success-section">
      {/* Hero Section */}
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

      {/* Statistics Section */}
      <StatsSection stats={stats} />

      {/* Stories Section */}
      <div className="stories-section">
        <div className="stories-header">
          <div>
            <h2>Success Stories</h2>
            <p className="stories-subtitle">
              Did you find your belonging on this platform? 
              <button 
                className="share-link-btn" 
                onClick={() => setShowForm(!showForm)}
              >
                Share your success story here
              </button>
            </p>
          </div>
        </div>

        {/* Submit Story Form */}
        {showForm && (
          <StoryForm 
            onSubmit={handleStorySubmitted}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* Stories Grid */}
        <StoriesGrid 
          stories={stories}
          onStoryClick={setSelectedStory}
          loading={loading}
        />
      </div>

      {/* Story Detail Modal */}
      <StoryDetail 
        story={selectedStory}
        onClose={() => setSelectedStory(null)}
      />
    </section>
  );
}

export default SuccessStories;
