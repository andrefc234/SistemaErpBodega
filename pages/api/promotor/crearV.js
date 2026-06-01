import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { nombreTienda, TDA, promotor, productos, fecha, bajasG, altasG, totalP, observaciones, rotacion } = req.body

  const visita = await prisma.visita.create({
    data: {
      folio: `VIS-${Date.now()}`,
      nombreTienda, TDA, promotor, fecha,
      bajasG: parseInt(bajasG) || 0,
      altasG: parseInt(altasG) || 0,
      totalP: parseInt(totalP) || 0,
      observaciones, rotacion,
      estatus: 'pendiente',
      productos: {
        create: (productos || []).map(p => ({
          nombre: p.nombre,
          alta: parseInt(p.alta) || 0,
          bajas: parseInt(p.bajas) || 0,
          existencia: parseInt(p.existencia) || 0
        }))
      }
    },
    include: { productos: true }
  })

  res.json({ data: visita })
}
