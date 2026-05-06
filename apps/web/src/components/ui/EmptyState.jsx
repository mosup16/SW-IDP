import "../../assets/styles/EmptyState.scss";

const EmptyState = ({ icon, title, description, action }) => {
  return (
    <div className="es-wrap">
      {icon && <div className="es-icon">{icon}</div>}
      <p className="es-title">{title}</p>
      {description && <p className="es-desc">{description}</p>}
      {action && <div className="es-action">{action}</div>}
    </div>
  );
};

export default EmptyState;