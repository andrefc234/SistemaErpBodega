import Sidebar from './Sidebar'
import Header from './Header'

export default function Shell({ children, userName, userRole }) {
  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar userName={userName} userRole={userRole} />
      <div className="flex flex-col flex-1 min-w-0">
        <Header userName={userName} userRole={userRole} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
