import { prisma } from '../../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' })

  const { id } = req.query
  await prisma.clienteProducto.deleteMany({ where: { clienteId: id } })
  await prisma.cliente.delete({ where: { id } })

  res.json({ data: { id } })
}
