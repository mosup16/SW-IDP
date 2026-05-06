import { useState } from "react";
export function Switch({ checked, onCheckedChange, label, disabled, id, ariaLabel }) {
  return (
    <div className="d-flex align-items-center gap-2">
      <div onClick={() => !disabled && onCheckedChange(!checked)} style={{width: "40px",height: "22px",borderRadius: "999px",background: checked? "var(--status-active)": "var(--border)",position: "relative",cursor: disabled ? "not-allowed" : "pointer",transition: "0.2s",opacity: disabled ? 0.5 : 1}}>
        <div style={{width: "16px",height: "16px",borderRadius: "50%",background: "#fff",position: "absolute",top: "3px",left: checked ? "21px" : "3px",transition: "0.2s"}}/>
      </div>
      {label && (
        <label htmlFor={id} className="mb-0" style={{fontSize: "13px",color: "var(--text-body)",cursor: "pointer"}}>
          {label}
        </label>
      )}
    </div>
  );
}
export default function SwitchDemo() {
  const [sw1, setSw1] = useState(true);
  const [sw2, setSw2] = useState(false);
  const [sw3, setSw3] = useState(true);
  return (
    <div className="container py-5">
      <div className="row g-3">
        <div className="col-auto">
          <div className="card p-3 d-flex flex-column gap-3">
            <Switch id="s1" checked={sw1} onCheckedChange={setSw1} label="openid" />
            <Switch id="s2" checked={sw2} onCheckedChange={setSw2} label="profile" />
            <Switch id="s3" checked={sw3} onCheckedChange={setSw3} label="email" />
          </div>
        </div>
        <div className="col-auto">
          <div className="card p-3 d-flex flex-column gap-3">
            <Switch id="s4" checked={true} onCheckedChange={() => {}} label="Checked" />
            <Switch id="s5" checked={false} onCheckedChange={() => {}} label="Disabled Off" disabled />
          </div>
        </div>
        <div className="col-auto">
          <div className="card p-3">
            <p className="fw-semibold mb-2">Maintenance Mode</p>
            <Switch id="s6" checked={false} onCheckedChange={() => {}} label="Enable"/>
          </div>
        </div>
      </div>
    </div>
  );
}
