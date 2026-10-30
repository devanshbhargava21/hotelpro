const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Not authorised, token missing" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET); // { id, type }
    next();
  } catch {
    res.status(401).json({ message: "Session expired, please login again" });
  }
};

exports.adminOnly = (req, res, next) => {
  if (req.user?.type !== "admin") return res.status(403).json({ message: "Admin access only" });
  next();
};
