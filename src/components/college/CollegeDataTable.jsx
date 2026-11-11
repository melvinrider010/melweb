import React from 'react';

/**
 * CollegeDataTable
 * Responsive, accessible academic data table component inspired by Metronic Table primitives.
 * Standardizes tabular representations of qualifications, curriculum outlines, papers, and regulations.
 * 
 * @param {Array<{ header: string, accessor?: string, cell?: (row: any, index: number) => React.ReactNode, className?: string, headerClassName?: string, width?: string }>} columns
 * @param {Array<any>} data - Array of row objects
 * @param {string} caption - Optional accessibility caption for screen readers
 * @param {boolean} striped - Alternate row background shading (default: false)
 * @param {boolean} hoverable - Highlight row on hover (default: true)
 * @param {boolean} bordered - Outer border on table (default: true)
 * @param {string | React.ReactNode} emptyMessage - Message when data array is empty (default: 'No records available.')
 * @param {string} className - Additional table wrapper classes
 */
export default function CollegeDataTable({
  columns = [],
  data = [],
  caption,
  striped = false,
  hoverable = true,
  bordered = true,
  emptyMessage = 'No records available.',
  className = ''
}) {
  if (!columns || columns.length === 0) return null;

  return (
    <div 
      className={`relative w-full overflow-x-auto rounded-xl ${
        bordered ? 'border border-slate-200/90 shadow-2xs' : ''
      } ${className}`}
    >
      <table className="w-full caption-bottom text-slate-700 text-xs sm:text-sm font-sans border-collapse">
        {caption && (
          <caption className="mt-2 text-xs text-slate-400 text-left px-4 italic font-sans">
            {caption}
          </caption>
        )}

        {/* Table Header */}
        <thead className="bg-slate-50/90 border-b border-slate-200">
          <tr>
            {columns.map((col, cIdx) => (
              <th
                key={col.header || cIdx}
                scope="col"
                style={col.width ? { width: col.width } : undefined}
                className={`h-11 px-4 text-left align-middle font-mono font-semibold text-xs uppercase tracking-wider text-slate-600 select-none ${col.headerClassName || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-slate-100 bg-white">
          {data.length === 0 ? (
            <tr>
              <td 
                colSpan={columns.length} 
                className="p-8 text-center text-xs text-slate-400 italic"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rIdx) => {
              const rowBg = striped && rIdx % 2 === 1 ? 'bg-slate-50/50' : 'bg-white';
              const hoverStyle = hoverable ? 'hover:bg-blue-50/40 transition-colors duration-150' : '';

              return (
                <tr 
                  key={row.id || rIdx} 
                  className={`${rowBg} ${hoverStyle}`}
                >
                  {columns.map((col, cIdx) => {
                    let cellContent = null;
                    if (typeof col.cell === 'function') {
                      cellContent = col.cell(row, rIdx);
                    } else if (col.accessor) {
                      cellContent = row[col.accessor] ?? '—';
                    }

                    return (
                      <td
                        key={col.header || cIdx}
                        className={`p-4 align-middle leading-relaxed text-sm text-slate-700 ${col.className || ''}`}
                      >
                        {cellContent}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
