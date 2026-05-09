import { useState } from 'react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

export default function LoginForm() {
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [search] = useSearchParams();
  const { signIn } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn({ email, password });

      const clientId = search.get('client_id');
      if (clientId) {
        const params = new URLSearchParams({
          client_id: clientId,
          redirect_uri: search.get('redirect_uri') ?? '',
          response_type: search.get('response_type') ?? 'code',
          state: search.get('state') ?? '',
        });
        window.location.assign(`/oauth/authorize?${params}`);
        return;
      }
      navigate('/userProfile');
    } catch (err) {
      setError(err.status === 403 ? 'Account is disabled.' : 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="login-form">
      {error && <p style={{ color: 'red', marginBottom: '0.5rem' }}>{error}</p>}
      {/* Email */}
      <div>
        <label htmlFor="login-email">Email Address</label>

        <input
          id="login-email"
          type="email"
          placeholder="name@organization.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {/* Password */}
      <div>
        <div className="password-top">
          <label htmlFor="login-pw">Password</label>

          <a href="#">Forgot?</a>
        </div>

        <div className="password-wrapper">
          <input
            id="login-pw"
            type={showPw ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPw((p) => !p)}
          >
            {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Submit */}
      <button type="submit" className="login-btn" disabled={loading}>
        {loading ? 'Signing in…' : <><span>Log In</span> <ArrowRight size={18} /></>}
      </button>

      {/* Register */}
      <div className="register-box">
        <p>
          Don't have an account?
          <Link to="/register">Register</Link>
        </p>
      </div>
    </form>
  );
}