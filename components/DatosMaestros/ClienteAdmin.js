import { useState, useEffect, useMemo } from 'react'
import {
  Search, Building2, Store, ChevronDown, Plus, Edit3, Trash2, DollarSign,
  X, Barcode, Save, Loader2, ChevronRight, ChevronLeft,
  Package, FileText, Hash,
} from 'lucide-react'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import { SkeletonTable } from '../ui/Skeleton'
import { useNavigation } from '../../context/NavigationContext'
import { useNotify } from '../../context/NotificationContext'

export default function ClienteAdmin({ user }) {
  const { navigate } = useNavigation()
  const { notify } = useNotify()

  const [clients, setClients] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const [canal, setCanal] = useState('')
  const [search, setSearch] = useState('')
  const [expandedClient, setExpandedClient] = useState(null)

  const [editPrices, setEditPrices] = useState({})
  const [savingPrice, setSavingPrice] = useState({})

  const [newProductId, setNewProductId] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [addingProduct, setAddingProduct] = useState(false)

  const [editClient, setEditClient] = useState(null)
  const [editForm, setEditForm] = useState({ canal: '', clave: '', nombreCliente: '', razonSocial: '' })
  const [savingClient, setSavingClient] = useState(false)

  const fetchData = () => {
    setLoading(true)
    Promise.all([
      fetch('/api/cliente').then(r => r.json()),
      fetch('/api/productos').then(r => r.json()),
    ])
      .then(([clientRes, prodRes]) => {
        setClients(clientRes.data || [])
        setProducts(prodRes.data || prodRes.productos || [])
      })
      .catch(() => notify('Error al cargar datos', 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const canalOptions = useMemo(() => {
    return [...new Set(clients.map(c => c.canal).filter(Boolean))]
  }, [clients])

  const filteredClients = useMemo(() => {
    let result = clients
    if (canal) result = result.filter(c => c.canal === canal)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(c =>
        (c.nombreCliente || '').toLowerCase().includes(q) ||
        (c.clave || '').toLowerCase().includes(q) ||
        (c.razonSocial || '').toLowerCase().includes(q)
      )
    }
    return result
  }, [clients, canal, search])

  const toggleExpand = (client) => {
    if (expandedClient?.id === client.id) {
      setExpandedClient(null)
      setEditPrices({})
    } else {
      setExpandedClient(client)
      const prices = {}
      client.productos.forEach(p => { prices[p.nombre] = p.precio })
      setEditPrices(prices)
      setNewProductId('')
      setNewPrice('')
    }
  }

  const handlePriceChange = (productName, value) => {
    setEditPrices(prev => ({ ...prev, [productName]: value }))
  }

  const savePrice = async (clientId, productName) => {
    const price = editPrices[productName]
    if (price === undefined || price === '') return
    setSavingPrice(prev => ({ ...prev, [productName]: true }))
    try {
      const res = await fetch(`/api/productos/cliente/${clientId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: productName, precio: parseFloat(price), codigoBarras: '' }),
      })
      if (!res.ok) throw new Error('Error al guardar')
      notify(`Precio de "${productName}" actualizado`, 'success')
      fetchData()
    } catch (err) {
      notify('Error al guardar el precio', 'error')
    } finally {
      setSavingPrice(prev => ({ ...prev, [productName]: false }))
    }
  }

  const removeProduct = async (clientId, productName) => {
    if (!window.confirm(`¿Eliminar "${productName}" de los precios del cliente?`)) return
    try {
      const res = await fetch(`/api/productos/cliente/${clientId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: productName }),
      })
      if (!res.ok) throw new Error('Error al eliminar')
      notify(`"${productName}" eliminado del cliente`, 'success')
      fetchData()
    } catch (err) {
      notify('Error al eliminar el producto', 'error')
    }
  }

  const addProduct = async () => {
    if (!newProductId || !newPrice) return
    const product = products.find(p => p.id === newProductId)
    if (!product) return
    setAddingProduct(true)
    try {
      const res = await fetch(`/api/productos/cliente/${expandedClient.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: product.nombre,
          precio: parseFloat(newPrice),
          codigoBarras: product.codigoBarras || '',
        }),
      })
      if (!res.ok) throw new Error('Error al agregar')
      notify(`"${product.nombre}" agregado al cliente`, 'success')
      fetchData()
      setNewProductId('')
      setNewPrice('')
    } catch (err) {
      notify('Error al agregar el producto', 'error')
    } finally {
      setAddingProduct(false)
    }
  }

  const availableProducts = useMemo(() => {
    if (!expandedClient) return []
    const existingNames = new Set(expandedClient.productos.map(p => p.nombre))
    return products.filter(p => !existingNames.has(p.nombre))
  }, [products, expandedClient])

  const openEditClient = (client) => {
    setEditClient(client)
    setEditForm({
      canal: client.canal || '',
      clave: client.clave || '',
      nombreCliente: client.nombreCliente || '',
      razonSocial: client.razonSocial || '',
    })
  }

  const closeEditClient = () => {
    setEditClient(null)
    setEditForm({ canal: '', clave: '', nombreCliente: '', razonSocial: '' })
  }

  const saveClient = async () => {
    if (!editClient) return
    setSavingClient(true)
    try {
      const res = await fetch(`/api/cliente/actualizar/${editClient.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })
      if (!res.ok) throw new Error('Error al guardar')
      notify('Cliente actualizado correctamente', 'success')
      fetchData()
      closeEditClient()
    } catch (err) {
      notify('Error al guardar el cliente', 'error')
    } finally {
      setSavingClient(false)
    }
  }

  const deleteClient = async (client) => {
    if (!window.confirm(`¿Eliminar al cliente "${client.nombreCliente}" y todos sus productos asociados?`)) return
    try {
      const res = await fetch(`/api/cliente/eliminar/${client.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Error al eliminar')
      notify('Cliente eliminado', 'success')
      if (expandedClient?.id === client.id) setExpandedClient(null)
      fetchData()
    } catch (err) {
      notify('Error al eliminar el cliente', 'error')
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-slate-100 rounded-lg animate-pulse w-48" />
        <SkeletonTable rows={4} cols={4} />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Filter bar */}
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
                onChange={e => { setCanal(e.target.value); setExpandedClient(null) }}
                className="w-full pl-9 pr-8 py-2 rounded-lg border border-slate-300 text-sm text-slate-700 bg-white
                  focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-shadow appearance-none cursor-pointer"
              >
                <option value="">Todos los canales</option>
                {canalOptions.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar cliente..."
              className="w-full pl-9 pr-9 py-2 rounded-lg border border-slate-300 text-sm text-slate-700 placeholder:text-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-shadow"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                <X size={16} />
              </button>
            )}
          </div>

          <Button variant="primary" size="sm" icon={Plus} onClick={() => navigate('crearCliente')}>
            Agregar cliente
          </Button>
        </div>
      </div>

      {/* Results */}
      {filteredClients.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-xl border border-slate-200 shadow-card">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <Store size={28} className="text-slate-400" />
          </div>
          <p className="text-base font-semibold text-slate-700 mb-1">No se encontraron clientes</p>
          <p className="text-sm text-slate-500">
            {search ? `No hay resultados para "${search}"` : 'Comienza agregando un nuevo cliente'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredClients.map(client => (
            <div
              key={client.id}
              className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden transition-shadow duration-200 hover:shadow-card-hover"
            >
              {/* Client header */}
              <div className="px-5 py-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                    <Store size={20} className="text-brand-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-900">{client.nombreCliente}</h3>
                      <Badge status="info">{client.canal}</Badge>
                      <Badge status={client.productos?.length > 0 ? 'success' : 'warning'}>
                        {client.productos?.length || 0} precio{client.productos?.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Hash size={12} />
                        Clave: <code className="font-mono font-semibold text-slate-600">{client.clave}</code>
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText size={12} />
                        R.Social:{' '}
                        {client.razonSocial ? (
                          <span className="text-slate-600">{client.razonSocial}</span>
                        ) : (
                          <span className="text-slate-400 italic">No especificada</span>
                        )}
                      </span>
                      <span>· {client.productos?.length || 0} producto{client.productos?.length !== 1 ? 's' : ''} con precio</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Edit3}
                      onClick={() => openEditClient(client)}
                    >
                      Editar
                    </Button>
                    <button
                      onClick={() => deleteClient(client)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Eliminar cliente"
                    >
                      <Trash2 size={15} />
                    </button>
                    <button
                      onClick={() => toggleExpand(client)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors ml-1"
                      title={expandedClient?.id === client.id ? 'Cerrar precios' : 'Ver precios'}
                    >
                      {expandedClient?.id === client.id ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded product price editor */}
              {expandedClient?.id === client.id && (
                <div className="border-t border-slate-100 bg-slate-50/50">
                  <div className="p-5 space-y-4">
                    {client.productos.length > 0 ? (
                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Productos con precio asignado
                        </h4>
                        <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100">
                          {client.productos.map((cp) => (
                            <div key={cp.id} className="flex items-center gap-3 px-4 py-3">
                              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                                <Package size={16} className="text-slate-500" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-800">{cp.nombre}</p>
                                {cp.codigoBarras && (
                                  <div className="flex items-center gap-1 text-xs text-slate-400">
                                    <Barcode size={11} />
                                    <code className="font-mono">{cp.codigoBarras}</code>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="relative">
                                  <DollarSign size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                  <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={editPrices[cp.nombre] ?? ''}
                                    onChange={e => handlePriceChange(cp.nombre, e.target.value)}
                                    className="w-28 pl-7 pr-3 py-1.5 rounded-lg border border-slate-300 text-sm text-slate-700 bg-white
                                      focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-shadow"
                                    placeholder="0.00"
                                  />
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  icon={savingPrice[cp.nombre] ? Loader2 : Save}
                                  loading={savingPrice[cp.nombre]}
                                  onClick={() => savePrice(client.id, cp.nombre)}
                                  disabled={savingPrice[cp.nombre]}
                                />
                                <button
                                  onClick={() => removeProduct(client.id, cp.nombre)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                  title="Eliminar producto del cliente"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6 bg-white rounded-lg border border-dashed border-slate-300">
                        <Package size={24} className="text-slate-300 mx-auto mb-2" />
                        <p className="text-sm text-slate-500 font-medium">Sin productos asignados</p>
                        <p className="text-xs text-slate-400 mt-0.5">Agrega productos con precio usando el selector de abajo</p>
                      </div>
                    )}

                    <div className="bg-white rounded-lg border border-slate-200 p-4">
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                        Agregar producto
                      </h4>
                      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3">
                        <div className="relative w-full sm:flex-1">
                          <Package size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          <select
                            value={newProductId}
                            onChange={e => setNewProductId(e.target.value)}
                            className="w-full pl-9 pr-8 py-2 rounded-lg border border-slate-300 text-sm text-slate-700 bg-white
                              focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-shadow appearance-none cursor-pointer"
                          >
                            <option value="">Seleccionar producto</option>
                            {availableProducts.map(p => (
                              <option key={p.id} value={p.id}>
                                {p.nombre} {p.codigoBarras ? `(${p.codigoBarras})` : ''}
                              </option>
                            ))}
                          </select>
                          <ChevronDown size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                        <div className="relative w-full sm:w-32">
                          <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={newPrice}
                            onChange={e => setNewPrice(e.target.value)}
                            placeholder="Precio"
                            className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-700 placeholder:text-slate-400 bg-white
                              focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-shadow"
                          />
                        </div>
                        <Button
                          variant="primary"
                          size="sm"
                          icon={addingProduct ? Loader2 : Plus}
                          loading={addingProduct}
                          onClick={addProduct}
                          disabled={!newProductId || !newPrice || addingProduct}
                        >
                          Agregar
                        </Button>
                      </div>
                      {availableProducts.length === 0 && (
                        <p className="text-xs text-slate-400 mt-2">Todos los productos ya están asignados a este cliente</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Edit Client Modal */}
      {editClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={closeEditClient} />
          <div className="relative bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Editar Cliente</h2>
                <p className="text-sm text-slate-500 mt-0.5">{editClient.nombreCliente}</p>
              </div>
              <button onClick={closeEditClient} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Canal
                </label>
                <select
                  value={editForm.canal}
                  onChange={e => setEditForm({ ...editForm, canal: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-shadow appearance-none cursor-pointer"
                >
                  <option value="Autoservicio">Autoservicio</option>
                  <option value="Horeca">Horeca</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Clave
                </label>
                <input
                  type="text"
                  value={editForm.clave}
                  onChange={e => setEditForm({ ...editForm, clave: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-700 placeholder:text-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-shadow"
                  placeholder="Clave del cliente"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Nombre del cliente
                </label>
                <input
                  type="text"
                  value={editForm.nombreCliente}
                  onChange={e => setEditForm({ ...editForm, nombreCliente: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-700 placeholder:text-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-shadow"
                  placeholder="Nombre del cliente"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Razón social
                </label>
                <input
                  type="text"
                  value={editForm.razonSocial}
                  onChange={e => setEditForm({ ...editForm, razonSocial: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-700 placeholder:text-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-shadow"
                  placeholder="Razón social"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50">
              <Button variant="secondary" size="sm" onClick={closeEditClient} disabled={savingClient}>
                Cancelar
              </Button>
              <Button variant="primary" size="sm" icon={savingClient ? Loader2 : Save} loading={savingClient} onClick={saveClient}>
                {savingClient ? 'Guardando...' : 'Guardar cambios'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
