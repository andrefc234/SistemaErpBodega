import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'sistema-erp-secret-key'

export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '2d' })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET)
  } catch {
    return null
  }
}

export function getUserFromReq(req) {
  const cookie = req.cookies?.token
  if (!cookie) return null
  return verifyToken(cookie)
}
