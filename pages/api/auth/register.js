import { prisma } from '../../../lib/prisma'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { nombre, clave, telefono, numLicencia, role, password } = req.body
  if (!nombre || !clave || !password) return res.status(400).json({ error: true, message: 'Faltan campos requeridos' })

  const exists = await prisma.user.findUnique({ where: { clave } })
  if (exists) return res.status(400).json({ error: true, message: 'La clave ya existe' })

  const hashed = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: { nombre, clave, telefono, numLicencia, role, password: hashed }
  })

  res.json({ data: { id: user.id, nombre: user.nombre, role: user.role } })
}
