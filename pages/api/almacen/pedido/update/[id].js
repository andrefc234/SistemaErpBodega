import { prisma } from '../../../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' })

  const { id } = req.query
  const data = await prisma.pedido.update({ where: { id }, data: req.body })

  res.json({ data })
}
