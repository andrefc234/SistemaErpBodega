import { IncomingForm } from 'formidable'

export async function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({ keepExtensions: true })
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err)
      const flatFields = {}
      for (const [key, val] of Object.entries(fields)) {
        flatFields[key] = Array.isArray(val) ? val[0] : val
      }
      resolve({ fields: flatFields, files })
    })
  })
}
