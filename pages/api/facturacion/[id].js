import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { id } = req.query
  const facturas = await prisma.facturacion.findMany({
    where: { fechaFacturacion: id }
  })

  res.json({ data: facturas })
}
