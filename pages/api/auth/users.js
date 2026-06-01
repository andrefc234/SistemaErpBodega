import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  const users = await prisma.user.findMany({
    select: { id: true, nombre: true, role: true, clave: true }
  })
  res.json({ data: users })
}
