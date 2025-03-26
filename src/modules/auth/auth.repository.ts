import e from "express";
import { db } from "../../db/db";
import { users } from "../../db/schemas/users.schema";
import { eq } from "drizzle-orm";

export class AuthRepository {
  async findUserById(userId: any) {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    return user; // Returns user object or undefined if not found
  }

  async deleteUserById(userId: number) {
    await db.delete(users).where(eq(users.id, userId));
  }

  async findUserByEmail(email: string) {
    return await db.select().from(users).where(eq(users.email, email));
  }

  //   async createUser(
  //     name: string,
  //     email: string,
  //     password: string,
  //     role: string
  //   ) {
  //     await db.insert(users).values({ name, email, password, role }).returning();
  //   }

  async createUser(
    firstName: string,
    lastName: string,
    email: string,
    passwordHash: string,
    role: string = "customer"
  ) {
    const [user] = await db
      .insert(users)
      .values({
        firstName: firstName || "",
        lastName: lastName || "",
        email,
        phoneNumber: null,
        passwordHash,
        avatarUrl: "",
        dateOfBirth: "1970-01-01",
        gender: "",
        role,
        googleId: null, // Default empty string instead of null
        facebookId: null,
        appleId: null,
        isVerified: false, // Boolean default
        isActive: true, // Boolean default
        lastLoginAt: null,
      })
      .returning(); // Returns the newly inserted user

    return user; // Ensure to return the created user
  }
}
