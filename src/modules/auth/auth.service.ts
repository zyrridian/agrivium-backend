import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AuthRepository } from "./auth.repository";
import { hashPassword } from "../../db/schemas/users.schema";
import { auth } from "../../config/firebase";
import { sendFirebaseVerificationEmail } from "../../config/email";

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
    password: string,
    role: UserRole = UserRole.CUSTOMER
  ) {
    // Check if user already exists
    const existingUser = await this.authRepository.findUserByEmail(email);
    if (existingUser.length > 0) throw new Error("User already exists");

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert user into database
    const newUser = await this.authRepository.createUser(
      firstName,
      lastName,
      email,
      hashedPassword,
      role
    );

    try {
      // Create Firebase User
      const firebaseUser = await auth.createUser({
        uid: newUser.id.toString(), // Use DB ID as Firebase UID
        email,
        password,
        displayName: `${firstName} ${lastName}`,
        emailVerified: false, // Set to false until user verifies
      });

      await sendFirebaseVerificationEmail(email);

      return {
        message: "User registered successfully. Please verify your email.",
      };
    } catch (error) {
      // Rollback: Delete user from DB if Firebase fails
      await this.authRepository.deleteUserById(newUser.id);
      throw new Error(`Firebase error: ${(error as Error).message}`);
    }
  }

  async loginUser(email: string, passwordHash: string) {
    // Find user in your database
    const user = await this.authRepository.findUserById(email);
    if (!user) throw new Error("Invalid email or password");

    // Check if password matches
    const isMatch = await bcrypt.compare(passwordHash, user.passwordHash);
    if (!isMatch) throw new Error("Invalid email or password");

    // Check email verification status in Firebase
    try {
      const firebaseUser = await auth.getUserByEmail(email);
      if (!firebaseUser.emailVerified) {
        throw new Error("Please verify your email before logging in.");
      }
    } catch (error) {
      throw new Error("Authentication failed. Please try again.");
    }

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
