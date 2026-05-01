import "../../assets/styles/GhostInput.css";

const GhostInput = ({ label, error, className = "", ...props }) => {
  return (
    <div className="gi-wrap">
      {label && <label className="gi-label">{label}</label>}
      <input
        {...props}
        className={`gi-input ${error ? "gi-error" : ""} ${className}`}
      />
      {error && <span className="gi-error-msg">{error}</span>}
    </div>
  );
};

export default GhostInput;