import { prisma } from '../../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' })

  const { id } = req.query
  const { diaP } = req.body

  await prisma.diaPromotoria.deleteMany({ where: { tiendaId: id } })
  await prisma.diaPromotoria.createMany({
    data: (diaP || []).map(d => ({ tiendaId: id, dia: d.dia }))
  })

  res.json({ data: { diaP } })
}
