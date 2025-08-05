import { defineEventHandler } from 'h3';
import jwt from 'jsonwebtoken';
import User from '~/server/models/User';
import { connectToDatabase } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  await connectToDatabase();
  const authHeader = event.node.req.headers.authorization;
  console.log('Authorization header:', authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No token provided');
    throw createError({ statusCode: 401, statusMessage: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw createError({ statusCode: 500, statusMessage: 'JWT secret not configured' });
    }
    const decoded = jwt.verify(token, jwtSecret);
    if (
      !decoded ||
      typeof decoded !== 'object' ||
      !('userId' in decoded) ||
      typeof (decoded as any).userId !== 'string'
    ) {
      throw createError({ statusCode: 401, statusMessage: 'Invalid token payload' });
    }
    console.log('Decoded token:', decoded);
    const user = await User.findById((decoded as any).userId).select('-password');
    if (!user) {
      console.log('User not found for ID:', decoded.userId);
      throw createError({ statusCode: 404, statusMessage: 'User not found' });
    }
    console.log('Profile fetched:', { email: user.email, id: user._id });
    return user;
  } catch (error) {
    console.error('Profile fetch error:', error);
    const err = error as { name?: string };
    throw createError({
      statusCode: err.name === 'JsonWebTokenError' ? 401 : 500,
      statusMessage: err.name === 'JsonWebTokenError' ? 'Invalid token' : 'Failed to fetch profile',
    });
  }
});