import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import "./Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/api/auth/login", { email, password });
      login(res.data.token, res.data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left-section">
        <div className="auth-card">
          <span className="auth-brand">LawBridge AI</span>
          <h2>Welcome back</h2>
          <p className="subtitle">
            Access your secure legal workspace with a clear, professional experience built for focused legal guidance.
          </p>

          {error && <p className="auth-error">{error}</p>}

          <form className="auth-form" onSubmit={handleLogin}>
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

            <div className="options">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <span className="forgot">Forgot?</span>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="signup-text">
              Don't have an account?{" "}
              <Link to="/signup" className="link">
                Sign up
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

export default Login;
