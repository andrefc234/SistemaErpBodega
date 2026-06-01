import { ChevronRight } from 'lucide-react'

export default function Card({
  title,
  subtitle,
  action,
  children,
  className = '',
}) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-card ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            {title && (
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
            )}
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  )
}

export function CardBreadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-1.5 text-sm mb-4">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight size={14} className="text-slate-400" />}
          <span className={i === items.length - 1 ? 'text-slate-900 font-semibold' : 'text-slate-500'}>
            {item}
          </span>
        </span>
      ))}
    </nav>
  )
}
