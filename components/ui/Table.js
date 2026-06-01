import { Inbox } from 'lucide-react'
import Button from './Button'

export default function Table({
  headers,
  rows,
  keyExtractor,
  renderRow,
  emptyMessage = 'No hay datos',
  emptyAction,
  className = '',
}) {
  if (!rows || rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <Inbox size={28} className="text-slate-400" />
        </div>
        <p className="text-base font-semibold text-slate-700 mb-1">{emptyMessage}</p>
        <p className="text-sm text-slate-500 mb-4">Comienza agregando un nuevo registro</p>
        {emptyAction && emptyAction}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            {headers.map((header, i) => (
              <th
                key={i}
                className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row, i) => (
            <tr
              key={keyExtractor ? keyExtractor(row, i) : i}
              className="hover:bg-slate-50 transition-colors duration-100"
            >
              {renderRow(row, i)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Td({ children, className = '' }) {
  return (
    <td className={`px-6 py-4 text-sm text-slate-700 ${className}`}>
      {children}
    </td>
  )
}

export function Th({ children, className = '' }) {
  return (
    <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 ${className}`}>
      {children}
    </th>
  )
}
