import { prisma } from '../../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { limit, sort, fecha, tienda, vendedor } = req.query

  const where = {}

  if (fecha) where.fecha = fecha
  if (tienda) where.nombreTienda = { contains: tienda, mode: 'insensitive' }
  if (vendedor) where.promotor = { contains: vendedor, mode: 'insensitive' }

  const orderBy = { fecha: sort === 'asc' ? 'asc' : 'desc' }

  const visitas = await prisma.visita.findMany({
    where,
    orderBy,
    take: limit ? parseInt(limit) : undefined,
    include: { productos: true }
  })

  res.json({ data: visitas })
}
