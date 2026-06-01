import React,{useState,useEffect} from 'react'
import {Container,Row,Col,Button,Form,Table,Badge} from 'react-bootstrap'
import axios from 'axios'

export default function VerVisitaAdmin({user}) {
  const [visitas, setVisitas] = useState([])
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(false)
  const [filterMode, setFilterMode] = useState('latest')

  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTienda, setSelectedTienda] = useState('')
  const [selectedVendedor, setSelectedVendedor] = useState('')
  const [sortOrder, setSortOrder] = useState('desc')

  const [tiendas, setTiendas] = useState([])
  const [vendedores, setVendedores] = useState([])
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    fetch('/api/tienda')
      .then(res => res.json())
      .then(data => setTiendas(data.data))
  }, [])

  useEffect(() => {
    fetch('/api/productos')
      .then(res => res.json())
      .then(data => setProductos(data.data))
  }, [])

  useEffect(() => {
    const fetchVisitas = async () => {
      setLoading(true)

      const params = new URLSearchParams()
      switch (filterMode) {
        case 'latest':
          params.set('limit', '10')
          break
        case 'all':
          params.set('sort', sortOrder)
          break
        case 'date':
          if (selectedDate) params.set('fecha', selectedDate)
          break
        case 'tienda':
          if (selectedTienda) params.set('tienda', selectedTienda)
          params.set('sort', sortOrder)
          break
        case 'vendedor':
          if (selectedVendedor) params.set('vendedor', selectedVendedor)
          params.set('sort', sortOrder)
          break
      }

      const res = await fetch(`/api/promotor/visitas?${params.toString()}`)
      const json = await res.json()
      setVisitas(json.data)

      const uniqueVendedores = [...new Set(json.data.map(v => v.promotor).filter(Boolean))]
      setVendedores(uniqueVendedores)

      setLoading(false)
    }

    fetchVisitas()
  }, [filterMode, selectedDate, selectedTienda, selectedVendedor, sortOrder, reloadKey])

  const updVisita = async (id) => {
    const select = document.getElementById(`estatus-${id}`)
    if (!select) return
    const est = select.value
    await axios.put(`/api/promotor/update/${id}`, { estatus: est })
    setReloadKey(k => k + 1)
  }

  const FilterButton = ({ mode, label, variant }) => (
    <Button
      variant={filterMode === mode ? variant || 'danger' : 'outline-secondary'}
      size="sm"
      onClick={() => { setFilterMode(mode); setSelectedDate(''); setSelectedTienda(''); setSelectedVendedor('') }}
      className="me-1 mb-1"
    >
      {label}
    </Button>
  )

  return (
    <>
      <style>{`
        .table-compact > :not(caption) > * > * {
          padding: .2rem .3rem !important;
          font-size: .75rem;
          line-height: 1.2;
          vertical-align: middle;
        }
        .table-compact th {
          font-size: .7rem;
          text-transform: uppercase;
          letter-spacing: .03em;
          white-space: nowrap;
          background: #f8f9fa;
        }
        .table-compact td {
          white-space: nowrap;
        }
        .filter-bar .form-label {
          margin-bottom: 0;
          font-size: .7rem;
          white-space: nowrap;
          color: #495057;
        }
        .filter-bar .form-control-sm,
        .filter-bar .form-select-sm {
          font-size: .75rem;
          padding: .15rem .4rem;
          min-height: auto;
        }
        .filter-bar .btn-sm {
          font-size: .75rem;
          padding: .15rem .5rem;
        }
      `}</style>
      <div className="px-1">
        <h6 className="text-dark mb-2 fw-semibold">Consultar Visitas</h6>

        <div className="filter-bar d-flex flex-wrap align-items-center gap-1 mb-2 p-2 bg-light rounded border">
          <FilterButton mode="latest" label="Últimas" />
          <FilterButton mode="all" label="Todas" />

          <div className="vr mx-1" />

          <div className="d-flex align-items-center gap-1">
            <Form.Label>Fecha:</Form.Label>
            <Form.Control
              type="date"
              size="sm"
              value={selectedDate}
              onChange={(e) => { setSelectedDate(e.target.value); setFilterMode('date') }}
              style={{ maxWidth: 130 }}
            />
          </div>

          <div className="d-flex align-items-center gap-1">
            <Form.Label>Tienda:</Form.Label>
            <Form.Select
              size="sm"
              value={selectedTienda}
              onChange={(e) => { setSelectedTienda(e.target.value); setFilterMode('tienda') }}
              style={{ maxWidth: 150 }}
            >
              <option value="">Todas</option>
              {tiendas.map((t, i) => (
                <option key={i} value={t.nombreTienda}>{t.nombreTienda}</option>
              ))}
            </Form.Select>
          </div>

          <div className="d-flex align-items-center gap-1">
            <Form.Label>Vendedor:</Form.Label>
            <Form.Select
              size="sm"
              value={selectedVendedor}
              onChange={(e) => { setSelectedVendedor(e.target.value); setFilterMode('vendedor') }}
              style={{ maxWidth: 150 }}
            >
              <option value="">Todos</option>
              {vendedores.map((v, i) => (
                <option key={i} value={v}>{v}</option>
              ))}
            </Form.Select>
          </div>

          <div className="vr mx-1" />

          <Button
            variant="outline-info"
            size="sm"
            onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
          >
            {sortOrder === 'desc' ? '↓ Recientes' : '↑ Antiguos'}
          </Button>

          <Button variant="outline-primary" size="sm" onClick={() => setReloadKey(k => k + 1)}>
            ↻
          </Button>
        </div>

        {loading ? (
          <p className="text-muted small">Cargando visitas...</p>
        ) : visitas.length === 0 ? (
          <p className="text-muted small">No se encontraron visitas.</p>
        ) : (
          <div className="table-responsive">
            <Table striped bordered hover size="sm" className="table-compact mb-0">
              <thead>
                <tr>
                  <th>Folio</th>
                  <th>Tienda</th>
                  <th>TDA</th>
                  <th>Vendedor</th>
                  <th>Fecha</th>
                  <th>Inv</th>
                  <th>↑</th>
                  <th>↓</th>
                  {productos.map(p => (
                    <React.Fragment key={p.id}>
                      <th className="bg-info">Inv {p.nombre}</th>
                      <th className="bg-danger">↓ {p.nombre}</th>
                      <th className="bg-success">↑ {p.nombre}</th>
                    </React.Fragment>
                  ))}
                  <th>Rot</th>
                  <th>Status</th>
                  <th>Img</th>
                </tr>
              </thead>
              <tbody>
                {visitas.map(d => {
                  const date = new Date(d.fecha)
                  return (
                    <tr key={d.id}>
                      <td className="fw-semibold">{d.folio}</td>
                      <td>{d.nombreTienda}</td>
                      <td>{d.TDA}</td>
                      <td>{d.promotor}</td>
                      <td>{date.toLocaleDateString('es-mx')}</td>
                      <td className="text-center">{d.totalP}</td>
                      <td className="text-center text-success">{d.altasG}</td>
                      <td className="text-center text-danger">{d.bajasG}</td>
                      {productos.map(p => {
                        const prod = d.productos.find(pr => pr.nombre === p.nombre)
                        return (
                          <React.Fragment key={p.id}>
                            <td className="text-center">{prod?.existencia ?? '-'}</td>
                            <td className="text-center text-danger">{prod?.bajas ?? '-'}</td>
                            <td className="text-center text-success">{prod?.alta ?? '-'}</td>
                          </React.Fragment>
                        )
                      })}
                      <td className="text-center">{d.rotacion}</td>
                      <td>
                        {d.estatus === 'liberado' ? (
                          <span className="text-success small fw-semibold">Liberado</span>
                        ) : (
                          <Form.Select
                            id={`estatus-${d.id}`}
                            size="sm"
                            bsPrefix="form-select form-select-sm"
                            defaultValue={d.estatus || 'pendiente'}
                            onChange={() => updVisita(d.id)}
                            style={{ fontSize: '.7rem', padding: '.1rem .3rem', minHeight: 'auto' }}
                          >
                            <option>pendiente</option>
                            <option>liberado</option>
                          </Form.Select>
                        )}
                      </td>
                      <td className="text-center">
                        {d.img ? (
                          <a href={d.img} download className="btn btn-sm btn-outline-primary py-0 px-1" style={{ fontSize: '.7rem' }}>
                            📎
                          </a>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </div>
        )}
      </div>
    </>
  )
}
