import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const data = await prisma.facturacion.create({
    data: req.body
  })

  res.json({ data })
}
