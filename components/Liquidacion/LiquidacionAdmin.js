import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  DollarSign, Package, Calendar, Search, RotateCcw,
  X, ChevronRight, TrendingUp, Filter,
} from 'lucide-react'
import { useNotify } from '../../context/NotificationContext'
import Button from '../ui/Button'
import Table, { Th, Td } from '../ui/Table'

function formatCurrency(n) {
  return '$ ' + (n || 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatNumber(n) {
  return (n || 0).toLocaleString('es-MX')
}

function todayStr() {
  const d = new Date()
  return d.toISOString().slice(0, 10)
}

function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

function monthStart() {
  const d = new Date()
  d.setDate(1)
  return d.toISOString().slice(0, 10)
}

const presets = [
  { label: 'Hoy', from: todayStr, to: todayStr },
  { label: '7 días', from: () => daysAgo(7), to: todayStr },
  { label: '30 días', from: () => daysAgo(30), to: todayStr },
  { label: 'Este mes', from: monthStart, to: todayStr },
]

export default function LiquidacionAdmin({ user }) {
  const notify = useNotify()
  const [from, setFrom] = useState(daysAgo(7))
  const [to, setTo] = useState(todayStr())
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [detailItem, setDetailItem] = useState(null)

  const fetchData = useCallback(async (f, t) => {
    setLoading(true)
    setData(null)
    try {
      const params = new URLSearchParams()
      if (f) params.set('from', f)
      if (t) params.set('to', t)
      const res = await fetch(`/api/liquidacion?${params}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Error al consultar')
      setData(json)
    } catch (err) {
      notify(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }, [notify])

  useEffect(() => {
    fetchData(from, to)
  }, [])

  const handlePreset = (fn) => {
    const f = fn.from()
    const t = fn.to()
    setFrom(f)
    setTo(t)
    fetchData(f, t)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    fetchData(from, to)
  }

  const handleClear = () => {
    setFrom('')
    setTo('')
    fetchData('', '')
  }

  const totals = data?.totals || { montoFactura: 0, piezasEntregadas: 0 }
  const rows = data?.data || []
  const count = data?.count || 0

  const summaryCards = [
    { icon: DollarSign, label: 'Total Facturado', value: formatCurrency(totals.montoFactura), color: 'bg-green-50 text-green-700' },
    { icon: Package, label: 'Piezas Entregadas', value: formatNumber(totals.piezasEntregadas), color: 'bg-blue-50 text-blue-700' },
    { icon: TrendingUp, label: 'Liquidaciones', value: formatNumber(count), color: 'bg-brand-50 text-brand-700' },
  ]

  return (
    <div className="space-y-6">
      {/* Filter bar */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-card p-4 sm:p-5">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Desde
            </label>
            <input
              type="date"
              value={from}
              onChange={e => setFrom(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-700
                focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500
                transition-shadow"
            />
          </div>
          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Hasta
            </label>
            <input
              type="date"
              value={to}
              onChange={e => setTo(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-700
                focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500
                transition-shadow"
            />
          </div>
          <div className="flex items-center gap-1.5 pb-0.5">
            {presets.map(p => (
              <button
                key={p.label}
                type="button"
                onClick={() => handlePreset(p)}
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200
                  text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 pb-0.5">
            <Button type="submit" variant="primary" size="sm" icon={Search} disabled={loading}>
              Consultar
            </Button>
            {(from || to) && (
              <Button type="button" variant="ghost" size="sm" icon={RotateCcw} onClick={handleClear}>
                Limpiar
              </Button>
            )}
          </div>
        </div>
      </form>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {summaryCards.map(card => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-slate-200 shadow-card p-5 flex items-center gap-4"
          >
            <div className={`flex items-center justify-center w-11 h-11 rounded-lg ${card.color}`}>
              <card.icon size={20} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{card.label}</p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">{card.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="flex items-center gap-3 text-slate-400">
            <div className="w-5 h-5 rounded-full border-2 border-slate-300 border-t-brand-500 animate-spin" />
            <span className="text-sm">Consultando...</span>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && data && rows.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <Filter size={24} className="text-slate-400" />
          </div>
          <h3 className="text-sm font-semibold text-slate-700 mb-1">Sin resultados</h3>
          <p className="text-xs text-slate-500 max-w-xs">
            No se encontraron liquidaciones en el rango de fechas seleccionado. Intenta ampliar la búsqueda.
          </p>
        </div>
      )}

      {/* Table */}
      {!loading && data && rows.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
          <Table>
            <thead>
              <tr>
                <Th>#</Th>
                <Th>Fecha</Th>
                <Th>Folio</Th>
                <Th>Tienda</Th>
                <Th>TDA</Th>
                <Th>Vendedor</Th>
                <Th className="text-right">Monto</Th>
                <Th className="text-right">Piezas</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.id} className="group cursor-pointer" onClick={() => setDetailItem(row)}>
                  <Td className="text-slate-400 text-xs">{i + 1}</Td>
                  <Td>
                    <span className="font-medium text-slate-700">{row.fechaLiquidacion}</span>
                  </Td>
                  <Td>
                    <span className="text-slate-600">{row.folioLiquidacion || '—'}</span>
                  </Td>
                  <Td className="text-slate-700">{row.nombreTienda}</Td>
                  <Td>
                    <span className="text-xs font-mono text-slate-500">{row.TDA}</span>
                  </Td>
                  <Td className="text-slate-600">{row.vendedor || '—'}</Td>
                  <Td className="text-right font-semibold text-slate-700">
                    {formatCurrency(row.montoFactura)}
                  </Td>
                  <Td className="text-right font-semibold text-slate-700">
                    {formatNumber(row.piezasEntregadas)}
                  </Td>
                  <Td>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setDetailItem(row) }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400
                        hover:text-brand-700 hover:bg-brand-50 transition-all"
                      title="Ver detalle"
                    >
                      <ChevronRight size={15} strokeWidth={2} />
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="px-6 py-3 border-t border-slate-100 text-xs text-slate-400 text-right">
            {count} {count === 1 ? 'liquidación' : 'liquidaciones'}
          </div>
        </div>
      )}

      {/* Detail modal */}
      {detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setDetailItem(null)}>
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Detalle de Liquidación</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {detailItem.fechaLiquidacion} — {detailItem.nombreTienda}
                </p>
              </div>
              <button onClick={() => setDetailItem(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 rounded-lg bg-slate-50">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Folio</p>
                  <p className="text-sm font-medium text-slate-800 mt-0.5">{detailItem.folioLiquidacion || '—'}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Remisión</p>
                  <p className="text-sm font-medium text-slate-800 mt-0.5">{detailItem.numeroRemison || '—'}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Monto Factura</p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">{formatCurrency(detailItem.montoFactura)}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Piezas Entregadas</p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">{formatNumber(detailItem.piezasEntregadas)}</p>
                </div>
              </div>

              <h3 className="text-sm font-semibold text-slate-700 mb-3">Productos</h3>
              <Table>
                <thead>
                  <tr>
                    <Th>Producto</Th>
                    <Th className="text-right">Cantidad</Th>
                  </tr>
                </thead>
                <tbody>
                  {(detailItem.productos || []).length === 0 ? (
                    <tr>
                      <Td colSpan={2} className="text-center text-slate-400 py-6">
                        Sin productos registrados
                      </Td>
                    </tr>
                  ) : (
                    (detailItem.productos || []).map(p => (
                      <tr key={p.id}>
                        <Td className="text-slate-700">{p.nombre}</Td>
                        <Td className="text-right font-semibold text-slate-700">{formatNumber(p.existencia)}</Td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
            <div className="px-6 py-3 border-t border-slate-200 flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => setDetailItem(null)}>
                Cerrar
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
