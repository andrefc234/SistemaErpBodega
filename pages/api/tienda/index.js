import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { query: { tda } } = req
    if (tda) {
      const tienda = await prisma.tienda.findMany({
        where: { TDA: tda },
        include: { diasPromotoria: true, diasEntrega: true }
      })
      return res.json({ data: tienda })
    }

    const tiendas = await prisma.tienda.findMany({
      include: { diasPromotoria: true, diasEntrega: true }
    })

    const userIds = tiendas.flatMap(t => [t.empleadoPromotoriaId, t.empleadoEntregaId]).filter(Boolean)
    const users = userIds.length > 0 ? await prisma.user.findMany({ where: { id: { in: userIds } } }) : []
    const userMap = Object.fromEntries(users.map(u => [u.id, u.nombre]))

    const data = tiendas.map(t => ({
      ...t,
      empleadoPromotoria: t.empleadoPromotoriaId ? userMap[t.empleadoPromotoriaId] || null : null,
      empleadoEntrega: t.empleadoEntregaId ? userMap[t.empleadoEntregaId] || null : null,
    }))
    return res.json({ data })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
