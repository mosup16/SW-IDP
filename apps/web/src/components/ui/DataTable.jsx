import "../../assets/styles/DataTable.css";

const DataTable = ({ columns, rows, rowKey, empty, onRowClick }) => {
  if (!rows || rows.length === 0) {
    return empty
      ? <div>{empty}</div>
      : <div className="dt-empty">No data available.</div>;
  }

  const alignClass = (align) =>
    align === "right" ? "align-right" : align === "center" ? "align-center" : "";

  return (
    <div className="dt-container">
      <table className="dt-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`dt-th ${alignClass(col.align)} ${col.className || ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              className={`dt-tr ${onRowClick ? "clickable" : ""}`}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`dt-td ${alignClass(col.align)} ${col.className || ""}`}
                >
                  {col.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;