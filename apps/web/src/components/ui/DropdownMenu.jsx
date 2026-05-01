import { useState, useEffect, useRef } from "react";
import "../../assets/styles/DropdownMenu.css";

const DropdownMenu = ({ trigger, items, align = "start" }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={ref} className="dd-root">
      <div className="dd-trigger" onClick={() => setOpen((v) => !v)}>
        {trigger}
      </div>

      <div
        className={`dd-menu ${open ? "dd-open" : ""} ${align === "end" ? "dd-align-end" : ""}`}
      >
        {items.map((item, i) => (
          <button
            key={i}
            className={`dd-item ${item.destructive ? "dd-destructive" : ""}`}
            onClick={() => {
              item.onSelect();
              setOpen(false);
            }}
          >
            {item.icon && <span className="dd-item-icon">{item.icon}</span>}
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DropdownMenu;