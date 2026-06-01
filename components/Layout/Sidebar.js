import { motion, AnimatePresence } from 'framer-motion'
import {
  Database, Warehouse, PenTool, ListChecks, Calculator, Receipt,
  UserCheck, Settings, Package, Store, Users, Truck, ClipboardList,
  Eye, Clock, FilePlus, FileText, Send, Calendar, Search,
  UserPlus, PackagePlus, ClipboardCheck, ChevronDown, ChevronLeft,
  Menu, LogOut,
} from 'lucide-react'
import { useNavigation, NAV_ITEMS } from '../../context/NavigationContext'
import cookie from 'js-cookie'
import Router from 'next/router'

const iconMap = {
  Database, Warehouse, PenTool, ListChecks, Calculator, Receipt,
  UserCheck, Settings, Package, Store, Users, Truck, ClipboardList,
  Eye, Clock, FilePlus, FileText, Send, Calendar, Search,
  UserPlus, PackagePlus, ClipboardCheck,
}

export default function Sidebar({ userName, userRole }) {
  const {
    sidebarOpen, mobileOpen, activeView, expandedSections,
    toggleSidebar, toggleMobile, toggleSection, navigate,
  } = useNavigation()

  const handleLogout = () => {
    cookie.remove('token')
    Router.push('/')
  }

  const isAdmin = userRole === 'admin'
  const filteredNav = NAV_ITEMS.filter(section =>
    isAdmin || section.section !== 'Configuración Base'
  )

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-700/50">
        {sidebarOpen && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-700 flex items-center justify-center text-white font-extrabold text-sm shadow-sm">
              C
            </div>
            <span className="text-base font-bold tracking-tight text-white">
              CERVECERÍA
            </span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg hover:bg-slate-700/50 transition-colors text-slate-400 hover:text-white"
        >
          <ChevronLeft size={16} className={`transition-transform ${!sidebarOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {filteredNav.map(section => {
          const SectionIcon = iconMap[section.icon] || Database
          const isExpanded = expandedSections[section.section]
          const hasActive = section.items.some(i => i.view === activeView)

          return (
            <div key={section.section}>
              <button
                onClick={() => toggleSection(section.section)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150
                  ${hasActive
                    ? 'text-white bg-brand-700/20'
                    : 'text-slate-500 hover:text-white hover:bg-slate-700/50'
                  }
                  ${!sidebarOpen ? 'justify-center' : ''}
                `}
                title={!sidebarOpen ? section.section : undefined}
              >
                <SectionIcon size={18} strokeWidth={1.5} className={hasActive ? 'text-brand-400' : 'text-slate-500'} />
                {sidebarOpen && (
                  <>
                    <span className="flex-1 text-left text-sm font-medium">{section.section}</span>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={14} className="text-slate-500" />
                    </motion.div>
                  </>
                )}
              </button>

              <AnimatePresence initial={false}>
                {sidebarOpen && isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="ml-3 mt-0.5 space-y-0.5 border-l border-slate-700/50 pl-3">
                      {section.items.map(item => {
                        const ItemIcon = iconMap[item.icon] || Package
                        const isActive = activeView === item.view
                        return (
                          <button
                            key={item.view}
                            onClick={() => navigate(item.view)}
                            className={`
                              relative w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150
                              ${isActive
                                ? 'bg-brand-700/20 text-white font-medium'
                                : 'text-slate-500 hover:text-slate-200 hover:bg-slate-700/30'
                              }
                            `}
                          >
                            {isActive && (
                              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-brand-500 rounded-full" />
                            )}
                            <ItemIcon size={15} strokeWidth={1.5} className={isActive ? 'text-brand-400' : 'text-slate-500'} />
                            <span>{item.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </nav>

      <div className="p-3 border-t border-slate-700/50">
        {sidebarOpen && userName && (
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-brand-700 flex items-center justify-center text-xs font-bold text-white">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">{userName}</p>
              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                isAdmin ? 'bg-amber-400/20 text-amber-400' : 'bg-blue-400/20 text-blue-400'
              }`}>
                {isAdmin ? 'Admin' : 'Promotor'}
              </span>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`
            w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
            text-slate-400 hover:text-red-400 hover:bg-slate-700/50 transition-colors duration-150
            ${!sidebarOpen ? 'justify-center' : ''}
          `}
          title={!sidebarOpen ? 'Salir' : ''}
        >
          <LogOut size={16} strokeWidth={1.5} />
          {sidebarOpen && <span>Cerrar sesión</span>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden" onClick={toggleMobile} />
      )}

      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed inset-y-0 left-0 z-40 w-72 bg-slate-900 shadow-xl lg:hidden"
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>

      <aside className={`hidden lg:flex flex-col bg-slate-900 shadow-sm transition-all duration-300 ease-out ${sidebarOpen ? 'w-64' : 'w-16'}`}>
        {sidebarContent}
      </aside>

      <button
        onClick={toggleMobile}
        className="lg:hidden fixed top-3 left-3 z-50 p-2 rounded-lg bg-slate-900 text-white shadow-card hover:bg-slate-800 transition-colors"
      >
        <Menu size={20} />
      </button>
    </>
  )
}
