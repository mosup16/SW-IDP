import { ShieldCheck } from 'lucide-react';

export default function LoginHeader() {
  return (
    <div className="login-header">
      <div className="logo-box">
        <ShieldCheck size={28} />
      </div>

      <h1>Sovereign IdP</h1>

      <p>Identity Provisioning &amp; Governance</p>
    </div>
  );
}