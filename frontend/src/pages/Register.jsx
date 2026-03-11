import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("userName", data.user.name);
        navigate("/");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      alert("Error registering: " + error.message);
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
          <p className="hero-desc">Share found items, report missing belongings and connect with campus members quickly.</p>
        </aside>

        <div className="auth-right">
          <div className="auth-card">
            <div className="small-logo">LF</div>
            <h2>Create account</h2>
            <p className="lead">Sign up to get started</p>

            <form onSubmit={handleRegister} aria-label="Register form">
              <label htmlFor="name">Full name</label>
              <input id="name" placeholder="Jane Doe" value={name}
                onChange={(e) => setName(e.target.value)} required />

              <label htmlFor="email">Email</label>
              <input id="email" type="email" placeholder="you@example.com" value={email}
                onChange={(e) => setEmail(e.target.value)} required />

              <label htmlFor="phone">Phone (optional)</label>
              <input id="phone" type="tel" placeholder="Your phone number" value={phone}
                onChange={(e) => setPhone(e.target.value)} />

              <label htmlFor="password">Password</label>
              <input id="password" type="password" placeholder="Choose a strong password" value={password}
                onChange={(e) => setPassword(e.target.value)} required />

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Registering..." : "Register"}
                </button>
              </div>
            </form>

            <p style={{textAlign:'center',marginTop:'1rem'}}>
              Already registered? <Link to="/login">Login here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;