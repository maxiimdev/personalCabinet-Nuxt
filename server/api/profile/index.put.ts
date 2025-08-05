import { defineEventHandler, readBody } from 'h3'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '~/server/models/User'
import { connectToDatabase } from '~/server/utils/db'

export default defineEventHandler(async event => {
  await connectToDatabase()
  const authHeader = event.node.req.headers.authorization
  console.log('Authorization header:', authHeader)
  const { name, email, password } = await readBody(event)
  console.log('Update profile attempt:', {
    name,
    email,
    hasPassword: !!password,
  })

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No token provided')
    throw createError({ statusCode: 401, statusMessage: 'No token provided' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      throw createError({
        statusCode: 500,
        statusMessage: 'JWT secret not configured',
      })
    }
    const decoded = jwt.verify(token, jwtSecret)
    if (
      !decoded ||
      typeof decoded !== 'object' ||
      !('userId' in decoded) ||
      typeof (decoded as any).userId !== 'string'
    ) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid token payload',
      })
    }
    console.log('Decoded token:', decoded)
    const user = await User.findById((decoded as { userId: string }).userId)
    if (!user) {
      console.log('User not found for ID:', decoded.userId)
      throw createError({ statusCode: 404, statusMessage: 'User not found' })
    }

    user.name = name || user.name
    user.email = email || user.email
    if (password) {
      user.password = await bcrypt.hash(password, 10)
      console.log('Password updated for user:', user._id)
    }
    await user.save()
    console.log('Profile updated:', { email: user.email, id: user._id })

    return user
  } catch (error) {
    console.error('Profile update error:', error)
    const err = error as { name?: string }
    throw createError({
      statusCode: err.name === 'JsonWebTokenError' ? 401 : 500,
      statusMessage:
        err.name === 'JsonWebTokenError'
          ? 'Invalid token'
          : 'Failed to update profile',
    })
  }
})
