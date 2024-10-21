const { generateToken, verifyToken } = require("./service/auth");

const isLoggedIn = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ status: "error", message: "no token found" });
    }

    const decoded = verifyToken(token);
    return res.status(200).json({
      status: "success",
      user: "token verified",
      username: decoded.username,
      message: "successfully authenticated!",
    });
  } catch (error) {
    console.error("Token verification failed:", error);
    return res
      .status(401)
      .json({ status: "error", message: "Invalid or expired token" });
  }
};
