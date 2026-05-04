import "../../assets/styles/Select.css"
export default function Select({ ...props }) {
  return (
    <select
      className={"ghost-select"}
      {...props}
    >
      <option value="">All Event Types…</option>
      <option value="admin">Authentication</option>
      <option value="editor">Policy Change</option>
    </select>
  );
}
