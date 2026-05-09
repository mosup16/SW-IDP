import LoginHeader from './LoginHeader';
import LoginForm from './LoginForm';
import LoginFooter from './LoginFooter';
import '../../../assets/styles/Login.css';

export default function Login() {
  return (
    <main className="login-page">
      {/* Decorative blobs */}
      <div className="login-blobs">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
      </div>

      {/* Card */}
      <div className="login-wrapper">
        <LoginHeader />

        <div className="login-card">
          <div className="login-card-top">
            <h2>Secure Access</h2>

            <p>
              Enter your credentials to manage your enterprise identity.
            </p>
          </div>

          <LoginForm />
        </div>

        <LoginFooter />
      </div>

      {/* Decorative bars */}
      <div className="decorative-bars">
        <div className="bar bar-1" />
        <div className="bar bar-2" />
        <div className="bar bar-3" />
      </div>
    </main>
  );
}