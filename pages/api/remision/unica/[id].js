import { prisma } from '../../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { id } = req.query

  const liquidaciones = await prisma.liquidacion.findMany({
    where: { fechaLiquidacion: id },
    include: { productos: true }
  })

  const data = liquidaciones.map(l => ({
    numeroRemision: l.numeroRemison,
    nombreTienda: l.nombreTienda,
    TDA: l.TDA,
    vendedor: l.vendedor,
    fechaRemision: l.fechaLiquidacion,
    folioLiquidacion: l.folioLiquidacion,
    totalsinieps: l.montoFactura,
    ieps: 0,
    total: l.montoFactura,
    producto: l.productos.map(p => ({ nombre: p.nombre, numero: p.existencia }))
  }))

  res.json({ data })
}
