import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { canal, clave, nombreCliente, razonSocial, productos } = req.body

  const cliente = await prisma.cliente.create({
    data: {
      canal, clave, nombreCliente, razonSocial,
      productos: {
        create: (productos || []).map(p => ({
          nombre: p.nombre,
          precio: parseFloat(p.precio),
          codigoBarras: p.codigoBarras
        }))
      }
    },
    include: { productos: true }
  })

  res.json({ data: cliente })
}
