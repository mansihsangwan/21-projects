const prisma = require("../config/prisma");

exports.checkPermission = (resource, action) => {
  return async (req, res, next) => {
    const role = await prisma.role.findUnique({
      where: { id: req.user.roleId },
      include: { permissions: true }
    });

    const allowed = role?.permissions.some(
      p => p.resource === resource && p.action === action
    );

    if (!allowed)
      return res.status(403).json({ message: "Forbidden" });

    next();
  };
};
