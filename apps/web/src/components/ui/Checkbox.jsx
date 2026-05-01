import "./Checkbox.css";

const Checkbox = ({ label, description, className = "", ...props }) => {
  return (
    <label className={`cb-wrap ${props.disabled ? "cb-disabled" : ""} ${className}`}>
      <span className="cb-indicator">
        <input
          type="checkbox"
          {...props}
          className="cb-input"
        />
        <span className={`cb-box ${props.checked ? "cb-checked" : ""}`}>
          {props.checked && (
            <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
              <path
                d="M1 4L4.5 7.5L10 1"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
      </span>

      {(label || description) && (
        <span className="cb-text">
          {label && <span className="cb-label">{label}</span>}
          {description && <span className="cb-desc">{description}</span>}
        </span>
      )}
    </label>
  );
};

export default Checkbox;