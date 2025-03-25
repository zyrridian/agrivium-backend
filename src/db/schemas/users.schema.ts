import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  timestamp,
  index,
  date,
  boolean,
  uuid,
  decimal,
} from "drizzle-orm/pg-core";
import bcrypt from "bcryptjs";

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    uuid: uuid("uuid").defaultRandom().notNull(),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }).notNull(),
    email: text("email").notNull().unique(),
    phoneNumber: varchar("phone_number", { length: 20 }).unique(),
    passwordHash: text("password_hash").notNull(),
    avatarUrl: text("avatar_url"),
    dateOfBirth: date("date_of_birth"),
    gender: varchar("gender", { length: 10 }),
    role: varchar("role", { length: 50 }).notNull().default("customer"),
    googleId: varchar("google_id", { length: 255 }).unique(),
    facebookId: varchar("facebook_id", { length: 255 }).unique(),
    appleId: varchar("apple_id", { length: 255 }).unique(),
    isVerified: boolean("is_verified").default(false),
    isActive: boolean("is_active").default(true),
    lastLoginAt: timestamp("last_login_at"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (users) => [
    index("email_idx").on(users.email),
    index("phone_idx").on(users.phoneNumber),
  ]
);

export const userAddresses = pgTable(
  "user_addresses",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    fullName: varchar("full_name", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 20 }).notNull(),
    address: text("address").notNull(),
    latitude: decimal("latitude", { precision: 10, scale: 8 }),
    longitude: decimal("longitude", { precision: 11, scale: 8 }),
    city: varchar("city", { length: 100 }).notNull(),
    state: varchar("state", { length: 100 }).notNull(),
    country: varchar("country", { length: 100 }).notNull(),
    postalCode: varchar("postal_code", { length: 20 }).notNull(),
    addressType: varchar("address_type", { length: 50 }).default("home"),
    isDefault: boolean("is_default").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (userAddresses) => [index("user_idx").on(userAddresses.userId)]
);

// Function to hash password before inserting into the database
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}
