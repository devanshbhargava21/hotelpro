const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email, phone: u.phone, type: u.type });

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, c_password, phone, type } = req.body;
    if (!name || !email || !password || !phone || !type)
      return res.status(400).json({ message: "All fields are required" });
    if (password !== c_password) return res.status(400).json({ message: "Passwords do not match" });
    if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });
    if (!["admin", "ordinary"].includes(type)) return res.status(400).json({ message: "Invalid user type" });
    if (!/^\d{10}$/.test(phone)) return res.status(400).json({ message: "Phone must be 10 digits" });

    if (await User.findOne({ email: email.toLowerCase() }))
      return res.status(409).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, phone, type });
    res.status(201).json({ message: "Account created successfully", user: publicUser(user) });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id, type: user.type }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES || "1d",
    });
    res.json({ token, user: publicUser(user) });
  } catch (err) {
    next(err);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    res.json(await User.find().select("-password").sort({ createdAt: -1 }));
  } catch (err) {
    next(err);
  }
};
