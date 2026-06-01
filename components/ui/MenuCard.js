export default function MenuCard({ icon: Icon, title, description, badge, onClick, color = 'primary' }) {
  const colorMap = {
    primary: 'from-primary-800 to-primary-700',
    blue: 'from-blue-700 to-blue-600',
    emerald: 'from-emerald-700 to-emerald-600',
    amber: 'from-amber-600 to-amber-500',
    slate: 'from-slate-700 to-slate-600',
  }

  return (
    <button
      onClick={onClick}
      className={`
        group relative flex flex-col items-start gap-3 p-6 rounded-2xl
        bg-white border border-gray-100 shadow-sm
        hover:shadow-md hover:-translate-y-0.5
        active:translate-y-0 active:shadow-sm
        transition-all duration-200 ease-out
        text-left cursor-pointer w-full
        min-h-[140px]
      `}
    >
      <div className={`
        flex items-center justify-center w-12 h-12 rounded-xl
        bg-gradient-to-br ${colorMap[color] || colorMap.primary}
        text-white shadow-sm
        group-hover:scale-110 transition-transform duration-200
      `}>
        <Icon size={24} strokeWidth={1.5} />
      </div>

      <div className="flex-1">
        <h3 className="text-card-title font-bold text-gray-900 mb-0.5">
          {title}
        </h3>
        {description && (
          <p className="text-card-desc text-gray-500 m-0">
            {description}
          </p>
        )}
      </div>

      {badge != null && (
        <span className="absolute top-3 right-3 inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-100 text-primary-800 min-w-[1.5rem]">
          {badge}
        </span>
      )}

      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-200 group-hover:ring-primary-300 transition-colors duration-200 pointer-events-none" />
    </button>
  )
}
