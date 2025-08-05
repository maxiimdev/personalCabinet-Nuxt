import { defineEventHandler, readBody } from 'h3'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '~/server/models/User'
import { connectToDatabase } from '~/server/utils/db'

export default defineEventHandler(async event => {
  await connectToDatabase()
  const { email, password, name } = await readBody(event)
  console.log('Register attempt:', { email, name })

  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      console.log('User already exists:', email)
      throw createError({
        statusCode: 400,
        statusMessage: 'Email already exists',
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    console.log('Hashed password:', hashedPassword)
    const user = new User({
      email,
      password: hashedPassword,
      name,
    })
    await user.save()
    console.log('User saved:', { email, id: user._id })

    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is not set')
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret, {
      expiresIn: '1h',
    })
    console.log('Token generated:', token)
    return { message: 'User created', token }
  } catch (error) {
    console.error('Registration error:', error)
    const err = error as { statusCode?: number; statusMessage?: string }
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || 'Failed to register user',
    })
  }
})
