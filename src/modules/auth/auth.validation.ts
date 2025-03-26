import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

function validationResponse(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    return res.json({
      status: "fail",
      message: "Validation failed",
      data: "",
      error: firstError.msg,
    });
  }
  next();
}

export const validateRegister = [
  body("firstName").notEmpty().withMessage("First name is required"),
  body("lastName").notEmpty().withMessage("Last name is required"),
  body("email").isEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  validationResponse,
];

export const validateLogin = [
  body("email").isEmail().withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
  validationResponse,
];
