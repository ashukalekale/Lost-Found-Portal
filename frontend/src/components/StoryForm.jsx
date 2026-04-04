import { useState } from "react";
import "../styles/storyForm.css";

function StoryForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    testimonial: "",
    image: null,
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please login to share your success story");
      return;
    }

    if (!formData.title || !formData.description) {
      alert("Please fill in all required fields");
      return;
    }

    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("description", formData.description);
    submitData.append("testimonial", formData.testimonial);
    submitData.append("postedBy", userId);
    if (formData.image) {
      submitData.append("image", formData.image);
    }

    try {
      const response = await fetch("http://localhost:5000/api/stories", {
        method: "POST",
        body: submitData,
      });

      const contentType = response.headers.get("content-type") || "";
      let responseBody;

      if (contentType.includes("application/json")) {
        responseBody = await response.json();
      } else {
        responseBody = await response.text();
      }

      if (response.ok) {
        alert("Success story posted!");
        setFormData({ title: "", description: "", testimonial: "", image: null });
        onSubmit();
      } else {
        console.error("Story post failed", response.status, responseBody);
        const message = typeof responseBody === "object" ? responseBody.message : responseBody;
        alert(`Failed to post story: ${message}`);
      }
    } catch (error) {
      console.error("Error posting story:", error);
      alert("Error posting story: " + error.message);
    }
  };

  return (
    <div className="story-form-container">
      <form className="story-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Story Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="e.g., Found My Lost Wallet!"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">What Happened? *</label>
          <textarea
            id="description"
            name="description"
            placeholder="Describe your success story..."
            rows="4"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="testimonial">Your Testimonial</label>
          <textarea
            id="testimonial"
            name="testimonial"
            placeholder="How did this platform help you?"
            rows="3"
            value={formData.testimonial}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Upload Image</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleInputChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Share Story
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default StoryForm;
