import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const facturas = await prisma.facturacion.findMany()
    return res.json({ data: facturas })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
