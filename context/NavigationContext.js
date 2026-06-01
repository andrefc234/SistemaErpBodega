import { createContext, useContext, useState, useCallback } from 'react'

const NavigationContext = createContext(null)

export const NAV_ITEMS = [
  {
    section: 'Datos Maestros',
    icon: 'Database',
    items: [
      { label: 'Productos', view: 'productos', icon: 'Package' },
      { label: 'Tiendas', view: 'tiendas', icon: 'Store' },
      { label: 'Clientes', view: 'clientes', icon: 'Users' },
    ],
  },
  {
    section: 'Almacén',
    icon: 'Warehouse',
    items: [
      { label: 'Fabricante', view: 'fabricante', icon: 'Truck' },
      { label: 'Consulta de Pedidos', view: 'pedidos', icon: 'ClipboardList' },
      { label: 'Ver productos en almacén', view: 'almacen', icon: 'Package' },
    ],
  },
  {
    section: 'Capturas',
    icon: 'PenTool',
    items: [
      { label: 'Visita', view: 'crearVisita', icon: 'ClipboardCheck' },
    ],
  },
  {
    section: 'Picking List',
    icon: 'ListChecks',
    items: [
      { label: 'Consultar picking list', view: 'verPicking', icon: 'Eye' },
      { label: 'Consultar sin liberar', view: 'verPickingPendientes', icon: 'Clock' },
    ],
  },
  {
    section: 'Liquidaciones',
    icon: 'Calculator',
    items: [
      { label: 'Captura de folios', view: 'liquidacionCrear', icon: 'FilePlus' },
      { label: 'Liquidaciones diarias', view: 'liquidacionVer', icon: 'FileText' },
      { label: 'Remisión', view: 'remision', icon: 'Send' },
    ],
  },
  {
    section: 'Facturación',
    icon: 'Receipt',
    items: [
      { label: 'Captura de Facturas', view: 'facturacionCrear', icon: 'FilePlus' },
      { label: 'Facturación por mes', view: 'facturacionVer', icon: 'Calendar' },
    ],
  },
  {
    section: 'Promotoría',
    icon: 'UserCheck',
    items: [
      { label: 'Consultar visitas', view: 'verVisitas', icon: 'Search' },
    ],
  },
  {
    section: 'Configuración Base',
    icon: 'Settings',
    items: [
      { label: 'Agregar Cliente', view: 'crearCliente', icon: 'UserPlus' },
      { label: 'Agregar Producto', view: 'crearProducto', icon: 'PackagePlus' },
      { label: 'Agregar Tienda', view: 'crearTienda', icon: 'Store' },
      { label: 'Agregar Empleado', view: 'crearUsuario', icon: 'UserPlus' },
    ],
  },
]

export function NavigationProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeView, setActiveView] = useState(null)
  const [expandedSections, setExpandedSections] = useState({})

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev)
  }, [])

  const toggleMobile = useCallback(() => {
    setMobileOpen(prev => !prev)
  }, [])

  const toggleSection = useCallback((section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }))
  }, [])

  const navigate = useCallback((view) => {
    setActiveView(view)
    setMobileOpen(false)
    const section = NAV_ITEMS.find(s => s.items.some(i => i.view === view))
    if (section) {
      setExpandedSections(prev => ({ ...prev, [section.section]: true }))
    }
  }, [])

  return (
    <NavigationContext.Provider value={{
      sidebarOpen, mobileOpen, activeView, expandedSections,
      toggleSidebar, toggleMobile, toggleSection, navigate,
      setActiveView,
    }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const ctx = useContext(NavigationContext)
  if (!ctx) throw new Error('useNavigation must be used within NavigationProvider')
  return ctx
}
