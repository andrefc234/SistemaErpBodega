import { prisma } from '../../../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' })

  const { id } = req.query
  const body = req.body

  await prisma.pedidoFabricanteProducto.deleteMany({ where: { pedidoFabricanteId: id } })

  const data = await prisma.pedidoFabricante.update({
    where: { id },
    data: {
      fecha: body.fecha,
      productos: {
        create: (body.productos || []).map(p => ({
          nombre: p.nombre,
          cantidad: parseInt(p.cantidad) || 0
        }))
      }
    },
    include: { productos: true }
  })

  res.json({ data })
}
