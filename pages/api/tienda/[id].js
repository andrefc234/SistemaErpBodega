import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'PUT') {
    const { nombreTienda, TDA, empleadoPromotoria, empleadoEntrega } = req.body

    let empleadoPromotoriaId = null
    let empleadoEntregaId = null

    if (empleadoPromotoria && empleadoPromotoria !== '-') {
      const up = await prisma.user.findFirst({ where: { nombre: empleadoPromotoria } })
      if (up) empleadoPromotoriaId = up.id
    }
    if (empleadoEntrega && empleadoEntrega !== '-') {
      const ue = await prisma.user.findFirst({ where: { nombre: empleadoEntrega } })
      if (ue) empleadoEntregaId = ue.id
    }

    const data = await prisma.tienda.update({
      where: { id },
      data: {
        nombreTienda: nombreTienda || undefined,
        TDA: TDA || undefined,
        empleadoPromotoriaId,
        empleadoEntregaId
      }
    })

    return res.json({ data })
  }

  if (req.method === 'DELETE') {
    await prisma.diaPromotoria.deleteMany({ where: { tiendaId: id } })
    await prisma.diaEntrega.deleteMany({ where: { tiendaId: id } })
    await prisma.tienda.delete({ where: { id } })
    return res.json({ data: { id } })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
