import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";

const router = Router();

router.post(
  "/create-account",
  body("name").notEmpty().withMessage("field name is required"),
  body("email")
    .notEmpty()
    .withMessage("field email is required")
    .isEmail()
    .withMessage("Email not valid"),
  body("password")
    .notEmpty()
    .withMessage("field password is required")
    .isLength({ min: 8 })
    .withMessage("field password is sort , min 8 characters"),
  body("password_confirm").custom((value, { req }) => {
    if (value !== req.body.password)
      throw new Error("password confirm is incorrect");
    return true;
  }),
  handleInputErrors,
  AuthController.createAccount
);

router.post(
  "/confirm-account",
  body("token").notEmpty().withMessage("field token is required"),
  handleInputErrors,
  AuthController.confirmAccount
);

router.post(
  "/login",
  body("email")
    .notEmpty()
    .withMessage("field email is required")
    .isEmail()
    .withMessage("Email not valid"),
  body("password")
    .notEmpty()
    .withMessage("field password is required"),
  handleInputErrors,
  AuthController.loginAccount
);

router.post(
  "/request-token",
  body("email")
    .notEmpty()
    .withMessage("field email is required")
    .isEmail()
    .withMessage("Email not valid"),
  handleInputErrors,
  AuthController.requestTokenAccount
);

router.post(
  "/forgat-password",
  body("email")
    .notEmpty()
    .withMessage("field email is required")
    .isEmail()
    .withMessage("Email not valid"),
  handleInputErrors,
  AuthController.forgatPassword
);

router.post(
  "/validate-token",
  body("token")
    .notEmpty()
    .withMessage("field token is required"),
  handleInputErrors,
  AuthController.validateToken
);

router.post(
  "/update-password/:token",
  param('token').isNumeric().withMessage('Token not valid'),
  body("password")
    .notEmpty()
    .withMessage("field password is required")
    .isLength({ min: 8 })
    .withMessage("field password is sort , min 8 characters"),
  body("password_confirm").custom((value, { req }) => {
    if (value !== req.body.password)
      throw new Error("password confirm is incorrect");
    return true;
  }),
  handleInputErrors,
  AuthController.updatePassword
);

export default router;
