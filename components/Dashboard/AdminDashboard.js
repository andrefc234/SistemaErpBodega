import { useState, useEffect } from 'react'
import {
  ClipboardList, Package, Truck, DollarSign, FileText, TrendingUp,
  Eye, AlertCircle, CheckCircle2, Calendar,
} from 'lucide-react'
import StatCard from '../ui/StatCard'
import Badge from '../ui/Badge'
import EmptyState from '../ui/EmptyState'
import { SkeletonTable } from '../ui/Skeleton'
import PageHeader from '../ui/PageHeader'
import { useNavigation } from '../../context/NavigationContext'
import Button from '../ui/Button'

export default function AdminDashboard({ user }) {
  const { navigate } = useNavigation()
  const [data, setData] = useState({
    pickingPendientes: [],
    pedidos: [],
    liquidaciones: [],
    facturas: [],
    productos: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/picking/pendientes').then(r => r.json()),
      fetch('/api/almacen/pedido').then(r => r.json()),
      fetch('/api/liquidacion').then(r => r.json()),
      fetch('/api/facturacion').then(r => r.json()),
      fetch('/api/productos').then(r => r.json()),
    ]).then(([pickings, pedidos, liquidaciones, facturas, productos]) => {
      setData({
        pickingPendientes: pickings.data || [],
        pedidos: pedidos.data || [],
        liquidaciones: liquidaciones.data || [],
        facturas: facturas.data || [],
        productos: (productos.data || productos.productos || []),
      })
    }).catch(() => {
      setData({
        pickingPendientes: [],
        pedidos: [],
        liquidaciones: [],
        facturas: [],
        productos: [],
      })
    }).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Panel de Administración" subtitle="Resumen del sistema" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-card p-5 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-24 mb-3" />
              <div className="h-8 bg-slate-200 rounded w-16" />
            </div>
          ))}
        </div>
        <SkeletonTable rows={4} cols={5} />
      </div>
    )
  }

  const pedidosPendientes = data.pedidos.filter(p => p.estatus === 'pendiente')
  const pedidosLiberados = data.pedidos.filter(p => p.estatus === 'liberado')
  const totalProductos = data.productos.length
  const stockBajo = data.productos.filter(p => (p.cantidadAlmacen || 0) < 50)

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Bienvenido, ${user || 'Admin'}`}
        subtitle="Panel de control — Resumen del sistema"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={ClipboardList}
          label="Pendientes de Picking"
          value={data.pickingPendientes.length}
          sublabel="Por liberar"
          color="amber"
        />
        <StatCard
          icon={Package}
          label="Pedidos Pendientes"
          value={pedidosPendientes.length}
          sublabel={pedidosLiberados.length + ' liberados'}
          color="brand"
        />
        <StatCard
          icon={DollarSign}
          label="Liquidaciones"
          value={data.liquidaciones.length}
          sublabel={'$' + data.liquidaciones.reduce((s, l) => s + (l.montoFactura || 0), 0).toLocaleString()}
          color="emerald"
        />
        <StatCard
          icon={FileText}
          label="Facturas"
          value={data.facturas.length}
          color="blue"
        />
      </div>

      {/* Pickings pendientes */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Truck size={16} className="text-amber-600" />
            Pickings Pendientes
          </h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('verPicking')}>
            Ver todos
          </Button>
        </div>
        {data.pickingPendientes.length === 0 ? (
          <div className="flex items-center gap-3 px-6 py-8 text-slate-400">
            <CheckCircle2 size={20} />
            <span className="text-sm">No hay pickings pendientes</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Tienda</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">TDA</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Empleado</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Estatus</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.pickingPendientes.slice(0, 5).map(p => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-6 py-3 text-sm text-slate-700">{p.tienda || '—'}</td>
                    <td className="px-6 py-3 text-sm text-slate-500 font-mono">{p.TDA}</td>
                    <td className="px-6 py-3 text-sm text-slate-600">{p.empleadoEntrega || '—'}</td>
                    <td className="px-6 py-3"><Badge status={p.estatus} /></td>
                    <td className="px-6 py-3 text-right">
                      <Button variant="ghost" size="sm" onClick={() => navigate('verPicking')}>
                        Revisar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Últimas Liquidaciones */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <DollarSign size={16} className="text-emerald-600" />
            Últimas Liquidaciones
          </h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('liquidacionVer')}>
            Ver todas
          </Button>
        </div>
        {data.liquidaciones.length === 0 ? (
          <div className="flex items-center gap-3 px-6 py-8 text-slate-400">
            <Eye size={20} />
            <span className="text-sm">No hay liquidaciones registradas</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Folio</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Tienda</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Fecha</th>
                  <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Monto</th>
                  <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Piezas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.liquidaciones.slice(0, 5).map(l => (
                  <tr key={l.id} className="hover:bg-slate-50">
                    <td className="px-6 py-3 text-sm font-medium text-slate-700">{l.folioLiquidacion}</td>
                    <td className="px-6 py-3 text-sm text-slate-600">{l.nombreTienda}</td>
                    <td className="px-6 py-3 text-sm text-slate-500">{l.fechaLiquidacion}</td>
                    <td className="px-6 py-3 text-sm text-right font-semibold text-slate-700">
                      ${(l.montoFactura || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-sm text-right font-semibold text-slate-700">
                      {l.piezasEntregadas || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stock bajo */}
      {stockBajo.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle size={20} className="text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800">
              {stockBajo.length} producto{stockBajo.length > 1 ? 's' : ''} con stock bajo ({'<'}50 unidades)
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              {stockBajo.map(p => p.nombre).join(', ')}
            </p>
          </div>
          <Button variant="ghost" size="sm" className="ml-auto shrink-0" onClick={() => navigate('almacen')}>
            Ir a almacén
          </Button>
        </div>
      )}
    </div>
  )
}
