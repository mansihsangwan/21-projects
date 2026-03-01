const authService = require("../services/auth.service");

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authService.register(email, password);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const tokens = await authService.login(
      email,
      password,
      req.headers["user-agent"],
      req.ip
    );
    res.json(tokens);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const tokens = await authService.refresh(refreshToken);
    res.json(tokens);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

exports.logout = async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.json({ message: "Logged out" });
};
