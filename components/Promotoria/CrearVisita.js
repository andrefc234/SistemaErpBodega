import { useState, useEffect, useMemo } from 'react'
import {
  Building2, Store, Hash, User, Calendar, FileText, Image, RotateCcw,
  Package, TrendingUp, TrendingDown, Warehouse, Save, Loader2, ChevronDown,
  Search,
} from 'lucide-react'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import { useNotify } from '../../context/NotificationContext'

export default function CrearVisita({ user }) {
  const { notify } = useNotify()

  const [canal, setCanal] = useState('')
  const [tiendas, setTiendas] = useState([])
  const [productos, setProductos] = useState([])
  const [prodLoading, setProdLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [prodSearch, setProdSearch] = useState('')

  const [form, setForm] = useState({
    nombreTienda: '',
    TDA: '',
    fecha: new Date().toISOString().split('T')[0],
    observaciones: '',
    rotacion: '0%',
  })

  const [productData, setProductData] = useState({})
  const [image, setImage] = useState(null)

  useEffect(() => {
    fetch('/api/tienda')
      .then(r => r.json())
      .then(d => setTiendas(d.data || []))
  }, [])

  useEffect(() => {
    fetch('/api/productos')
      .then(r => r.json())
      .then(d => {
        const list = d.data || d.productos || []
        setProductos(list)
        const initial = {}
        list.forEach(p => { initial[p.nombre] = { alta: '', baja: '', existencia: '' } })
        setProductData(initial)
        setProdLoading(false)
      })
  }, [])

  const tiendasFiltradas = useMemo(() => {
    if (!canal) return []
    return tiendas.filter(t => t.canal === canal)
  }, [tiendas, canal])

  const tiendaActual = useMemo(() => {
    if (!form.nombreTienda) return null
    return tiendasFiltradas.find(t => t.nombreTienda === form.nombreTienda)
  }, [tiendasFiltradas, form.nombreTienda])

  const filteredProducts = useMemo(() => {
    if (!prodSearch.trim()) return productos
    const q = prodSearch.toLowerCase()
    return productos.filter(p =>
      (p.nombre || '').toLowerCase().includes(q) ||
      (p.codigoBarras || '').toLowerCase().includes(q)
    )
  }, [productos, prodSearch])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.nombreTienda || !form.TDA) {
      notify('Selecciona una tienda', 'error')
      return
    }

    setSaving(true)
    try {
      const prod = productos.map(p => ({
        nombre: p.nombre,
        baja: parseInt(productData[p.nombre]?.baja) || 0,
        alta: parseInt(productData[p.nombre]?.alta) || 0,
        existencia: parseInt(productData[p.nombre]?.existencia) || 0,
      }))

      const totals = prod.reduce((acc, p) => ({
        bajas: acc.bajas + p.baja,
        altas: acc.altas + p.alta,
        existencia: acc.existencia + p.existencia,
      }), { bajas: 0, altas: 0, existencia: 0 })

      const body = {
        nombreTienda: form.nombreTienda,
        TDA: form.TDA,
        promotor: user || '—',
        productos: prod,
        fecha: form.fecha,
        bajasG: totals.bajas,
        altasG: totals.altas,
        totalP: totals.existencia,
        observaciones: form.observaciones,
        rotacion: form.rotacion,
      }

      const [visitaRes] = await Promise.all([
        fetch('/api/promotor/crearV', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }),
      ])

      if (!visitaRes.ok) throw new Error('Error al guardar visita')

      const prodPicking = prod
        .filter(p => p.alta > 0)
        .map(p => ({ nombre: p.nombre, cantidad: p.alta }))

      if (prodPicking.length > 0 && tiendaActual) {
        const tdaRes = await fetch(`/api/tienda?tda=${form.TDA}`)
        const tdaJson = await tdaRes.json()
        const tdaData = tdaJson.data?.[0]

        await fetch('/api/almacen/pedido/crear', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            TDA: form.TDA,
            fecha: tdaData?.diaE,
            empleado: tdaData?.empleadoEntrega,
            productos: prodPicking,
            estatus: 'pendiente',
            totalPedido: totals.existencia,
            fechaPromotoria: form.fecha,
          }),
        })
      }

      notify('Visita registrada correctamente', 'success')

      setForm({
        nombreTienda: '',
        TDA: '',
        fecha: new Date().toISOString().split('T')[0],
        observaciones: '',
        rotacion: '0%',
      })
      const reset = {}
      productos.forEach(p => { reset[p.nombre] = { alta: '', baja: '', existencia: '' } })
      setProductData(reset)
      setImage(null)
    } catch (err) {
      notify('Error al guardar la visita', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-3">
      {/* Canal selector */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-card p-3 sm:p-4">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
          Canal
        </label>
        <div className="relative max-w-xs">
          <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <select
            value={canal}
            onChange={e => { setCanal(e.target.value); setForm({ ...form, nombreTienda: '', TDA: '' }) }}
            className="w-full pl-9 pr-8 py-1.5 rounded-lg border border-slate-300 text-sm text-slate-700 bg-white
              focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-shadow appearance-none cursor-pointer"
          >
            <option value="">Seleccionar canal</option>
            <option value="Autoservicio">Autoservicio</option>
            <option value="HORECA">HORECA</option>
          </select>
          <ChevronDown size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {canal && (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Left column — Datos de la visita */}
              <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100">
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <FileText size={15} className="text-brand-600" />
                    Datos de la visita
                  </h2>
                </div>
                <div className="p-4 space-y-3">
                  {/* Tienda */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Nombre de tienda
                    </label>
                    <div className="relative">
                      <Store size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <select
                        value={form.nombreTienda}
                        onChange={e => {
                          const t = tiendasFiltradas.find(ti => ti.nombreTienda === e.target.value)
                          setForm({ ...form, nombreTienda: e.target.value, TDA: t?.TDA || '' })
                        }}
                        className="w-full pl-9 pr-8 py-1.5 rounded-lg border border-slate-300 text-sm text-slate-700 bg-white
                          focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-shadow appearance-none cursor-pointer"
                      >
                        <option value="">Seleccionar tienda</option>
                        {tiendasFiltradas.map(t => (
                          <option key={t.id} value={t.nombreTienda}>{t.nombreTienda}</option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* TDA */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      TDA
                    </label>
                    <div className="relative">
                      <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        value={form.TDA}
                        readOnly
                        className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600 bg-slate-50 cursor-not-allowed"
                        placeholder="Se auto-completa"
                      />
                    </div>
                    {tiendaActual && (
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge status="info">{tiendaActual.canal}</Badge>
                        {tiendaActual.empleadoEntrega && (
                          <span className="text-xs text-slate-400">
                            Entrega: {tiendaActual.empleadoEntrega}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Promotor */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Promotor
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        value={user || '—'}
                        disabled
                        className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600 bg-slate-50 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Fecha */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Fecha de visita
                    </label>
                    <div className="relative">
                      <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input
                        type="date"
                        value={form.fecha}
                        onChange={e => setForm({ ...form, fecha: e.target.value })}
                        className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-sm text-slate-700 bg-white
                          focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-shadow"
                      />
                    </div>
                  </div>

                  {/* Rotación */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Rotación
                    </label>
                    <div className="relative">
                      <RotateCcw size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <select
                        value={form.rotacion}
                        onChange={e => setForm({ ...form, rotacion: e.target.value })}
                        className="w-full pl-9 pr-8 py-1.5 rounded-lg border border-slate-300 text-sm text-slate-700 bg-white
                          focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-shadow appearance-none cursor-pointer"
                      >
                        {['0%','10%','20%','30%','40%','50%','60%','70%','80%','90%','100%'].map(v => (
                          <option key={v} value={v}>{v}</option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Observaciones */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Observaciones
                    </label>
                    <textarea
                      value={form.observaciones}
                      onChange={e => setForm({ ...form, observaciones: e.target.value })}
                      rows={3}
                      placeholder="Notas de la visita..."
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-700 placeholder:text-slate-400 bg-white
                        focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-shadow resize-none"
                    />
                  </div>

                  {/* Imagen */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Imagen
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 text-sm text-slate-600 bg-white
                        hover:bg-slate-50 cursor-pointer transition-colors">
                        <Image size={16} />
                        <span>{image ? image.name : 'Seleccionar archivo'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => setImage(e.target.files[0] || null)}
                          className="hidden"
                        />
                      </label>
                      {image && (
                        <button
                          type="button"
                          onClick={() => setImage(null)}
                          className="text-xs text-red-500 hover:text-red-700 underline"
                        >
                          Quitar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary card */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100">
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Warehouse size={15} className="text-brand-600" />
                    Resumen de productos
                  </h2>
                </div>
                <div className="p-4">
                  {prodLoading ? (
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-100 rounded animate-pulse" />
                      <div className="h-4 bg-slate-100 rounded animate-pulse w-2/3" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Total de productos</span>
                        <span className="font-semibold text-slate-800">{productos.length}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1.5 text-emerald-600">
                          <TrendingUp size={15} />
                          Altas totales
                        </span>
                        <span className="font-semibold text-slate-800">
                          {Object.values(productData).reduce((s, p) => s + (parseInt(p.alta) || 0), 0)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1.5 text-red-600">
                          <TrendingDown size={15} />
                          Bajas totales
                        </span>
                        <span className="font-semibold text-slate-800">
                          {Object.values(productData).reduce((s, p) => s + (parseInt(p.baja) || 0), 0)}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-slate-100">
                        <div className="flex items-center justify-between text-sm font-semibold">
                          <span className="text-slate-600">Existencia total</span>
                          <span className="text-slate-900">
                            {Object.values(productData).reduce((s, p) => s + (parseInt(p.existencia) || 0), 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right column — Productos */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Package size={15} className="text-brand-600" />
                    Productos
                  </h2>
                  <Badge status="info">{productos.length} productos</Badge>
                </div>

                {/* Product search */}
                <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/50">
                  <div className="relative max-w-sm">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      value={prodSearch}
                      onChange={e => setProdSearch(e.target.value)}
                      placeholder="Filtrar productos..."
                      className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-sm text-slate-700 placeholder:text-slate-400 bg-white
                        focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-shadow"
                    />
                  </div>
                </div>

                {/* Products table */}
                {prodLoading ? (
                  <div className="p-6 space-y-3">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="h-10 bg-slate-100 rounded animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500 min-w-[180px]">
                            Producto
                          </th>
                          <th className="px-2 py-2.5 text-center text-xs font-bold uppercase tracking-wider text-emerald-600 w-[100px]">
                            <div className="flex items-center justify-center gap-1">
                              <TrendingUp size={13} />
                              Alta
                            </div>
                          </th>
                          <th className="px-2 py-2.5 text-center text-xs font-bold uppercase tracking-wider text-red-600 w-[100px]">
                            <div className="flex items-center justify-center gap-1">
                              <TrendingDown size={13} />
                              Baja
                            </div>
                          </th>
                          <th className="px-2 py-2.5 text-center text-xs font-bold uppercase tracking-wider text-blue-600 w-[110px]">
                            <div className="flex items-center justify-center gap-1">
                              <Warehouse size={13} />
                              Existencia
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredProducts.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-2">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
                                  <Package size={14} className="text-slate-500" />
                                </div>
                                <span className="text-sm text-slate-700 font-medium">{p.nombre}</span>
                              </div>
                            </td>
                            <td className="px-3 py-2.5">
                              <input
                                type="number"
                                min="0"
                                value={productData[p.nombre]?.alta ?? ''}
                                onChange={e => setProductData({
                                  ...productData,
                                  [p.nombre]: { ...productData[p.nombre], alta: e.target.value }
                                })}
                                className="w-full px-2 py-1 rounded-md border border-slate-300 text-sm text-slate-700 text-center bg-white
                                  focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-shadow"
                                placeholder="0"
                              />
                            </td>
                            <td className="px-3 py-2.5">
                              <input
                                type="number"
                                min="0"
                                value={productData[p.nombre]?.baja ?? ''}
                                onChange={e => setProductData({
                                  ...productData,
                                  [p.nombre]: { ...productData[p.nombre], baja: e.target.value }
                                })}
                                className="w-full px-2 py-1 rounded-md border border-slate-300 text-sm text-slate-700 text-center bg-white
                                  focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-shadow"
                                placeholder="0"
                              />
                            </td>
                            <td className="px-3 py-2.5">
                              <input
                                type="number"
                                min="0"
                                value={productData[p.nombre]?.existencia ?? ''}
                                onChange={e => setProductData({
                                  ...productData,
                                  [p.nombre]: { ...productData[p.nombre], existencia: e.target.value }
                                })}
                                className="w-full px-2 py-1 rounded-md border border-slate-300 text-sm text-slate-700 text-center bg-white
                                  focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-shadow"
                                placeholder="0"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {filteredProducts.length === 0 && (
                      <div className="text-center py-10 text-slate-400 text-sm">
                        {prodSearch ? `No hay productos que coincidan con "${prodSearch}"` : 'No hay productos disponibles'}
                      </div>
                    )}
                  </div>
                )}

                {/* Submit */}
                <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <p className="text-xs text-slate-400">
                    Los productos con alta &gt; 0 generarán un pedido automático
                  </p>
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    icon={saving ? Loader2 : Save}
                    loading={saving}
                    disabled={saving || !form.nombreTienda}
                  >
                    {saving ? 'Guardando...' : 'Guardar visita'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}
