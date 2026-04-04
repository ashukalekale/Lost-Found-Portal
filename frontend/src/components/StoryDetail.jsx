import "../styles/storyDetail.css";

function StoryDetail({ story, onClose }) {
  if (!story) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        {story.image && (
          <img src={story.image} alt={story.title} className="modal-image" />
        )}

        <div className="modal-body">
          <h2>{story.title}</h2>
          <p className="modal-credit">
            Shared by <strong>{story.postedBy?.name || "Anonymous"}</strong>
          </p>

          <div className="modal-section">
            <h3>Story</h3>
            <p>{story.description}</p>
          </div>

          {story.testimonial && (
            <div className="modal-section">
              <h3>Testimonial</h3>
              <p className="testimonial-text">"{story.testimonial}"</p>
            </div>
          )}

          <div className="modal-meta">
            <span className="badge">✓ Item Recovered</span>
            <span className="date">
              {new Date(story.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StoryDetail;
