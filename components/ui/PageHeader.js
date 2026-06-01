import { ChevronRight } from 'lucide-react'

export default function PageHeader({ title, subtitle, breadcrumbs, action }) {
  return (
    <div className="mb-6">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-sm mb-2">
          {breadcrumbs.map((item, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight size={14} className="text-slate-400" />}
              <span className={
                i === breadcrumbs.length - 1
                  ? 'text-slate-900 font-semibold'
                  : 'text-slate-500'
              }>
                {item}
              </span>
            </span>
          ))}
        </nav>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{title}</h1>
          {subtitle && (
            <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
          )}
        </div>
        {action && (
          <div className="flex items-center gap-2">{action}</div>
        )}
      </div>
    </div>
  )
}
