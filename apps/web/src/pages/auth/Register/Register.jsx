import RegisterHeader from './RegisterHeader';
import RegisterForm from './RegisterForm';
import SecurityBadges from './SecurityBadges';
import '../../../assets/styles/Register.css';

export default function Register() {
  return (
    <div className="register-page">
      {/* Decorative blobs */}
      <div className="register-blob register-blob-1" />
      <div className="register-blob register-blob-2" />

      <RegisterHeader />

      {/* Glass card */}
      <main className="register-card">
        <RegisterForm />
      </main>

      <SecurityBadges />
    </div>
  );
}