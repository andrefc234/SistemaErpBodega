import { prisma } from '../../../lib/prisma'
import { parseForm } from '../../../lib/parseForm'

export const config = { api: { bodyParser: false } }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { fields } = await parseForm(req)

    const producto = await prisma.producto.create({
      data: {
        nombre: fields.nombre,
        codigoBarras: fields.codigoBarras,
        descripcion: fields.descripcion,
      }
    })

    res.json({ data: producto })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
