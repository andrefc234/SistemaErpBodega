import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { fecha, TDA, tipoMovimiento, nombreTienda, nombre, producto } = req.body

  const cambio = await prisma.cambio.create({
    data: {
      fecha, TDA, tipoMovimiento, nombreTienda, nombre,
      productos: {
        create: (producto || []).map(p => ({
          nombre: p.nombre,
          numero: parseInt(p.numero) || 0
        }))
      }
    },
    include: { productos: true }
  })

  res.json({ data: cambio })
}
