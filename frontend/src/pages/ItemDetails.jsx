import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/itemdetails.css";

function ItemDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchItem();
    fetchComments();
  }, [id]);

  const fetchItem = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/items/${id}`);
      const data = await response.json();
      setItem(data);
    } catch (error) {
      console.error("Error fetching item:", error);
    }
    setLoading(false);
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/comments/${id}`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    
    if (!userId) {
      alert("Please login to post comments");
      navigate("/login");
      return;
    }

    if (!newComment.trim()) {
      alert("Please enter a comment");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: newComment,
          postedBy: userId,
          itemId: id,
        }),
      });

      if (response.ok) {
        setNewComment("");
        fetchComments();
      }
    } catch (error) {
      alert("Error posting comment: " + error.message);
    }
  };

  if (loading) return <p className="loading">Loading item details...</p>;
  if (!item) return <p className="error">Item not found</p>;

  return (
    <section className="item-details-section">
      <div className="item-details-container">
        <div className="item-details-main">
          {item.image && (
            <div className="item-image-large">
              <img src={item.image} alt={item.title} />
            </div>
          )}
          <div className="item-info">
            <h1>{item.title}</h1>
            <p className={`item-type-badge ${item.type}`}>
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
            </p>
            <p><strong>Category:</strong> {item.category}</p>
            <p><strong>Location:</strong> {item.location}</p>
            <p><strong>Status:</strong> {item.status.charAt(0).toUpperCase() + item.status.slice(1)}</p>
            
            <div className="description-box">
              <h3>Description</h3>
              <p>{item.description}</p>
            </div>

            <div className="contact-box">
              <h3>Contact Information</h3>
              <p><strong>Contact:</strong> {item.contact}</p>
              <p><strong>Posted by:</strong> {item.postedBy?.name} ({item.postedBy?.email})</p>
              {item.postedBy?.phone && <p><strong>Phone:</strong> {item.postedBy.phone}</p>}
            </div>
          </div>
        </div>

        <div className="comments-section">
          <h2>Comments ({comments.length})</h2>
          
          <form onSubmit={handleAddComment} className="comment-form">
            <textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="comment-input"
              rows="3"
            />
            <button type="submit" className="submit-btn">Add Comment</button>
          </form>

          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="no-comments">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="comment-item">
                  <div className="comment-header">
                    <strong>{comment.postedBy?.name}</strong>
                    <span className="comment-date">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p>{comment.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ItemDetails;
