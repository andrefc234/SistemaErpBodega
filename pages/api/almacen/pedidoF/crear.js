import { prisma } from '../../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { fecha, productos } = req.body

  const pedido = await prisma.pedidoFabricante.create({
    data: {
      fecha,
      productos: {
        create: (productos || []).map(p => ({
          nombre: p.nombre,
          cantidad: parseInt(p.cantidad) || 0
        }))
      }
    },
    include: { productos: true }
  })

  res.json({ data: pedido })
}
