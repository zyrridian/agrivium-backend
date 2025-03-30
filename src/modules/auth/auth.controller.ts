import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { auth } from "../../config/firebase";

const authService = new AuthService();

function sendResponse<T>(
  res: Response,
  statusCode: number,
  status: "success" | "fail" | "error",
  message: string,
  data?: T,
  error?: any
) {
  res.status(statusCode).json({
    status,
    message,
    data: data && Object.keys(data).length > 0 ? data : "", // Ensures data is not null
    error: error ?? "", // Ensures error is an empty string if undefined
  });
}

export async function register(req: Request, res: Response) {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    const response = await authService.registerUser(
      firstName,
      lastName,
      email,
      password,
      role
    );
    sendResponse(res, 201, "success", response.message, null);
  } catch (error) {
    sendResponse(
      res,
      400,
      "fail",
      "Registration failed",
      null,
      (error as Error).message
    );
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const response = await authService.loginUser(email, password);
    sendResponse(res, 200, "success", "Login successful", response.data);
  } catch (error) {
    sendResponse(
      res,
      401,
      "fail",
      "Invalid credentials",
      null,
      (error as Error).message
    );
  }
}

export async function googleAuth(req: Request, res: Response) {
  try {
    const { token } = req.body;
    const user = await authService.googleAuth(token);
    sendResponse(res, 200, "success", "Google authentication successful", user);
  } catch (error) {
    sendResponse(
      res,
      400,
      "fail",
      "Google authentication failed",
      null,
      (error as Error).message
    );
  }
}
