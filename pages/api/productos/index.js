import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const productos = await prisma.producto.findMany()
    return res.json({ data: productos })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
