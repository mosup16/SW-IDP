import { Shield, ShieldCheck, ScrollText } from 'lucide-react';

const badges = [
  {
    icon: <Shield size={20} />,
    title: 'Zero Knowledge',
    description:
      'Your credentials are encrypted end-to-end and never stored in plain text.',
  },
  {
    icon: <ShieldCheck size={20} />,
    title: 'Hardware Secured',
    description:
      'Compatible with FIDO2 and physical security keys for maximum protection.',
  },
  {
    icon: <ScrollText size={20} />,
    title: 'Audit Trail',
    description:
      'Full transparency into access logs and identity verification history.',
  },
];

export default function SecurityBadges() {
  return (
    <>
      <div className="security-badges">
        {badges.map(({ icon, title, description }) => (
          <div key={title} className="security-badge">
            <div className="security-icon">
              {icon}
            </div>

            <h3>{title}</h3>

            <p>{description}</p>
          </div>
        ))}
      </div>

      <div className="security-footer">
        © 2024 Sovereign IdP • Protocol Version 4.2.1-SECURE
      </div>
    </>
  );
}