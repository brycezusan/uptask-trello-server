import mongoose, { Document, Schema, Types } from "mongoose";

export interface IToken extends Document {
  token: string;
  user: Types.ObjectId;
  createAt: Date;
}

const tokenSchema: Schema = new Schema({
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: "15m",
  },
  user: {
    type: Types.ObjectId,
    ref: "User",
  },
});

const Token = mongoose.model<IToken>("Token", tokenSchema);

export default Token;
