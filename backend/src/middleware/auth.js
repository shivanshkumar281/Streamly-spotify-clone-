import jwt from "jsonwebtoken";

// JWT auth
const authUser = (req, res, next) => {
  const headerToken =
    req.headers.token ||
    (req.headers.authorization && req.headers.authorization.startsWith("Bearer")
      ? req.headers.authorization.split(" ")[1]
      : null);

  if (!headerToken) {
    return res.json({
      success: false,
      message: "Not authorized. Please log in again.",
    });
  }

  try {
    const decoded = jwt.verify(
      headerToken,
      process.env.JWT_SECRET || "dev_secret_change_me"
    );
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.json({ success: false, message: "Invalid or expired session." });
  }
};

export default authUser;
