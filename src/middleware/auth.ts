import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No autorizado" });
  }

  const token = bearer.split("Bearer ")[1].trim();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password -name -email");

    if (user) {
      req.user = user;
    } else {
      return res.status(401).json({ error: "Token no válido" });
    }
  } catch (error) {
    res.status(500).json({ error: "Hubo un error" });
  }

  next();
};
