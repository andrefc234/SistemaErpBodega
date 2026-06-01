import { prisma } from '../../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' })

  const { id } = req.query
  const { cantidadAlmacen } = req.body

  const producto = await prisma.producto.update({
    where: { id },
    data: { cantidadAlmacen: parseInt(cantidadAlmacen) }
  })

  res.json({ data: producto })
}
