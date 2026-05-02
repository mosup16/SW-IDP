import { useState } from "react";

export default function Select({ label, error, options = [], ...props }) {
  const [focused, setFocused] = useState(false);
  const hasValue = props.value !== undefined && props.value !== "";

  return (
    <div className={`ghost-select-wrapper ${focused ? "focused" : ""} ${error ? "has-error" : ""} ${hasValue ? "has-value" : ""}`}>
      {label && (
        <label className="ghost-select-label">
          {label}
        </label>
      )}

      <div className="ghost-select-control">
        <select
          className="ghost-select"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        >
          <option value="">— Select —</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <span className="ghost-select-icon" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>

      {error && (
        <span className="ghost-select-error" role="alert">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <circle cx="6" cy="6" r="5.5" stroke="currentColor"/>
            <path d="M6 3.5V6.5" stroke="currentColor" strokeLinecap="round"/>
            <circle cx="6" cy="8.5" r="0.5" fill="currentColor"/>
          </svg>
          {error}
        </span>
      )}
    </div>
  );
}
