import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { folioLiquidacion, numeroRemison, nombreTienda, vendedor, fechaLiquidacion, montoFactura, TDA, piezasEntregadas, producto } = req.body

  const liquidacion = await prisma.liquidacion.create({
    data: {
      folioLiquidacion, numeroRemison, nombreTienda, vendedor,
      fechaLiquidacion, TDA,
      montoFactura: parseFloat(montoFactura) || 0,
      piezasEntregadas: parseInt(piezasEntregadas) || 0,
      productos: {
        create: (producto || []).map(p => ({
          nombre: p.nombre,
          existencia: parseInt(p.existencia) || 0
        }))
      }
    },
    include: { productos: true }
  })

  res.json({ data: liquidacion })
}
