import { defineEventHandler, readBody } from 'h3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '~/server/models/User';
import { connectToDatabase } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  await connectToDatabase();

  const { email, password } = await readBody(event);

  // Проверка пользователя
  const user = await User.findOne({ email });
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials',
    });
  }

  // Проверка пароля
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials',
    });
  }

  // Создание JWT
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: '1h',
  });

  return { token };
});