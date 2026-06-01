import { prisma } from '../../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { id } = req.query
  const liquidaciones = await prisma.liquidacion.findMany({
    where: { fechaLiquidacion: id },
    include: { productos: true }
  })

  res.json({ data: liquidaciones })
}
