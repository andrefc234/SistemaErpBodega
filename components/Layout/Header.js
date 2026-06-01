import { useNavigation, NAV_ITEMS } from '../../context/NavigationContext'
import { LogOut, ChevronRight } from 'lucide-react'
import cookie from 'js-cookie'
import Router from 'next/router'

export default function Header({ userName, userRole }) {
  const { activeView } = useNavigation()

  const currentItem = NAV_ITEMS
    .flatMap(s => s.items)
    .find(i => i.view === activeView)

  const currentSection = NAV_ITEMS.find(s =>
    s.items.some(i => i.view === activeView)
  )

  const handleLogout = () => {
    cookie.remove('token')
    Router.push('/')
  }

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-1.5 text-sm">
            {currentSection && (
              <>
                <span className="text-slate-500 font-medium">{currentSection.section}</span>
                <ChevronRight size={14} className="text-slate-400" />
              </>
            )}
            <span className="text-slate-900 font-semibold">
              {currentItem?.label || 'Dashboard'}
            </span>
          </div>
          <div className="lg:hidden flex items-center gap-2 ml-12">
            <div className="w-7 h-7 rounded-md bg-brand-700 flex items-center justify-center text-white font-bold text-xs shadow-sm">
              C
            </div>
            <span className="font-bold text-slate-900">CERVECERÍA</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2.5 pr-3 border-r border-slate-200">
            <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm">
              {userName ? userName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-900 leading-tight">
                {userName || 'Usuario'}
              </p>
              <p className="text-xs text-slate-500 leading-tight capitalize">
                {userRole || ''}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Cerrar sesión"
          >
            <LogOut size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </header>
  )
}
