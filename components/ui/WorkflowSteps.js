import { motion } from 'framer-motion'

const steps = [
  { key: 'visita', label: 'Visita', icon: '📋' },
  { key: 'pedido', label: 'Pedido', icon: '📦' },
  { key: 'liquidacion', label: 'Liquidación', icon: '💰' },
  { key: 'factura', label: 'Facturación', icon: '🧾' },
]

export default function WorkflowSteps({ current, status = {} }) {
  const currentIdx = steps.findIndex(s => s.key === current)

  return (
    <div className="flex items-center gap-0 w-full">
      {steps.map((step, i) => {
        const isCompleted = i < currentIdx
        const isCurrent = i === currentIdx
        const stepStatus = status[step.key]

        let circleClass = 'bg-slate-200 text-slate-400 border-slate-200'
        let lineClass = 'bg-slate-200'
        let labelClass = 'text-slate-400'

        if (isCompleted) {
          circleClass = 'bg-emerald-500 text-white border-emerald-500'
          lineClass = 'bg-emerald-500'
          labelClass = 'text-emerald-700'
        } else if (isCurrent) {
          circleClass = 'bg-brand-700 text-white border-brand-700 ring-2 ring-brand-200'
          labelClass = 'text-brand-700 font-semibold'
        }

        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <motion.div
                initial={isCurrent ? { scale: 0.8 } : false}
                animate={isCurrent ? { scale: 1 } : false}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${circleClass}`}
              >
                {isCompleted ? '✓' : i + 1}
              </motion.div>
              <span className={`text-[11px] text-center leading-tight max-w-[70px] ${labelClass}`}>
                {step.label}
              </span>
              {stepStatus && (
                <span className="text-[10px] text-slate-400 -mt-0.5 capitalize">{stepStatus}</span>
              )}
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mt-[-18px] ${lineClass}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
