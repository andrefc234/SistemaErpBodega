import { prisma } from '../../../lib/prisma'
import { signToken } from '../../../lib/auth'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { clave, password } = req.body
  if (!clave || !password) return res.status(400).json({ error: true, message: 'Faltan campos' })

  const user = await prisma.user.findUnique({ where: { clave } })
  if (!user) return res.status(401).json({ error: true, message: 'Credenciales inválidas' })

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return res.status(401).json({ error: true, message: 'Credenciales inválidas' })

  const token = signToken({ id: user.id, nombre: user.nombre, role: user.role })

  res.setHeader('Set-Cookie', `token=${token}; Path=/; HttpOnly; Max-Age=172800`)
  res.json({ token, data: { id: user.id, nombre: user.nombre, role: user.role } })
}
