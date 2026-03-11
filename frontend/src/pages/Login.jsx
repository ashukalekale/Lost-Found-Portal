import { useState, useEffect } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // If already logged in, skip the login page
  if (localStorage.getItem("userId")) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("userName", data.user.name);
        localStorage.setItem("userEmail", data.user.email);
        navigate("/");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      alert("Error logging in: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-split">
        <aside className="auth-left">
          <div className="auth-decor" aria-hidden></div>
          <h1 className="hero-title">Adventure starts here</h1>
          <div className="hero-sub">Create and account to Join Our Community</div>
          <p className="hero-desc">Fast, easy posting for lost and found items across campus. Reach people instantly.</p>
        </aside>

        <div className="auth-right">
          <div className="auth-card">
            <div className="small-logo">LF</div>
            <h2>Welcome back</h2>
            <p className="lead">Sign in to your account</p>

            <form onSubmit={handleLogin} aria-label="Login form">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" placeholder="Enter your email" value={email}
                onChange={(e) => setEmail(e.target.value)} required />

              <label htmlFor="password">Password</label>
              <input id="password" type="password" placeholder="Enter password" value={password}
                onChange={(e) => setPassword(e.target.value)} required />

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </button>
              </div>
            </form>

            <p style={{textAlign:'center',marginTop:'1rem'}}>
              <Link to="/register">Create Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;