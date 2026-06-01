import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { canal, nombreCliente, TDA, nombreTienda, empleadoPromotoria, empleadoEntrega, diaE, diaP } = req.body

  let empleadoPromotoriaId = null
  let empleadoEntregaId = null

  if (empleadoPromotoria) {
    const up = await prisma.user.findFirst({ where: { nombre: empleadoPromotoria } })
    if (up) empleadoPromotoriaId = up.id
  }
  if (empleadoEntrega) {
    const ue = await prisma.user.findFirst({ where: { nombre: empleadoEntrega } })
    if (ue) empleadoEntregaId = ue.id
  }

  const tienda = await prisma.tienda.create({
    data: {
      canal, nombreCliente, TDA, nombreTienda, empleadoPromotoriaId, empleadoEntregaId,
      diasPromotoria: { create: (diaP || []).map(d => ({ dia: d.dia })) },
      diasEntrega: { create: (diaE || []).map(d => ({ dia: d.dia })) }
    },
    include: { diasPromotoria: true, diasEntrega: true }
  })

  res.json({ data: tienda })
}
