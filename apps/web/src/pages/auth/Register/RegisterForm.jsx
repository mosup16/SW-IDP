import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

export default function RegisterForm() {
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { signUp } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await signUp({ email, password });
      navigate('/userProfile');
    } catch (err) {
      setError(err.body?.message ?? 'Registration failed. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <header className="register-form-header">
        <h2>Create Identity</h2>

        <p>
          Initialize your secure sovereign credentials.
        </p>
      </header>

      {error && <p style={{ color: 'red', marginBottom: '0.5rem' }}>{error}</p>}
      <form onSubmit={handleSubmit} className="register-form">
        {/* Email */}
        <div>
          <label htmlFor="reg-email">Email Address</label>

          <input
            id="reg-email"
            type="email"
            placeholder="name@organization.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="reg-pw">Password</label>

          <div className="register-password-wrapper">
            <input
              id="reg-pw"
              type={showPw ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              className="register-toggle-password"
              onClick={() => setShowPw((p) => !p)}
            >
              {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="reg-cpw">Confirm Password</label>

          <input
            id="reg-cpw"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {/* Submit */}
        <button type="submit" className="register-btn" disabled={loading}>
          {loading ? 'Registering…' : 'Register'}
        </button>
      </form>

      {/* Login link */}
      <footer className="register-footer">
        <p>
          Already have an account?{' '}
          <Link to="/">Log In</Link>
        </p>
      </footer>
    </>
  );
}