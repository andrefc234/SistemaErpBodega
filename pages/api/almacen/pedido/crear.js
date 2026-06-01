import { prisma } from '../../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { TDA, fecha, empleado, productos, estatus, totalPedido, fechaPromotoria } = req.body

  const pedido = await prisma.pedido.create({
    data: {
      TDA,
      empleado,
      estatus: estatus || 'pendiente',
      totalPedido: parseInt(totalPedido) || 0,
      fechaPromotoria,
      productos: {
        create: (productos || []).map(p => ({
          nombre: p.nombre,
          numero: parseInt(p.numero) || parseInt(p.cantidad) || 0,
          cantidad: parseInt(p.cantidad) || parseInt(p.numero) || 0
        }))
      }
    },
    include: { productos: true }
  })

  res.json({ data: pedido })
}
