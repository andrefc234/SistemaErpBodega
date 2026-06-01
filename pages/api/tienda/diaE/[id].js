import { prisma } from '../../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' })

  const { id } = req.query
  const { diaE } = req.body

  await prisma.diaEntrega.deleteMany({ where: { tiendaId: id } })
  await prisma.diaEntrega.createMany({
    data: (diaE || []).map(d => ({ tiendaId: id, dia: d.dia }))
  })

  res.json({ data: { diaE } })
}
