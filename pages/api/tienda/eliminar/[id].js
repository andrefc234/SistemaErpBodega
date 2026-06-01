import { prisma } from '../../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' })

  const { id } = req.query

  await prisma.diaPromotoria.deleteMany({ where: { tiendaId: id } })
  await prisma.diaEntrega.deleteMany({ where: { tiendaId: id } })
  await prisma.tienda.delete({ where: { id } })

  res.json({ data: { id } })
}
