import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import createHttpError from 'http-errors';

import { UsersCollection } from '../models/user.js';
import { SessionsCollection } from '../models/session.js';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/index.js';

export const registerUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });

  if (user) throw createHttpError(409, 'Email in use');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });

  if (!user) throw createHttpError(404, 'User not found');

  const isEqual = await bcrypt.compare(payload.password, user.password);

  if (!isEqual) throw createHttpError(401, 'Unauthorized');

  await SessionsCollection.deleteOne({ userId: user._id });

  const session = createSession(user._id);

  await SessionsCollection.create(session);

  return session;
};

const createSession = (userId) => {
  const sessionId = randomBytes(16).toString('hex');
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    sessionId,
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  };
};

export const refreshSession = async ({ sessionId, refreshToken }) => {
  try {
    const session = await SessionsCollection.findOne({
      sessionId,
      refreshToken,
    });

    if (!session) {
      console.log('Session not found in database');
      throw createHttpError(401, 'Session not found');
    }

    console.log('Session found:', session);

    const isSessionTokenExpired =
      new Date() > new Date(session.refreshTokenValidUntil);

    if (isSessionTokenExpired) {
      throw createHttpError(401, 'Session token expired');
    }

    await SessionsCollection.deleteOne({ sessionId, refreshToken });

    const newSession = createSession(session.userId);

    await SessionsCollection.create(newSession);
    console.log('New session saved to database');

    return newSession;
  } catch (error) {
    console.error('Error in refreshSession:', error);
    throw error;
  }
};

export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({
    sessionId: sessionId,
  });
};
