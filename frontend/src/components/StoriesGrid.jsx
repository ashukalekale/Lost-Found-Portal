import "../styles/storiesGrid.css";

function StoriesGrid({ stories, onStoryClick, loading }) {
  // Inline StoryCard Component
  const StoryCard = ({ story, onClick }) => (
    <div className="story-card" onClick={onClick}>
      {story.image && (
        <img src={story.image} alt={story.title} className="story-image" />
      )}
      <div className="story-content">
        <h3>{story.title}</h3>
        <p className="story-desc">{story.description.substring(0, 100)}...</p>
        <p className="story-credit">- {story.postedBy?.name || "Anonymous"}</p>
        <div className="view-more">Click to read more →</div>
      </div>
    </div>
  );

  if (loading) {
    return <p className="loading">Loading success stories...</p>;
  }

  if (stories.length === 0) {
    return (
      <p className="no-stories">
        No success stories yet. Start searching or post an item!
      </p>
    );
  }

  return (
    <div className="stories-grid">
      {stories.map((story) => (
        <StoryCard
          key={story._id}
          story={story}
          onClick={() => onStoryClick(story)}
        />
      ))}
    </div>
  );
}

export default StoriesGrid;
