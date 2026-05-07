import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterForm() {
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    // Authentication logic here
    navigate('/userProfile');
  }

  return (
    <>
      <header className="register-form-header">
        <h2>Create Identity</h2>

        <p>
          Initialize your secure sovereign credentials.
        </p>
      </header>

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
        <button type="submit" className="register-btn">
          Register
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