import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const clientes = await prisma.cliente.findMany({
      include: { productos: true }
    })
    return res.json({ data: clientes })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
