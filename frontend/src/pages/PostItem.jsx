import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/postitem.css";

function PostItem() {
  const [formData, setFormData] = useState({
    title: "",
    type: "lost",
    category: "Other",
    description: "",
    location: "",
    contact: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Get userId from localStorage (set during login)
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, postedBy: userId }),
      });

      if (response.ok) {
        alert("Item posted successfully!");
        navigate("/search");
      } else {
        alert("Failed to post item");
      }
    } catch (error) {
      alert("Error posting item: " + error.message);
    }
    setLoading(false);
  };

  return (
    <section className="post-item-section">
      <div className="post-hero">
        <h1>Post a Lost or Found Item</h1>
        <p>Help someone reunite with what they lost ❤️</p>
      </div>

      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label htmlFor="type">Type of Item</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="form-input"
          >
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="title">Item Name</label>
          <input
            id="title"
            type="text"
            name="title"
            placeholder="e.g., Black Wallet, Silver Watch"
            value={formData.title}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="form-input"
          >
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Documents">Documents</option>
            <option value="Jewelry">Jewelry</option>
            <option value="Keys">Keys</option>
            <option value="Books">Books</option>
            <option value="Bags">Bags</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Describe the item in detail (color, brand, unique features, etc.)"
            value={formData.description}
            onChange={handleChange}
            required
            className="form-input"
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            type="text"
            name="location"
            placeholder="Where was it lost/found?"
            value={formData.location}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="contact">Contact Information</label>
          <input
            id="contact"
            type="text"
            name="contact"
            placeholder="Phone number or email"
            value={formData.contact}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Upload Image</label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="form-input"
          />
          {formData.image && <p className="image-preview">✓ Image selected</p>}
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? "Posting..." : "Post Item"}
        </button>
      </form>
    </section>
  );
}

export default PostItem;
