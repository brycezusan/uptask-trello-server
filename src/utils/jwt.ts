import jwt from "jsonwebtoken";
import { Types } from "mongoose";

type UserPayload = {
  id:Types.ObjectId
}

export const generateJWT = (id : UserPayload) => {
  const token = jwt.sign(id, process.env.JWT_SECRET , {
    expiresIn: "30d",
  });

  return token;
};
