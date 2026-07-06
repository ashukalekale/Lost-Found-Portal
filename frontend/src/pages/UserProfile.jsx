import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProfileCard from "../components/ProfileCard";
import UserStats from "../components/UserStats";
import UserItemsList from "../components/UserItemsList";
import "../styles/userprofile.css";

function UserProfile() {
  const { userId } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/users/profile/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }
      const data = await response.json();
      setProfileData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="user-profile-container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-profile-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="user-profile-container">
        <div className="error">User not found</div>
      </div>
    );
  }

  const isOwnProfile = currentUserId === userId;

  return (
    <div className="user-profile-container">
      <div className="profile-header">
        <ProfileCard 
          user={profileData.user} 
          isOwnProfile={isOwnProfile}
          onProfileUpdate={fetchUserProfile}
        />
      </div>

      <div className="profile-stats-section">
        <h2>Activity Stats</h2>
        <UserStats stats={profileData.stats} />
      </div>

      <div className="profile-items-section">
        <h2>Posted Items</h2>
        <UserItemsList
          items={profileData.items}
          isOwnProfile={isOwnProfile}
          onItemStatusChange={async (itemId, newStatus) => {
            try {
              const userId = localStorage.getItem("userId");
              const res = await fetch(`http://localhost:5000/api/items/${itemId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus, userId }),
              });
              if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Failed to update item status");
              }
              // refresh profile data
              fetchUserProfile();
            } catch (err) {
              console.error("Error updating status:", err);
              alert("Could not update item status: " + err.message);
            }
          }}
        />
      </div>
    </div>
  );
}

export default UserProfile;
