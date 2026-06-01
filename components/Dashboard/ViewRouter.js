import { useNavigation } from '../../context/NavigationContext'
import Card from '../ui/Card'
import PageHeader from '../ui/PageHeader'
import AdminDashboard from './AdminDashboard'
import PromotorDashboard from './PromotorDashboard'
import ProductosUser from '../DatosMaestros/ProductoUser'
import ClienteAdmin from '../DatosMaestros/ClienteAdmin'
import TiendaUser from '../DatosMaestros/TiendaUser'
import CrearProducto from '../Crear/CrearProducto'
import CrearCliente from '../Crear/CrearCliente'
import CrearTienda from '../Crear/CrearTienda'
import CrearUsuarioAd from '../Crear/CrearUsuarioAd'
import CrearVisita from '../Promotoria/CrearVisita'
import VerVisitaAdmin from '../Promotoria/VerVisitaAdmin'
import CrearLiquidacion from '../Crear/CrearLiquidaciones'
import LiquidacionAdmin from '../Liquidacion/LiquidacionAdmin'
import Almacen from '../Almacen/Almacen'
import Fabricante from '../Almacen/Fabricante'
import VerPedido from '../Almacen/VerPedido'
import {
  VerPicking, VerPickingTD,
  CrearRemision, CrearFactura, VerFactura,
} from '../Layout'

const viewMeta = {
  productos: { title: 'Productos', section: 'Datos Maestros' },
  tiendas: { title: 'Tiendas', section: 'Datos Maestros' },
  clientes: { title: 'Clientes', section: 'Datos Maestros' },
  crearProducto: { title: 'Agregar Producto', section: 'Configuración Base' },
  crearCliente: { title: 'Agregar Cliente', section: 'Configuración Base' },
  crearTienda: { title: 'Agregar Tienda', section: 'Configuración Base' },
  crearUsuario: { title: 'Agregar Empleado', section: 'Configuración Base' },
  crearVisita: { title: 'Registrar Visita', section: 'Capturas' },
  verVisitas: { title: 'Consultar Visitas', section: 'Promotoría' },
  liquidacionCrear: { title: 'Captura de Folios', section: 'Liquidaciones' },
  liquidacionVer: { title: 'Liquidaciones Diarias', section: 'Liquidaciones' },
  fabricante: { title: 'Pedidos a Fabricante', section: 'Almacén' },
  pedidos: { title: 'Consulta de Pedidos', section: 'Almacén' },
  almacen: { title: 'Productos en Almacén', section: 'Almacén' },
  verPicking: { title: 'Picking List', section: 'Picking List' },
  verPickingPendientes: { title: 'Pendientes', section: 'Picking List' },
  remision: { title: 'Remisión', section: 'Liquidaciones' },
  facturacionCrear: { title: 'Captura de Facturas', section: 'Facturación' },
  facturacionVer: { title: 'Facturación por Mes', section: 'Facturación' },
}

export default function ViewRouter({ user, userRole }) {
  const { activeView, navigate } = useNavigation()

  const role = userRole || 'admin'
  const isAdmin = role === 'admin'

  // Role-based dashboard when no view is selected
  if (!activeView) {
    return isAdmin
      ? <AdminDashboard user={user} />
      : <PromotorDashboard user={user} />
  }

  const meta = viewMeta[activeView] || {}
  const breadcrumb = meta.section ? [meta.section, meta.title] : [activeView]

  const views = {
    productos: ProductosUser,
    tiendas: TiendaUser,
    clientes: ClienteAdmin,
    crearProducto: CrearProducto,
    crearCliente: CrearCliente,
    crearTienda: CrearTienda,
    crearUsuario: CrearUsuarioAd,
    crearVisita: CrearVisita,
    verVisitas: VerVisitaAdmin,
    liquidacionCrear: CrearLiquidacion,
    liquidacionVer: LiquidacionAdmin,
    fabricante: Fabricante,
    pedidos: VerPedido,
    almacen: Almacen,
    verPicking: VerPicking,
    verPickingPendientes: VerPickingTD,
    remision: CrearRemision,
    facturacionCrear: CrearFactura,
    facturacionVer: VerFactura,
  }

  const Component = views[activeView]
  if (Component) {
    return (
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title={meta.title}
          breadcrumbs={breadcrumb}
          action={
            activeView === 'crearVisita' ? null : undefined
          }
        />
        <Card>
          <Component user={user} />
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-8 text-center text-slate-500">
      Vista &ldquo;{activeView}&rdquo; no disponible
    </div>
  )
}
