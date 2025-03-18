import {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
  requestResetToken,
  resetPassword,
} from '../services/auth.js';

export const register = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const login = async (req, res) => {
  const { accessToken, refreshToken, sessionId } = await loginUser(req.body);

  if (!sessionId) {
    return res.status(500).json({ message: 'Session ID generation failed' });
  }

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'None',
  });

  res.cookie('sessionId', sessionId, {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'None',
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in a user!',
    data: { accessToken },
  });
};

export const refresh = async (req, res) => {
  const { refreshToken, sessionId } = req.cookies;

  if (!refreshToken || !sessionId) {
    return res
      .status(401)
      .json({ message: 'Refresh token or sessionId is missing' });
  }

  try {
    const {
      accessToken,
      refreshToken: newRefreshToken,
      sessionId: newSessionId,
    } = await refreshSession({ refreshToken, sessionId });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
    });

    res.cookie('sessionId', newSessionId, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: { accessToken },
    });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  if (req.cookies.sessionId) await logoutUser(req.cookies.sessionId);

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

export const requestResetEmailController = async (req, res) => {
  await requestResetToken(req.body.email);

  res.json({
    message: 'Reset password email was successfully sent!',
    status: 200,
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);
  res.json({
    message: 'Password was successfully reset!',
    status: 200,
    data: {},
  });
};
