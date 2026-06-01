import { prisma } from '../../../../lib/prisma'
import { parseForm } from '../../../../lib/parseForm'

export const config = { api: { bodyParser: false } }

export default async function handler(req, res) {
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' })

  const { id } = req.query

  try {
    const contentType = req.headers['content-type'] || ''

    if (contentType.includes('multipart/form-data')) {
      const { fields } = await parseForm(req)
      const data = {}
      if (fields.nombre) data.nombre = fields.nombre
      if (fields.codigoBarras) data.codigoBarras = fields.codigoBarras
      if (fields.descripcion) data.descripcion = fields.descripcion

      const producto = await prisma.producto.update({ where: { id }, data })
      return res.json({ data: producto })
    }

    const producto = await prisma.producto.update({ where: { id }, data: req.body })
    res.json({ data: producto })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
