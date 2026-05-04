// ========================
// Signup Page
// ========================
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { signupAPI } = await import("../services/api");
      await signupAPI(form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="page-signup" className="page active">
      <div className="auth-page">
        <div className="auth-left">
          <div className="auth-left-bg"></div>
          <div className="auth-left-content">
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚀</div>
            <h2>Start understanding code faster</h2>
            <p>Join 12,000+ developers who use Codebase AI to navigate unfamiliar codebases.</p>
            <div className="auth-stats">
              <div className="auth-stat"><div className="auth-stat-num">Free</div><div className="auth-stat-label">Forever plan</div></div>
              <div className="auth-stat"><div className="auth-stat-num">No CC</div><div className="auth-stat-label">Required</div></div>
              <div className="auth-stat"><div className="auth-stat-num">2 min</div><div className="auth-stat-label">Setup time</div></div>
              <div className="auth-stat"><div className="auth-stat-num">AI</div><div className="auth-stat-label">Powered</div></div>
            </div>
          </div>
        </div>
        <div className="auth-right">
          <div className="auth-form-box">
            <div className="auth-form-logo">
              <div className="auth-form-logo-icon">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="white"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              </div>
              Codebase AI
            </div>
            <h1>Create account</h1>
            <p className="subtitle">Already have one? <Link to="/login">Sign in →</Link></p>
            
            {error && (
              <div className="form-error show">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full name</label>
                <input 
                  type="text" 
                  name="name"
                  className="form-input" 
                  placeholder="John Doe" 
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email address</label>
                <input 
                  type="email" 
                  name="email"
                  className="form-input" 
                  placeholder="you@company.com" 
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    className="form-input" 
                    style={{ paddingRight: '44px' }}
                    placeholder="Min. 8 characters" 
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--ink3)',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--ink)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--ink3)'}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--ink3)', marginBottom: '20px', lineHeight: '1.6' }}>
                By creating an account, you agree to our <a href="#" style={{ color: 'var(--brand)' }}>Terms of Service</a> and <a href="#" style={{ color: 'var(--brand)' }}>Privacy Policy</a>.
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '13px' }}>
                {loading ? "Creating account..." : "Create free account →"}
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
              <div style={{ flex: '1', height: '1px', background: 'var(--border)' }}></div>
              <span style={{ fontSize: '12px', color: 'var(--ink3)' }}>or</span>
              <div style={{ flex: '1', height: '1px', background: 'var(--border)' }}></div>
            </div>
            <button className="btn btn-ghost" style={{ width: '100%' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign up with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
