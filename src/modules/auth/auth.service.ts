import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AuthRepository } from "./auth.repository";
import { hashPassword } from "../../db/schemas/users.schema";

dotenv.config();

enum UserRole {
  CUSTOMER = "customer",
  SELLER = "seller",
  ADMIN = "admin",
  COURIER = "courier",
  SUPPLIER = "supplier",
  AFFILIATE = "affiliate",
}

export class AuthService {
  private authRepository = new AuthRepository();

  async registerUser(
    firstName: string,
    lastName: string,
    email: string,
    // phoneNumber: string | null = null,
    password: string,
    // avatarUrl: string | null = null,
    // dateOfBirth: string | null = null,
    // gender: string | null = null,
    role: UserRole = UserRole.CUSTOMER
    // googleId: string | null = null,
    // facebookId: string | null = null,
    // appleId: string | null = null
  ) {
    // Check if user already exists
    const existingUser = await this.authRepository.findUserByEmail(email);
    if (existingUser.length > 0) throw new Error("User already exists");

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert user into database
    await this.authRepository.createUser(
      firstName,
      lastName,
      email,
      hashedPassword,
      role
    );

    return { message: "User registered successfully" };
  }

  async loginUser(email: string, passwordHash: string) {
    const user = await this.authRepository.findUserById(email);
    if (!user) throw new Error("Invalid email or password");

    const isMatch = await bcrypt.compare(passwordHash, user.passwordHash);
    if (!isMatch) throw new Error("Invalid email or password");

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    return {
      success: true,
      message: "Login successful",
      data: {
        id: user.id,
        uuid: user.uuid,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        token: token,
      },
    };
  }

  async googleAuth(googleToken: string) {
    // // Verify Google token (You need Google OAuth verification logic)
    // const userInfo = await this.verifyGoogleToken(googleToken);
    // if (!userInfo) throw new Error("Invalid Google authentication");
    // // Check if user exists
    // let user = await this.authRepository.findUserByEmail(userInfo.email);
    // if (!user) {
    //   // Register new user if not found
    //   user = await this.authRepository.createUser(
    //     userInfo.name,
    //     userInfo.email,
    //     "", // No password needed for Google auth
    //     UserRole.CUSTOMER
    //   );
    // }
    // // Generate JWT token
    // const token = jwt.sign(
    //   { id: user.id, role: user.role, email: user.email },
    //   process.env.JWT_SECRET!,
    //   { expiresIn: "1d" }
    // );
    // // { id: user[0].id, role: user[0].role, email: user[0].email },
    // return {
    //   success: true,
    //   message: "Google authentication successful",
    //   data: { token },
    // };
  }

  private async verifyGoogleToken(token: string) {
    // Here you should integrate Google's OAuth API to verify the token
    // This is just a placeholder, replace it with actual Google API call
    return {
      email: "user@example.com",
      name: "John Doe",
    };
  }
}
