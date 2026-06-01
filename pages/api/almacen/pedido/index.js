import { prisma } from '../../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const pedidos = await prisma.pedido.findMany({
      include: { productos: true }
    })
    return res.json({ data: pedidos })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
