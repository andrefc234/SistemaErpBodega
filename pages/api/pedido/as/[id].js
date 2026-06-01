import { prisma } from '../../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { id } = req.query
  const pedidos = id
    ? await prisma.pedido.findMany({ where: { TDA: id }, include: { productos: true } })
    : await prisma.pedido.findMany({ include: { productos: true } })

  res.json({ data: pedidos })
}
