import { defineEventHandler } from 'h3'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async event => {
  // Пропускаем проверку токена для публичных маршрутов
  const publicRoutes = ['/', '/login', '/register']
  if (publicRoutes.some(route => event.path?.startsWith(route))) {
    return
  }
  const authHeader = getHeader(event, 'authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'No token provided',
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
    if (
      typeof decoded === 'object' &&
      decoded !== null &&
      'userId' in decoded
    ) {
      event.context.userId = (decoded as jwt.JwtPayload).userId // Сохраняем userId для эндпоинтов
    } else {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid token payload',
      })
    }
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid token',
    })
  }
})
