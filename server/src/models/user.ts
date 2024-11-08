import {
  PASSWORD_SALT_ROUNDS,
  REFRESH_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_SECRET,
  TOKEN_EXPIRES_IN,
  TOKEN_SECRET,
} from "@/config"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { Schema, model } from "mongoose"
import type { HydratedDocument, Model } from "mongoose"
import { z } from "zod"

// Types //
/** registeration route body type */
export type UserRegisteration = z.infer<typeof UserRegisterationSchema>
/** login route body type */
export type UserCredentials = z.infer<typeof UserCredentialsSchema>
/** refresh token route body type */
export type RefreshToken = z.infer<typeof RefreshTokenSchema>

/**
 * This interface contains the definition of the User document methods
 */
interface IUserMethods {
  generateToken(): string
  generateRefreshToken(): string
  validatePassword(password: string): Promise<boolean>
}

export type IUser = UserRegisteration & IUserMethods
export type UserDocument = HydratedDocument<IUser>

/**
 * User Model Interface that contains the definition of static functions
 */
// biome-ignore lint/complexity/noBannedTypes:
export interface IUserModel extends Model<IUser, {}, IUserMethods> {
  /**
   * Find user by access token.
   * If no user with that token exists, returns null
   * If a refresh token is passed, throws an error
   * If token is invalid, throws an error
   */
  findByToken(token: string): Promise<UserDocument | null>

  /**
   * Find user by refresh token.
   * If no user with that token exists, returns null
   * If an acccess token is passed, throws an error
   * If token is invalid, throws an error
   */
  findByRefreshToken(token: string): Promise<UserDocument | null>
}

/** the JWT token payload */
export interface TokenPayload {
  id: string
  isRefreshToken: boolean
}

// Schemas //
/** Used for the login route body validation */
export const UserCredentialsSchema = z.object({
  email: z
    .string({ message: "email is required" })
    .email("invalid email address"),
  password: z
    .string({ message: "password is required" })
    .min(8, "password must be at lease 8 characters long"),
})

/** Used for the register route body validation */
export const UserRegisterationSchema = UserCredentialsSchema.extend({
  username: z
    .string({ message: "username is required" })
    .min(3, "username must be at least 3 characters long")
    .max(50, "username must be at most 50 characters long"),
})

/** Used for the refresh token route body validation */
export const RefreshTokenSchema = z.object({
  refreshToken: z.string({ message: "refresh token is required" }),
})

const userSchema = new Schema<IUser, IUserModel, IUserMethods>(
  {
    username: { type: String, required: true, minlength: 3, maxlength: 50 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 8 },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      transform: (_doc, ret) => {
        const { _id, username, email } = ret
        return { id: _id, username, email }
      },
    },
    statics: {
      async findByToken(token: string): Promise<UserDocument | null> {
        const payload = jwt.verify(token, TOKEN_SECRET) as TokenPayload
        // this could happen if both refresh and access token secrets are the
        // same
        if (payload.isRefreshToken) throw new Error("incorrect token")
        return await this.findById(payload.id)
      },
      async findByRefreshToken(token: string): Promise<UserDocument | null> {
        const payload = jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayload
        // this could happen if both refresh and access token secrets are the
        // same
        if (!payload.isRefreshToken) throw new Error("incorrect token")
        return await this.findById(payload.id)
      },
    },
    methods: {
      generateToken(): string {
        return jwt.sign(
          { id: this._id.toHexString(), isRefreshToken: false },
          TOKEN_SECRET,
          { expiresIn: TOKEN_EXPIRES_IN },
        )
      },
      generateRefreshToken(): string {
        return jwt.sign(
          { id: this._id.toHexString(), isRefreshToken: true },
          REFRESH_TOKEN_SECRET,
          { expiresIn: REFRESH_TOKEN_EXPIRES_IN },
        )
      },
      async validatePassword(password: string): Promise<boolean> {
        return await bcrypt.compare(password, this.password)
      },
    },
  },
)

// hash user's password before saving
userSchema.pre("save", async function () {
  const hashedPassword = await bcrypt.hash(this.password, PASSWORD_SALT_ROUNDS)
  this.password = hashedPassword
})

// Model //
const User = model<IUser, IUserModel>("User", userSchema)
export default User
