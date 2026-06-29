const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

// Protect routes - verify JWT
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token)
    return next(new ErrorResponse("Not authorized. No token provided.", 401));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return next(new ErrorResponse("User not found.", 401));
    if (!user.isActive)
      return next(new ErrorResponse("Your account has been deactivated.", 403));
    req.user = user;
    next();
  } catch (err) {
    return next(new ErrorResponse("Not authorized. Invalid token.", 401));
  }
};

// Role-based access control
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `Role '${req.user.role}' is not authorized to access this route.`,
          403,
        ),
      );
    }
    next();
  };
};
