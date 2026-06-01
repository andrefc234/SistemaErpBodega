const statusStyles = {
  pendiente: 'bg-amber-50 text-amber-700 border-amber-200',
  liberado: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  completado: 'bg-blue-50 text-blue-700 border-blue-200',
  cancelado: 'bg-red-50 text-red-700 border-red-200',
  activo: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  inactivo: 'bg-slate-100 text-slate-500 border-slate-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  error: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
}

const dotColors = {
  pendiente: 'bg-amber-500',
  liberado: 'bg-emerald-500',
  completado: 'bg-blue-500',
  cancelado: 'bg-red-500',
  activo: 'bg-emerald-500',
  inactivo: 'bg-slate-400',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
}

export default function Badge({ status = 'info', children, className = '' }) {
  const label = children || status.charAt(0).toUpperCase() + status.slice(1)
  const style = statusStyles[status] || statusStyles.info
  const dot = dotColors[status] || 'bg-slate-400'

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${style} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  )
}
