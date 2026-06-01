import { prisma } from '../../../lib/prisma'
import { getUserFromReq } from '../../../lib/auth'

export default async function handler(req, res) {
  const user = getUserFromReq(req)
  if (!user) return res.status(401).json({ error: 'No autorizado' })

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
  if (!dbUser) return res.status(401).json({ error: 'Usuario no encontrado' })

  res.json({ data: { id: dbUser.id, nombre: dbUser.nombre, role: dbUser.role } })
}
