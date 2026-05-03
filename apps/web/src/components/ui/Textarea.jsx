import"../../assets/styles/Textarea.css"
export default function TextareaDemo() {
  return (
    <div className="showcase">
      <label>Description</label>
      <textarea
        className="ghost-textarea"
        placeholder="Read-only access to financial reporting and audit logs."
      ></textarea>
    </div>
  );
}
