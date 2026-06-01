import { useState, useEffect, useMemo } from 'react'
import {
  Search, LayoutGrid, List, Plus, Edit3, Trash2, Store, Building2,
  X, User, Route, ChevronDown, Calendar, MapPin, XCircle, Save, Loader2,
} from 'lucide-react'
import Table, { Th, Td } from '../ui/Table'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import { SkeletonTable } from '../ui/Skeleton'
import { useNavigation } from '../../context/NavigationContext'
import { useNotify } from '../../context/NotificationContext'

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

export default function TiendaUser({ user }) {
  const { navigate } = useNavigation()
  const { notify } = useNotify()

  const [stores, setStores] = useState([])
  const [clients, setClients] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const [canal, setCanal] = useState('')
  const [selectedClient, setSelectedClient] = useState('')

  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState('table')

  const [editStore, setEditStore] = useState(null)
  const [form, setForm] = useState({ nombreTienda: '', TDA: '', empleadoEntrega: '', empleadoPromotoria: '' })
  const [saving, setSaving] = useState(false)

  const fetchData = () => {
    setLoading(true)
    Promise.all([
      fetch('/api/tienda').then(r => r.json()),
      fetch('/api/cliente').then(r => r.json()),
      fetch('/api/auth/users').then(r => r.json()),
    ])
      .then(([storeRes, clientRes, usersRes]) => {
        setStores(storeRes.data || [])
        setClients(clientRes.data || [])
        setUsers(usersRes.data || [])
      })
      .catch(() => {
        notify('Error al cargar datos', 'error')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const canalOptions = useMemo(() => {
    return [...new Set(clients.map(c => c.canal).filter(Boolean))]
  }, [clients])

  const clientOptions = useMemo(() => {
    if (!canal) return []
    return clients.filter(c => c.canal === canal)
  }, [clients, canal])

  const filteredStores = useMemo(() => {
    let result = stores
    if (canal) result = result.filter(s => s.canal === canal)
    if (selectedClient) result = result.filter(s => s.nombreCliente === selectedClient)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(s =>
        (s.nombreTienda || '').toLowerCase().includes(q) ||
        (s.TDA || '').toLowerCase().includes(q) ||
        (s.empleadoEntrega || '').toLowerCase().includes(q) ||
        (s.empleadoPromotoria || '').toLowerCase().includes(q)
      )
    }
    return result
  }, [stores, canal, selectedClient, search])

  const openEdit = (store) => {
    setEditStore(store)
    setForm({
      nombreTienda: store.nombreTienda || '',
      TDA: store.TDA || '',
      empleadoEntrega: store.empleadoEntrega || '',
      empleadoPromotoria: store.empleadoPromotoria || '',
    })
  }

  const closeEdit = () => {
    setEditStore(null)
    setForm({ nombreTienda: '', TDA: '', empleadoEntrega: '', empleadoPromotoria: '' })
  }

  const handleSave = async () => {
    if (!editStore) return
    setSaving(true)
    try {
      const res = await fetch(`/api/tienda/${editStore.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Error al guardar')
      notify('Tienda actualizada correctamente', 'success')
      fetchData()
      closeEdit()
    } catch (err) {
      console.error(err)
      notify('Error al guardar la tienda', 'error')
    } finally {
      setSaving(false)
    }
  }

  const deleteStore = async (store) => {
    if (!window.confirm(`¿Eliminar la tienda "${store.nombreTienda}"?`)) return
    try {
      const res = await fetch(`/api/tienda/${store.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Error al eliminar')
      notify('Tienda eliminada', 'success')
      fetchData()
    } catch (err) {
      notify('Error al eliminar la tienda', 'error')
    }
  }

  const formatDays = (days) => {
    if (!days || days.length === 0) return '—'
    return days.map(d => DAYS[d.dia] || '—').join(', ')
  }

  const hasSelection = canal && selectedClient

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="h-10 bg-slate-100 rounded-lg animate-pulse w-48" />
          <div className="h-10 bg-slate-100 rounded-lg animate-pulse w-56" />
        </div>
        <SkeletonTable rows={5} cols={6} />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Cascading filter */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-card p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
          <div className="w-full sm:w-56">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Canal
            </label>
            <div className="relative">
              <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <select
                value={canal}
                onChange={e => { setCanal(e.target.value); setSelectedClient('') }}
                className="w-full pl-9 pr-8 py-2 rounded-lg border border-slate-300 text-sm text-slate-700 bg-white
                  focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-shadow appearance-none cursor-pointer"
              >
                <option value="">Seleccionar canal</option>
                {canalOptions.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="w-full sm:w-64">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Cliente
            </label>
            <div className="relative">
              <Store size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <select
                value={selectedClient}
                onChange={e => setSelectedClient(e.target.value)}
                disabled={!canal}
                className="w-full pl-9 pr-8 py-2 rounded-lg border border-slate-300 text-sm text-slate-700 bg-white
                  focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-shadow appearance-none cursor-pointer
                  disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
              >
                <option value="">{canal ? 'Seleccionar cliente' : 'Primero selecciona un canal'}</option>
                {clientOptions.map(c => (
                  <option key={c.id} value={c.nombreCliente}>{c.nombreCliente}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {hasSelection && (
            <div className="flex items-center gap-2 pb-0.5">
              <Badge status="info">{selectedClient}</Badge>
              <button
                onClick={() => { setSelectedClient(''); setCanal('') }}
                className="text-xs text-slate-400 hover:text-slate-600 underline transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results section — only show when canal + cliente selected */}
      {hasSelection && (
        <>
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative w-full sm:max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por tienda, TDA o empleado..."
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

            <Button variant="primary" size="sm" icon={Plus} onClick={() => navigate('crearTienda')}>
              Agregar
            </Button>
          </div>

          {/* Results count */}
          <p className="text-xs text-slate-500">
            {filteredStores.length} tienda{filteredStores.length !== 1 ? 's' : ''}
            {search && ` coinciden con "${search}"`}
          </p>

          {/* Table view */}
          {viewMode === 'table' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
              <Table
                rows={filteredStores}
                keyExtractor={s => s.id}
                headers={['Tienda', 'TDA', 'Encargado Entrega', 'Encargado Promotoría', 'Ruta', 'Acciones']}
                renderRow={(store) => (
                  <>
                    <Td>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                          <Store size={18} className="text-brand-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{store.nombreTienda}</p>
                          <p className="text-xs text-slate-400">{store.nombreCliente}</p>
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <code className="text-xs bg-slate-100 px-2 py-1 rounded font-mono text-slate-600 font-semibold">
                        {store.TDA || '—'}
                      </code>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-1.5">
                        <User size={14} className="text-slate-400" />
                        <span className="text-sm text-slate-700">{store.empleadoEntrega || '—'}</span>
                      </div>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-1.5">
                        <User size={14} className="text-slate-400" />
                        <span className="text-sm text-slate-700">{store.empleadoPromotoria || '—'}</span>
                      </div>
                    </Td>
                    <Td>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Calendar size={12} className="text-amber-500" />
                          <span className="text-amber-700 font-medium">Entrega:</span>
                          <span>{formatDays(store.diaE)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Calendar size={12} className="text-blue-500" />
                          <span className="text-blue-700 font-medium">Promo:</span>
                          <span>{formatDays(store.diaP)}</span>
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" icon={Edit3} onClick={() => openEdit(store)}>
                          Editar
                        </Button>
                        <button
                          onClick={() => deleteStore(store)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </Td>
                  </>
                )}
                emptyMessage="No se encontraron tiendas"
                emptyAction={
                  <Button variant="primary" size="sm" icon={Plus} onClick={() => navigate('crearTienda')}>
                    Agregar tienda
                  </Button>
                }
              />
            </div>
          )}

          {/* Grid view */}
          {viewMode === 'grid' && (
            <>
              {filteredStores.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                    <Store size={28} className="text-slate-400" />
                  </div>
                  <p className="text-base font-semibold text-slate-700 mb-1">No se encontraron tiendas</p>
                  <p className="text-sm text-slate-500 mb-4">
                    {search ? `No hay resultados para "${search}"` : 'Comienza agregando una nueva tienda'}
                  </p>
                  {!search && (
                    <Button variant="primary" size="sm" icon={Plus} onClick={() => navigate('crearTienda')}>
                      Agregar tienda
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredStores.map(store => (
                    <div
                      key={store.id}
                      className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden hover:shadow-card-hover transition-shadow duration-200 group"
                    >
                      {/* Header */}
                      <div className="p-4 pb-3 border-b border-slate-100">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
                              <Store size={20} className="text-brand-600" />
                            </div>
                            <div>
                              <h3 className="font-bold text-slate-900 text-sm leading-snug">{store.nombreTienda}</h3>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-500">
                                  {store.TDA || '—'}
                                </code>
                                <span className="text-xs text-slate-400">· {store.nombreCliente}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="p-4 space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs text-slate-600">
                            <User size={14} className="text-slate-400 shrink-0" />
                            <span className="font-medium text-slate-500">Entrega:</span>
                            <span>{store.empleadoEntrega || '—'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-600">
                            <User size={14} className="text-slate-400 shrink-0" />
                            <span className="font-medium text-slate-500">Promo:</span>
                            <span>{store.empleadoPromotoria || '—'}</span>
                          </div>
                        </div>

                        <div className="space-y-1.5 pt-2 border-t border-slate-100">
                          <div className="flex items-start gap-2 text-xs">
                            <Calendar size={14} className="text-amber-500 mt-0.5 shrink-0" />
                            <div>
                              <span className="font-medium text-amber-700">Entrega: </span>
                              <span className="text-slate-600">{formatDays(store.diaE)}</span>
                            </div>
                          </div>
                          <div className="flex items-start gap-2 text-xs">
                            <Calendar size={14} className="text-blue-500 mt-0.5 shrink-0" />
                            <div>
                              <span className="font-medium text-blue-700">Promo: </span>
                              <span className="text-slate-600">{formatDays(store.diaP)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 px-4 py-3 bg-slate-50 border-t border-slate-100">
                        <Button variant="ghost" size="sm" icon={Edit3} onClick={() => openEdit(store)}>
                          Editar
                        </Button>
                        <div className="ml-auto">
                          <button
                            onClick={() => deleteStore(store)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Empty state when no filter selected */}
      {!hasSelection && (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-xl border border-slate-200 shadow-card">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
            <MapPin size={32} className="text-slate-400" />
          </div>
          <p className="text-lg font-bold text-slate-800 mb-1">Selecciona un canal y cliente</p>
          <p className="text-sm text-slate-500 max-w-sm">
            Usa los filtros de arriba para elegir un canal y después un cliente.
            Las tiendas se mostrarán automáticamente.
          </p>
        </div>
      )}

      {/* Edit Modal */}
      {editStore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={closeEdit} />
          <div className="relative bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Editar Tienda</h2>
                <p className="text-sm text-slate-500 mt-0.5">{editStore.nombreTienda} — {editStore.TDA}</p>
              </div>
              <button onClick={closeEdit} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                <XCircle size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Nombre de la tienda
                </label>
                <input
                  type="text"
                  value={form.nombreTienda}
                  onChange={e => setForm({ ...form, nombreTienda: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-700 placeholder:text-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-shadow"
                  placeholder="Nombre de la tienda"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  TDA
                </label>
                <input
                  type="text"
                  value={form.TDA}
                  onChange={e => setForm({ ...form, TDA: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-700 placeholder:text-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-shadow"
                  placeholder="Código TDA"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Empleado encargado de entrega
                </label>
                <select
                  value={form.empleadoEntrega}
                  onChange={e => setForm({ ...form, empleadoEntrega: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-shadow appearance-none cursor-pointer"
                >
                  <option value="">Sin asignar</option>
                  {users.map(u => (
                    <option key={u.id} value={u.nombre}>{u.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Empleado encargado de promotoría
                </label>
                <select
                  value={form.empleadoPromotoria}
                  onChange={e => setForm({ ...form, empleadoPromotoria: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-shadow appearance-none cursor-pointer"
                >
                  <option value="">Sin asignar</option>
                  {users.map(u => (
                    <option key={u.id} value={u.nombre}>{u.nombre}</option>
                  ))}
                </select>
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
