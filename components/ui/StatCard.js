import { motion } from 'framer-motion'

export default function StatCard({ icon: Icon, label, value, sublabel, color = 'brand' }) {
  const colorMap = {
    brand: 'bg-brand-50 text-brand-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    blue: 'bg-blue-50 text-blue-700',
    red: 'bg-red-50 text-red-700',
    slate: 'bg-slate-100 text-slate-600',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-slate-200 shadow-card p-5 flex items-center gap-4"
    >
      {Icon && (
        <div className={`flex items-center justify-center w-11 h-11 rounded-lg ${colorMap[color] || colorMap.brand}`}>
          <Icon size={20} strokeWidth={1.5} />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
        <p className="text-xl font-bold text-slate-900 mt-0.5 truncate">{value}</p>
        {sublabel && (
          <p className="text-xs text-slate-400 mt-0.5">{sublabel}</p>
        )}
      </div>
    </motion.div>
  )
}
