import "../../assets/styles/StatusBadge.css";

export function StatusBadge({ tone = "neutral", children, style }) {
  return (
    <span className={`status-badge ${tone}`} style={style}>
      <span className="status-badge-dot" />
      {children}
    </span>
  );
}
export default function StatusBadgeDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, margin: "150px auto" }}>
      {[
        { tone: "success", label: "Active",    background: "var(--status-active-bg)",  color: "var(--status-active)" },
        { tone: "neutral", label: "Disabled",  background: "var(--badge-disabled-bg)", color: "var(--badge-disabled-text)" },
        { tone: "neutral", label: "Draft",     background: "var(--badge-disabled-bg)", color: "var(--badge-disabled-text)" },
        { tone: "info",    label: "Enforced",  background: "var(--badge-active-bg)",   color: "var(--badge-active-text)"   },
        { tone: "success", label: "Success",   background: "var(--status-active-bg)",  color: "var(--status-active)"  },
        { tone: "error",   label: "Failed",    background: "var(--status-error-bg)",   color: "var(--status-error-text)"   },
      ].map((r) => (
        <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <StatusBadge tone={r.tone} style={{ background: r.background, color: r.color}}>
            {r.label}
          </StatusBadge>
        </div>
      ))}
    </div>
  );
}
