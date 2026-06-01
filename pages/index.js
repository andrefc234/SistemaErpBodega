import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import 'bootstrap/dist/css/bootstrap.min.css'

import Shell from '../components/Layout/Shell'
import ViewRouter from '../components/Dashboard/ViewRouter'
import { NavigationProvider } from '../context/NavigationContext'

export default function Home({ data }) {
  const [user, setUser] = useState(null)
  const [userName, setUserName] = useState(null)
  const [userRole, setUserRole] = useState(null)
  useEffect(() => {
    if (data && data[0] !== undefined) {
      setUser(data[0])
      setUserName(data[1])
      setUserRole(data[2])
    }
  }, [data])

  const isLoggedIn = !!(data?.[2])

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-primary-900">
        <Head>
          <title>Comercialización</title>
        </Head>
        <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-extrabold text-primary-800">C</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">CERVECERÍA</h1>
          <p className="text-gray-500 mb-8">Sistema de Gestión</p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-2xl bg-primary-800 text-white font-bold text-lg hover:bg-primary-900 transition-colors"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    )
  }

  return (
    <NavigationProvider>
      <Head>
        <title>Comercialización — {userName || 'Dashboard'}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Shell userName={userName} userRole={userRole}>
        <ViewRouter user={userName} userRole={userRole} />
      </Shell>
    </NavigationProvider>
  )
}

Home.getInitialProps = async (ctx) => {
  const cookieHeader = ctx.req ? ctx.req.headers.cookie : null
  const result = []
  const baseUrl = ctx.req ? `http://${ctx.req.headers.host}` : ''

  try {
    const res = await fetch(`${baseUrl}/api/auth/me`, {
      method: 'GET',
      headers: { cookie: cookieHeader },
    })
    const json = await res.json()
    const jsondta = json.data
    for (const i in jsondta) result.push(jsondta[i])
  } catch (e) {
    // Not authenticated
  }

  return { data: result }
}
