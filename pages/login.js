import { useState } from 'react'
import Head from 'next/head'
import 'bootstrap/dist/css/bootstrap.min.css'
import { FileSpreadsheet, LogIn } from 'lucide-react'
import Router from 'next/router'
import cookie from 'js-cookie'

export default function LoginPage() {
  const [clave, setClave] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clave, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Credenciales inválidas')
        setLoading(false)
        return
      }
      cookie.set('token', data.token, { expires: 2 })
      Router.push('/')
    } catch {
      setError('Error de conexión')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 p-4">
      <Head>
        <title>Iniciar Sesión — Cervecería</title>
      </Head>

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-primary-800 px-8 py-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 mb-4">
            <FileSpreadsheet size={36} className="text-white" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-extrabold text-white mb-1">CERVECERÍA</h1>
          <p className="text-primary-200 text-sm">Sistema de Gestión</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Clave de usuario
            </label>
            <input
              type="text"
              value={clave}
              onChange={e => setClave(e.target.value)}
              placeholder="Tu clave"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 bg-gray-50
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                placeholder-gray-400 text-base transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 bg-gray-50
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                placeholder-gray-400 text-base transition-all"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl
              bg-primary-800 text-white font-bold text-lg
              hover:bg-primary-900 disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors"
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <LogIn size={20} />
            )}
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
