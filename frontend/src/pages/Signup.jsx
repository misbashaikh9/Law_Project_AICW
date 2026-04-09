import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Auth.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (event) => {
    event.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await API.post("/api/auth/signup", { name, email, password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left-section">
        <div className="auth-card">
          <span className="auth-brand">LawBridge AI</span>
          <h2>Create your account</h2>
          <p className="subtitle">
            Join a secure legal platform designed with a more formal presentation and minimal visual distraction.
          </p>

          {error && <p className="auth-error">{error}</p>}

          <form className="auth-form" onSubmit={handleSignup}>
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Signing up..." : "Sign Up"}
            </button>

            <p className="signup-text">
              Already have an account?{" "}
              <Link to="/login" className="link">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>

      <div className="auth-right-section">
        <span className="auth-eyebrow">Professional Legal Support</span>
        <h1>
          Justice begins with <span>clarity.</span>
        </h1>
        <p>
          LawBridge AI presents legal information in a calm, structured environment designed to support trust, confidentiality, and sound decision-making.
        </p>
        <div className="auth-highlights">
          <span className="auth-highlight">Confidential access to your legal assistant</span>
          <span className="auth-highlight">Clear, reliable guidance for everyday legal questions</span>
          <span className="auth-highlight">A presentation style suited to professional legal services</span>
        </div>
      </div>
    </div>
  );
};

export default Signup;
