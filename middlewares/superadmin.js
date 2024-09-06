import jwt from "jsonwebtoken";
import { MESSAGES } from "../constants/messages.js";

export const verifySuperAdminToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: MESSAGES.NO_TOKEN_FOUND });
  }

  const secretKey = process.env.JWT_SECRET;

  jwt.verify(token.split(" ")[1], secretKey, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: MESSAGES.TOKEN_EXPIRED });
      }
      return res.status(401).json({ message: MESSAGES.ACCESS_DENIED });
    }
    if (decoded.role !== "superadmin") {
      return res.status(401).json({ message: MESSAGES.ACCESS_DENIED });
    }
    req.user = decoded;
    next();
  });
};

export const verifySuperAdminRefreshToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: MESSAGES.NO_TOKEN_FOUND });
  }

  const secretKey = process.env.JWT_REFRESH_SECRET;

  jwt.verify(token.split(" ")[1], secretKey, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: MESSAGES.TOKEN_EXPIRED });
      }
      return res.status(401).json({ message: MESSAGES.ACCESS_DENIED });
    }
    if (decoded.role !== "superadmin") {
      return res.status(401).json({ message: MESSAGES.ACCESS_DENIED });
    }

    req.user = decoded;
    next();
  });
};
