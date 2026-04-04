import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/itemdetails.css";

function ItemDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
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
      const ordered = data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      setComments(ordered);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleAddComment = async (e, parentId = null) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    
    if (!userId) {
      alert("Please login to post comments");
      navigate("/login");
      return;
    }

    const text = parentId ? replyText : newComment;
    if (!text.trim()) {
      alert("Please enter a comment");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          postedBy: userId,
          itemId: id,
          parentId,
        }),
      });

      if (response.ok) {
        if (parentId) {
          setReplyText("");
          setReplyingTo(null);
        } else {
          setNewComment("");
        }
        fetchComments();
      }
    } catch (error) {
      alert("Error posting comment: " + error.message);
    }
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment._id);
    setEditText(comment.text);
  };

  const handleSaveEdit = async (commentId) => {
    if (!editText.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/comments/${commentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: editText }),
      });

      if (response.ok) {
        setEditingComment(null);
        setEditText("");
        fetchComments();
      } else {
        alert("Error updating comment");
      }
    } catch (error) {
      alert("Error updating comment: " + error.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/comments/${commentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchComments();
      } else {
        alert("Error deleting comment");
      }
    } catch (error) {
      alert("Error deleting comment: " + error.message);
    }
  };

  const renderComment = (comment, isReply = false) => {
    const replies = comments.filter(c => c.parentId === comment._id);

    return (
      <div key={comment._id} className={isReply ? "comment-reply" : "comment-item"}>
        <div className="comment-header">
          <strong>{comment.postedBy?.name}</strong>
          <span className="comment-date">
            {new Date(comment.createdAt).toLocaleDateString()}
          </span>
          <div className="comment-action-dropdown">
            <button 
              className="action-menu-btn"
              onClick={() => setOpenMenu(openMenu === comment._id ? null : comment._id)}
            >
              ⋮
            </button>
            {openMenu === comment._id && (
              <div className="small-action-menu">
                {comment.postedBy?._id === localStorage.getItem("userId") && (
                  <>
                    <button 
                      className="edit-btn"
                      onClick={() => {
                        handleEditComment(comment);
                        setOpenMenu(null);
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-comment-btn"
                      onClick={() => {
                        handleDeleteComment(comment._id);
                        setOpenMenu(null);
                      }}
                    >
                      Delete
                    </button>
                  </>
                )}
                {!isReply && comment.postedBy?._id !== localStorage.getItem("userId") && (
                  <button 
                    className="reply-btn"
                    onClick={() => {
                      setReplyingTo(comment._id);
                      setOpenMenu(null);
                    }}
                  >
                    Reply
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        {editingComment === comment._id ? (
          <div className="comment-edit-area">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="comment-edit-input"
              rows="3"
            />
            <div className="comment-edit-actions">
              <button 
                onClick={() => handleSaveEdit(comment._id)}
                className="update-btn"
              >
                Save
              </button>
              <button 
                onClick={() => setEditingComment(null)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p>{comment.text}</p>
        )}
        {replyingTo === comment._id && (
          <form onSubmit={(e) => handleAddComment(e, comment._id)} className="reply-form">
            <textarea
              placeholder="Write a reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="comment-input"
              rows="2"
            />
            <div className="comment-edit-actions">
              <button type="submit" className="update-btn">Reply</button>
              <button 
                type="button"
                onClick={() => setReplyingTo(null)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        {replies.length > 0 && (
          <div className="replies">
            {replies.map(reply => renderComment(reply, true))}
          </div>
        )}
      </div>
    );
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
              comments.filter(c => !c.parentId).map(comment => renderComment(comment))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ItemDetails;
