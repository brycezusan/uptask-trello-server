import { transporter } from "../config/nodemailer";

export interface IEmail {
  email: string;
  name: string;
  token: string;
}

export class AuthEmail {
  static sendConfirmEmail = async (user: IEmail) => {
    const info= await transporter.sendMail({
      from: "Uptask <admin@uptask.com>",
      to: user.email,
      subject: "Uptask - Confirma tu cuenta",
      text: " Uptask - Confirmar cuenta",
      html: `<p>Hola :${user.name} , has creado tu cuenta en upTask</p>
        <p>debes de confirmar tu cuenta , visita el siguiente enlace</p>
        <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar Cuenta</a>
        <p>Ingresar el sgte codigo: <b>${user.token}</b></p>
        <p>Este codigo expira en 15 minutos</p>
      `,
    });
    console.log("Mensaje enviado", info.messageId);
  };

  static sendResetPasswordToken = async (user: IEmail) => {
    const info= await transporter.sendMail({
      from: "Uptask <admin@uptask.com>",
      to: user.email,
      subject: "Uptask - Olvide Contraseña",
      text: " Uptask - Reestablecer Contraseña",
      html: `<p>Hola :${user.name} , has solicitado un token en upTask</p>
        <p>solicita reestablecer contraseña, visita el siguiente enlace</p>
        <a href="${process.env.FRONTEND_URL}/auth/new-password">Reestablecer Password</a>
        <p>Ingresar el sgte codigo: <b>${user.token}</b></p>
        <p>Este codigo expira en 10 minutos</p>
      `,
    });
    console.log("Mensaje enviado", info.messageId);
  };
}
