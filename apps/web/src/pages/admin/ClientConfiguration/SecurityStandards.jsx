import { ShieldCheck } from "lucide-react";

const rows = [
  { num: "01", badge: "https://", isBadge: true },
  { num: "02", label: "OAuth 2.1" },
  { num: "03", label: "Sovereign IdP" },
];

export default function SecurityStandards() {
  return (
    <div className="cc-security-card rounded-4 p-4 mb-3 text-white">
      <div className="d-flex align-items-center gap-2 mb-4">
        <ShieldCheck size={22} color="white" />
        <h3 className="fs-6 fw-bold mb-0">Security Standards</h3>
      </div>
      {rows.map((row, i) => (
        <div
          key={i}
          className={`d-flex justify-content-between align-items-center py-3 ${i > 0 ? "cc-security-row--bordered" : ""}`}
        >
          <span className="fw-bold text-primary">{row.num}</span>
          {row.isBadge
            ? <span className="cc-https-badge">{row.badge}</span>
            : <span className="small fw-semibold opacity-75">{row.label}</span>}
        </div>
      ))}
    </div>
  );
}