import { prisma } from '../../../../lib/prisma'

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'PUT') {
    const { nombre, precio, codigoBarras } = req.body

    const existing = await prisma.clienteProducto.findFirst({
      where: { clienteId: id, nombre }
    })

    if (existing) {
      await prisma.clienteProducto.update({
        where: { id: existing.id },
        data: { precio: parseFloat(precio), codigoBarras }
      })
    } else {
      await prisma.clienteProducto.create({
        data: { clienteId: id, nombre, precio: parseFloat(precio), codigoBarras }
      })
    }

    return res.json({ data: { nombre, precio, codigoBarras } })
  }

  if (req.method === 'DELETE') {
    const { nombre } = req.body
    await prisma.clienteProducto.deleteMany({
      where: { clienteId: id, nombre }
    })
    return res.json({ data: { id, nombre } })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
