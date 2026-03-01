const bcrypt = require("bcryptjs");
const generateToken = require("../../utils/generateToken");

const users = [];
let userCounter = 1;

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt
  };
}

async function register({ name, email, password }) {
  if (!name || !email || !password) {
    const error = new Error("name, email and password are required");
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const existing = users.find((user) => user.email === normalizedEmail);

  if (existing) {
    const error = new Error("Email already registered");
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    id: String(userCounter++),
    name: String(name).trim(),
    email: normalizedEmail,
    passwordHash,
    createdAt: new Date().toISOString()
  };

  users.push(user);

  const token = generateToken({ userId: user.id, email: user.email });

  return {
    user: sanitizeUser(user),
    token
  };
}

async function login({ email, password }) {
  if (!email || !password) {
    const error = new Error("email and password are required");
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const user = users.find((entry) => entry.email === normalizedEmail);

  if (!user) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken({ userId: user.id, email: user.email });

  return {
    user: sanitizeUser(user),
    token
  };
}

function getMe(userId) {
  const user = users.find((entry) => entry.id === String(userId));

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return sanitizeUser(user);
}

module.exports = {
  register,
  login,
  getMe
};
