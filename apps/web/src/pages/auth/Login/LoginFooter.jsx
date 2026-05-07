import { BookOpen, CheckCircle2 } from 'lucide-react';

export default function LoginFooter() {
  return (
    <div className="login-footer">
      <a href="#">
        <BookOpen size={14} />
        Documentation
      </a>

      <span className="footer-dot" />

      <a href="#">
        <CheckCircle2 size={14} className="status-icon" />
        System Status
      </a>
    </div>
  );
}