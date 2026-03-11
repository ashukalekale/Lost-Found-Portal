import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const name = localStorage.getItem("userName");
    setIsLoggedIn(!!userId);
    setUserName(name || "");
  }, []);

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
        <div className="brand">
          <Link to="/" className="brand-link">
            <span className="brand-logo" aria-hidden>🔍</span>
            <span className="brand-title">Find IT</span>
          </Link>
        </div>
        <nav className="site-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/search" className="nav-link">Search</Link>
          <Link to="/post-item" className="nav-link">Post Item</Link>
          <Link to="/success-stories" className="nav-link">Success Stories</Link>
          
          {isLoggedIn ? (
            <>
              <span className="nav-user">Welcome, {userName}!</span>
              <button onClick={handleLogout} className="nav-link logout-btn">Logout</button>
            </>
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

