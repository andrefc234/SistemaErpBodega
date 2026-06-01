import { useState, useEffect, useMemo } from 'react'
import {
  Search, LayoutGrid, List, Plus, Edit3, ImageOff, Package,
  X, Barcode, Box, XCircle, Save, Loader2,
} from 'lucide-react'
import Table, { Th, Td } from '../ui/Table'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import { SkeletonTable } from '../ui/Skeleton'
import { useNavigation } from '../../context/NavigationContext'
import { useNotify } from '../../context/NotificationContext'

export default function ProductosUser({ user }) {
  const { navigate } = useNavigation()
  const { notify } = useNotify()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState('table')
  const [editProduct, setEditProduct] = useState(null)
  const [form, setForm] = useState({ nombre: '', codigoBarras: '', descripcion: '' })
  const [saving, setSaving] = useState(false)

  const fetchProducts = () => {
    setLoading(true)
    fetch('/api/productos')
      .then(r => r.json())
      .then(res => setProducts(res.data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchProducts() }, [])

  const filtered = useMemo(() => {
    if (!search.trim()) return products
    const q = search.toLowerCase()
    return products.filter(p =>
      (p.nombre || '').toLowerCase().includes(q) ||
      (p.codigoBarras || '').toLowerCase().includes(q) ||
      (p.descripcion || '').toLowerCase().includes(q)
    )
  }, [products, search])

  const stockStatus = (cantidad) => {
    if (!cantidad || cantidad < 50) return { label: 'Stock Bajo', status: 'warning' }
    if (cantidad < 200) return { label: 'Stock Medio', status: 'info' }
    return { label: 'Stock Alto', status: 'success' }
  }

  const openEdit = (product) => {
    setEditProduct(product)
    setForm({
      nombre: product.nombre || '',
      codigoBarras: product.codigoBarras || '',
      descripcion: product.descripcion || '',
    })
  }

  const closeEdit = () => {
    setEditProduct(null)
    setForm({ nombre: '', codigoBarras: '', descripcion: '' })
  }

  const handleSave = async () => {
    if (!editProduct) return
    setSaving(true)
    try {
      const res = await fetch(`/api/productos/actualizar/${editProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Error al guardar')
      notify('Producto actualizado correctamente', 'success')
      fetchProducts()
      closeEdit()
    } catch (err) {
      console.error(err)
      notify('Error al guardar el producto', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-slate-100 rounded-lg animate-pulse w-full max-w-md" />
        <SkeletonTable rows={6} cols={5} />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre, código o descripción..."
            className="w-full pl-9 pr-9 py-2 rounded-lg border border-slate-300 text-sm text-slate-700 placeholder:text-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-shadow"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 ml-auto bg-slate-100 rounded-lg p-0.5">
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-md transition-all ${
              viewMode === 'table'
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
            title="Vista tabla"
          >
            <List size={18} />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-all ${
              viewMode === 'grid'
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
            title="Vista tarjetas"
          >
            <LayoutGrid size={18} />
          </button>
        </div>

        <Button variant="primary" size="sm" icon={Plus} onClick={() => navigate('crearProducto')}>
          Agregar
        </Button>
      </div>

      {/* Results count */}
      <p className="text-xs text-slate-500">
        {filtered.length} de {products.length} producto{products.length !== 1 ? 's' : ''}
        {search && ` coinciden con "${search}"`}
      </p>

      {/* Table view */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
          <Table
            rows={filtered}
            keyExtractor={p => p.id}
            headers={['Producto', 'Código de Barras', 'Descripción', 'Stock', 'Acciones']}
            renderRow={(product) => (
              <>
                <Td>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                      {product.img ? (
                        <img src={product.img} alt={product.nombre} className="w-full h-full object-cover" />
                      ) : (
                        <Package size={18} className="text-slate-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{product.nombre}</p>
                      <p className="text-xs text-slate-400">ID: {product.id}</p>
                    </div>
                  </div>
                </Td>
                <Td>
                  <code className="text-xs bg-slate-100 px-2 py-1 rounded font-mono text-slate-600">
                    {product.codigoBarras || '—'}
                  </code>
                </Td>
                <Td className="max-w-xs">
                  <span className="text-slate-600 line-clamp-2">
                    {product.descripcion || '—'}
                  </span>
                </Td>
                <Td>
                  {product.cantidadAlmacen !== undefined ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-700">{product.cantidadAlmacen}</span>
                      <Badge {...stockStatus(product.cantidadAlmacen)} />
                    </div>
                  ) : (
                    <span className="text-slate-400 text-sm">—</span>
                  )}
                </Td>
                <Td>
                  <Button variant="ghost" size="sm" icon={Edit3} onClick={() => openEdit(product)}>
                    Editar
                  </Button>
                </Td>
              </>
            )}
            emptyMessage="No se encontraron productos"
            emptyAction={
              <Button variant="primary" size="sm" icon={Plus} onClick={() => navigate('crearProducto')}>
                Agregar producto
              </Button>
            }
          />
        </div>
      )}

      {/* Grid view */}
      {viewMode === 'grid' && (
        <>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <Package size={28} className="text-slate-400" />
              </div>
              <p className="text-base font-semibold text-slate-700 mb-1">No se encontraron productos</p>
              <p className="text-sm text-slate-500 mb-4">
                {search ? `No hay resultados para "${search}"` : 'Comienza agregando un nuevo producto'}
              </p>
              {!search && (
                <Button variant="primary" size="sm" icon={Plus} onClick={() => navigate('crearProducto')}>
                  Agregar producto
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(product => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden hover:shadow-card-hover transition-shadow duration-200 group"
                >
                  <div className="h-44 bg-slate-50 flex items-center justify-center overflow-hidden relative">
                    {product.img ? (
                      <img
                        src={product.img}
                        alt={product.nombre}
                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-slate-300">
                        <ImageOff size={36} />
                        <span className="text-xs">Sin imagen</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge {...stockStatus(product.cantidadAlmacen)} />
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm leading-snug">{product.nombre}</h3>
                      {product.codigoBarras && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                          <Barcode size={12} />
                          <code className="font-mono">{product.codigoBarras}</code>
                        </div>
                      )}
                    </div>

                    {product.descripcion && (
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{product.descripcion}</p>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 text-sm text-slate-700">
                        <Box size={15} className="text-slate-400" />
                        <span className="font-semibold">{product.cantidadAlmacen ?? '—'}</span>
                        <span className="text-xs text-slate-400">en almacén</span>
                      </div>
                      <Button variant="ghost" size="sm" icon={Edit3} onClick={() => openEdit(product)}>
                        Editar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Edit Modal */}
      {editProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={closeEdit} />
          <div className="relative bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Editar Producto</h2>
                <p className="text-sm text-slate-500 mt-0.5">#{editProduct.id} — {editProduct.nombre}</p>
              </div>
              <button onClick={closeEdit} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                <XCircle size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Nombre del producto
                </label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={e => setForm({ ...form, nombre: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-700 placeholder:text-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-shadow"
                  placeholder="Nombre del producto"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Código de barras
                </label>
                <input
                  type="text"
                  value={form.codigoBarras}
                  onChange={e => setForm({ ...form, codigoBarras: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-700 placeholder:text-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-shadow"
                  placeholder="Código de barras"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Descripción
                </label>
                <textarea
                  value={form.descripcion}
                  onChange={e => setForm({ ...form, descripcion: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-700 placeholder:text-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-shadow resize-none"
                  placeholder="Descripción del producto"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50">
              <Button variant="secondary" size="sm" onClick={closeEdit} disabled={saving}>
                Cancelar
              </Button>
              <Button variant="primary" size="sm" icon={saving ? Loader2 : Save} loading={saving} onClick={handleSave}>
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
