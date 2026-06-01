import { useState, useEffect } from 'react'
import {
  ClipboardList, PenTool, CheckCircle2, Clock, Store,
  ArrowRight, Calendar,
} from 'lucide-react'
import StatCard from '../ui/StatCard'
import Badge from '../ui/Badge'
import EmptyState from '../ui/EmptyState'
import { SkeletonTable, SkeletonCard } from '../ui/Skeleton'
import PageHeader from '../ui/PageHeader'
import WorkflowSteps from '../ui/WorkflowSteps'
import { useNavigation } from '../../context/NavigationContext'
import Button from '../ui/Button'
import Card from '../ui/Card'

export default function PromotorDashboard({ user }) {
  const { navigate } = useNavigation()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/promotor/visita/' + new Date().toISOString().slice(0, 10)).then(r => r.json()),
      fetch('/api/almacen/pedido').then(r => r.json()),
      fetch('/api/tienda').then(r => r.json()),
      fetch('/api/liquidacion').then(r => r.json()),
    ]).then(([visitas, pedidos, tiendas, liquidaciones]) => {
      setData({
        visitas: visitas.data || [],
        pedidos: pedidos.data || [],
        tiendas: tiendas.data || [],
        liquidaciones: liquidaciones.data || [],
      })
    }).catch(() => setData({ visitas: [], pedidos: [], tiendas: [], liquidaciones: [] }))
    .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Mi Panel" subtitle="Cargando..." />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1,2,3].map(i => <SkeletonCard key={i} />)}
        </div>
      </div>
    )
  }

  const visitasHoy = data.visitas.length
  const visitasPendientes = data.visitas.filter(v => v.estatus === 'pendiente').length
  const pedidosPendientes = data.pedidos.filter(p => p.estatus === 'pendiente').length
  const misLiquidaciones = data.liquidaciones.length

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Hola, ${user || 'Promotor'}`}
        subtitle={new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      />

      {/* Workflow visual */}
      <Card title="Flujo de trabajo" subtitle="Así es como funciona el proceso completo">
        <WorkflowSteps current="visita" />
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
          <CheckCircle2 size={12} className="text-emerald-500" />
          <span>Capturas la visita → Se genera pedido → Almacén prepara → Entregas → Liquidación</span>
        </div>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={PenTool} label="Mis visitas hoy" value={visitasHoy} sublabel="registradas" color="brand" />
        <StatCard icon={Clock} label="Pendientes" value={visitasPendientes} sublabel="por liberar" color="amber" />
        <StatCard icon={ClipboardList} label="Pedidos pendientes" value={pedidosPendientes} color="blue" />
        <StatCard icon={Store} label="Tiendas asignadas" value={data.tiendas.length} color="emerald" />
      </div>

      {/* Acciones rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => navigate('crearVisita')}
          className="flex items-center gap-4 p-5 rounded-xl bg-brand-700 text-white hover:bg-brand-800 transition-colors text-left group"
        >
          <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
            <PenTool size={22} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-base">Nueva Visita</h3>
            <p className="text-sm text-white/80 mt-0.5">Capturar visita a tienda</p>
          </div>
          <ArrowRight size={20} className="text-white/60 group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={() => navigate('verVisitas')}
          className="flex items-center gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-card hover:shadow-card-hover transition-all text-left group"
        >
          <div className="w-12 h-12 rounded-lg bg-brand-50 flex items-center justify-center">
            <ClipboardList size={22} className="text-brand-700" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-base text-slate-900">Consultar Visitas</h3>
            <p className="text-sm text-slate-500 mt-0.5">Ver historial de visitas</p>
          </div>
          <ArrowRight size={20} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Mis últimas visitas */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Calendar size={16} className="text-brand-600" />
            Mis últimas visitas
          </h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('verVisitas')}>
            Ver todas
          </Button>
        </div>
        {data.visitas.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
              <PenTool size={20} className="text-slate-400" />
            </div>
            <p className="text-sm font-semibold text-slate-600 mb-1">No hay visitas hoy</p>
            <p className="text-xs text-slate-400 mb-4">Captura tu primera visita del día</p>
            <Button variant="primary" size="sm" icon={PenTool} onClick={() => navigate('crearVisita')}>
              Nueva Visita
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Tienda</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Estatus</th>
                  <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Altas</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.visitas.slice(0, 5).map(v => (
                  <tr key={v.id} className="hover:bg-slate-50">
                    <td className="px-6 py-3 text-sm font-medium text-slate-700">{v.nombreTienda}</td>
                    <td className="px-6 py-3 text-sm text-slate-500">{v.fecha}</td>
                    <td className="px-6 py-3"><Badge status={v.estatus} /></td>
                    <td className="px-6 py-3 text-sm text-right font-semibold text-slate-700">{v.altasG || 0}</td>
                    <td className="px-6 py-3 text-right">
                      <Button variant="ghost" size="sm" onClick={() => navigate('verVisitas')}>
                        Ver
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Información rápida */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle2 size={18} className="text-blue-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-blue-800">¿Sabías que...?</p>
            <p className="text-blue-700 mt-0.5">
              Al capturar una visita, se genera automáticamente un pedido con las altas registradas.
            </p>
          </div>
        </div>
        <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 flex items-start gap-3">
          <Store size={18} className="text-brand-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-brand-800">Tienes {data.tiendas.length} tiendas</p>
            <p className="text-brand-700 mt-0.5">
              Revisa los datos de tus tiendas en la sección Tiendas del menú.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
