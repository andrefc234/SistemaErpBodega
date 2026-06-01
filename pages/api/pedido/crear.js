import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { TDA, fechaP, fechaE, nombreCliente, canal, productos } = req.body

  const pedido = await prisma.pedido.create({
    data: {
      TDA, fechaP, fechaE, nombreCliente, canal,
      estatus: 'pendiente',
      productos: {
        create: (productos || []).map(p => ({
          nombre: p.nombre,
          numero: parseInt(p.numero) || 0,
          cantidad: parseInt(p.cantidad) || null
        }))
      }
    },
    include: { productos: true }
  })

  res.json({ data: pedido })
}
