import type { Request, Response } from "express";
import User from "../models/User";
import Token from "../models/Token";
import { checkPassword, generateToken, hashPassword } from "../utils";
import { AuthEmail } from "../mails/AuthEmail";
import { generateJWT } from "../utils/jwt";

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      const { password, email } = req.body;
      const userCreate = await User.findOne({ email });
      if (userCreate) return res.status(409).send("already register user");
      const user = new User(req.body);
      //! hash de password
      user.password = await hashPassword(password);
      // ! Generar token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;

      // * 1 forma de multiples await
      // await user.save()
      // await token.save()
      // * 2 forma de multiples await - mejor performance
      await Promise.allSettled([user.save(), token.save()]);

      //! Enviar el email
      AuthEmail.sendConfirmEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      res.send("account created, check email to cofirm");
    } catch (error) {
      res.status(505).json({ error: "Hubo un error" });
    }
  };

  static confirmAccount = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const tokenExist = await Token.findOne({ token });
      if (!tokenExist) return res.status(401).send("token not valid");
      const user = await User.findById(tokenExist.user);
      user.confirmed = true;
      await Promise.allSettled([tokenExist.deleteOne(), user.save()]);
      res.send("Token is valid , account confirm");
    } catch (error) {
      res.status(505).json({ error: "Hubo un error" });
    }
  };

  static loginAccount = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(404).send("User not found");
      if (!user.confirmed) return res.status(403).send("User not confirmed");

      // revisar el password
      const isValidPassword = await checkPassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).send("creedentials not valid");
      } else {
        const token = generateJWT({id:user.id});
        return res.send(token);
      }
    } catch (error) {
      console.log(error);
      res.status(505).json({ error: "Hubo un error" });
    }
  };

  static requestTokenAccount = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(404).send("user not register");
      if (user.confirmed)
        return res.status(403).json({ error: "User is confirm" });

      // ! Generar token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;

      // * 1 forma de multiples await
      await user.save();
      await token.save();
      //! Enviar el email
      AuthEmail.sendConfirmEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      res.send("a new token was sent , check your email");
    } catch (error) {
      res.status(505).json({ error: "Hubo un error" });
    }
  };

  static forgatPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(404).send("user not register");

      // ! Generar token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;

      // * 1 forma de multiples await
      await token.save();
      //! Enviar el email
      AuthEmail.sendResetPasswordToken({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      res.send("a new token was sent , check your email");
    } catch (error) {
      res.status(505).json({ error: "Hubo un error" });
    }
  };

  static validateToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const tokenValidate = await Token.findOne({ token });
      if (!tokenValidate) return res.status(404).send("token not valid");
      res.send("Token validado");
    } catch (error) {
      res.status(505).json({ error: "Hubo un error" });
    }
  };

  static updatePassword = async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      const { password } = req.body;

      const tokenExist = await Token.findOne({ token });
      if (!tokenExist)
        return res.status(404).json({ error: "Token no válido" });
      const user = await User.findById(tokenExist.user);
      user.password = await hashPassword(password);
      user.confirmed = true;
      await Promise.allSettled([user.save(), tokenExist.deleteOne()]);
      res.status(202).send("update password");
    } catch (error) {
      res.status(505).json({ error: "Hubo un error" });
    }
  };
}
