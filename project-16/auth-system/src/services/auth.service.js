const prisma = require("../config/prisma");
const { hashPassword, comparePassword } = require("../utils/hash");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
const jwt = require("jsonwebtoken");

exports.register = async (email, password) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("User already exists");

  const hashed = await hashPassword(password);

  return prisma.user.create({
    data: { email, password: hashed }
  });
};

exports.login = async (email, password, userAgent, ip) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { role: { include: { permissions: true } } }
  });

  if (!user) throw new Error("Invalid credentials");

  const match = await comparePassword(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await prisma.session.create({
    data: {
      userId: user.id,
      refreshToken,
      userAgent,
      ipAddress: ip
    }
  });

  return { accessToken, refreshToken };
};

exports.refresh = async (refreshToken) => {
  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

  const session = await prisma.session.findFirst({
    where: { refreshToken, isValid: true }
  });

  if (!session) throw new Error("Invalid session");

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId }
  });

  const newAccess = generateAccessToken(user);
  const newRefresh = generateRefreshToken(user);

  await prisma.session.update({
    where: { id: session.id },
    data: { refreshToken: newRefresh }
  });

  return { accessToken: newAccess, refreshToken: newRefresh };
};

exports.logout = async (refreshToken) => {
  await prisma.session.updateMany({
    where: { refreshToken },
    data: { isValid: false }
  });
};
