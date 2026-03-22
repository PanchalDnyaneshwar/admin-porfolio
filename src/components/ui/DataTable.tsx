import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface Column<T> {
  header: string;
  accessor?: keyof T;
  render?: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
}

const DataTable = <T,>({ data, columns, rowKey }: DataTableProps<T>) => (
  <div className="overflow-x-auto rounded-2xl border border-slate-800/80">
    <table className="min-w-full divide-y divide-slate-800/80 text-sm">
      <thead className="bg-slate-900/80 text-left text-xs uppercase tracking-wide text-slate-400">
        <tr>
          {columns.map((column) => (
            <th key={column.header} className={cn('px-4 py-3', column.className)}>
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-900/70 bg-slate-950/40">
        {data.map((row) => (
          <tr key={rowKey(row)} className="hover:bg-slate-900/50">
            {columns.map((column) => (
              <td key={column.header} className={cn('px-4 py-3 align-top', column.className)}>
                {column.render
                  ? column.render(row)
                  : column.accessor
                    ? String(row[column.accessor] ?? '—')
                    : null}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default DataTable;
