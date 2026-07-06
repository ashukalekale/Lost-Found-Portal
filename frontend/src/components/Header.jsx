import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const updateLoginStatus = () => {
      const uid = localStorage.getItem("userId");
      const name = localStorage.getItem("userName");
      const email = localStorage.getItem("userEmail");
      setIsLoggedIn(!!uid);
      setUserName(name || "");
      setUserEmail(email || "");
      setUserId(uid || "");
    };

    updateLoginStatus();

    window.addEventListener("storage", updateLoginStatus);
    window.addEventListener("authChange", updateLoginStatus);

    return () => {
      window.removeEventListener("storage", updateLoginStatus);
      window.removeEventListener("authChange", updateLoginStatus);
    };
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const handleMenuItemClick = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const isActivePath = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    window.location.href = "/login";
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="brand-group">
          <div className="brand">
            <Link to="/" className="brand-link">
              <span className="brand-logo" aria-hidden>🔍</span>
              <span className="brand-title">Find IT</span>
            </Link>
          </div>
          <button
            className="theme-toggle"
            onClick={handleThemeToggle}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            <span className="theme-toggle-icon">{theme === "light" ? "🌙" : "☀️"}</span>
            <span className="theme-toggle-label">{theme === "light" ? "Dark" : "Light"}</span>
          </button>
        </div>
        <nav className="site-nav">
          <Link to="/" className={`nav-link ${isActivePath("/") ? "active" : ""}`}>Home</Link>
          <Link to="/search" className={`nav-link ${isActivePath("/search") ? "active" : ""}`}>Search</Link>
          <Link to="/post-item" className={`nav-link ${isActivePath("/post-item") ? "active" : ""}`}>Post Item</Link>
          <Link to="/success-stories" className={`nav-link ${isActivePath("/success-stories") ? "active" : ""}`}>Success Stories</Link>
          
          {isLoggedIn ? (
            <div className="menu-container" ref={menuRef}>
              <button 
                className="menu-toggle"
                onClick={() => setMenuOpen(!menuOpen)}
                title="Menu"
              >
                ☰
              </button>

              {menuOpen && (
                <div className="menu-dropdown">
                  {/* Profile Section */}
                  <div className="menu-profile-section">
                    <div className="menu-avatar">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="menu-user-info">
                      <p className="menu-user-name">{userName}</p>
                      <p className="menu-user-email">{userEmail}</p>
                    </div>
                  </div>

                  <hr className="menu-divider" />

                  {/* Navigation Links */}
                  <div className="menu-section">
                    <p className="menu-section-title">Navigation</p>
                    <button className={`menu-item ${isActivePath("/") ? "active" : ""}`} onClick={() => handleMenuItemClick("/")}>
                      🏠 Home
                    </button>
                    <button className={`menu-item ${isActivePath("/search") ? "active" : ""}`} onClick={() => handleMenuItemClick("/search")}>
                      🔍 Search Items
                    </button>
                    <button className={`menu-item ${isActivePath("/post-item") ? "active" : ""}`} onClick={() => handleMenuItemClick("/post-item")}>
                      📝 Post Item
                    </button>
                    <button className={`menu-item ${isActivePath("/success-stories") ? "active" : ""}`} onClick={() => handleMenuItemClick("/success-stories")}>
                      ⭐ Success Stories
                    </button>
                  </div>

                  <hr className="menu-divider" />

                  {/* User Section */}
                  <div className="menu-section">
                    <p className="menu-section-title">Account</p>
                    <button className="menu-item" onClick={() => handleMenuItemClick(`/profile/${userId}`)}>
                      👤 My Profile
                    </button>
                    <button className="menu-item" onClick={() => alert("Settings coming soon!")}>
                      ⚙️ Settings
                    </button>
                  </div>

                  <hr className="menu-divider" />

                  {/* Info Section */}
                  <div className="menu-section">
                    <p className="menu-section-title">Help & Info</p>
                    <button className="menu-item" onClick={() => handleMenuItemClick("/help")}>
                      ❓ Help & FAQ
                    </button>
                    <button className="menu-item" onClick={() => handleMenuItemClick("/about")}>
                      📱 About
                    </button>
                    <button className="menu-item" onClick={handleThemeToggle}>
                      🌙 {theme === "light" ? "Dark" : "Light"} Mode
                    </button>
                  </div>

                  <hr className="menu-divider" />

                  {/* Logout */}
                  <button className="menu-item logout" onClick={handleLogout}>
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link cta">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

