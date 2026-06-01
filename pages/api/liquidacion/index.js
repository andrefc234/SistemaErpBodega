import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { from, to } = req.query
  const where = {}
  if (from || to) {
    where.fechaLiquidacion = {}
    if (from) where.fechaLiquidacion.gte = from
    if (to) where.fechaLiquidacion.lte = to
  }

  const liquidaciones = await prisma.liquidacion.findMany({
    where,
    include: { productos: true },
    orderBy: { createdAt: 'desc' }
  })

  const totals = liquidaciones.reduce((acc, l) => ({
    montoFactura: acc.montoFactura + (l.montoFactura || 0),
    piezasEntregadas: acc.piezasEntregadas + (l.piezasEntregadas || 0),
  }), { montoFactura: 0, piezasEntregadas: 0 })

  res.json({ data: liquidaciones, totals, count: liquidaciones.length })
}
