import { useState } from 'react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginForm() {
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    // Authentication logic here
    navigate('/userProfile');
  }

  return (
    <form onSubmit={handleSubmit} className="login-form">
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
      <button type="submit" className="login-btn">
        Log In <ArrowRight size={18} />
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