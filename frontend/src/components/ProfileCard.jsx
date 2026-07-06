import { useState } from "react";
import "../styles/userprofile.css";

function ProfileCard({ user, isOwnProfile, onProfileUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    bio: user.bio || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/profile/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      setIsEditing(false);
      onProfileUpdate();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      bio: user.bio,
    });
    setIsEditing(false);
  };

  return (
    <div className="profile-card">
      <div className="profile-avatar">
        {user.profilePicture ? (
          <img src={user.profilePicture} alt={user.name} />
        ) : (
          <div className="avatar-placeholder">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
        {user.verified && <span className="verified-badge">✓ Verified</span>}
      </div>

      <div className="profile-info">
        {isEditing ? (
          <div className="edit-form">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="edit-input"
            />
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Bio (optional)"
              className="edit-textarea"
              rows="3"
            />
            <div className="edit-buttons">
              <button onClick={handleSave} className="btn-save">Save</button>
              <button onClick={handleCancel} className="btn-cancel">Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <h1 className="profile-name">{user.name}</h1>
            <p className="profile-email">📧 {user.email}</p>
            {user.phone && <p className="profile-phone">📱 {user.phone}</p>}
            {user.bio && <p className="profile-bio">{user.bio}</p>}
            
            {isOwnProfile && (
              <button onClick={() => setIsEditing(true)} className="btn-edit">
                Edit Profile
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ProfileCard;
