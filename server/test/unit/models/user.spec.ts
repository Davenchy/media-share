import User from "@/models/user"
import type { TokenPayload, UserDocument } from "@/models/user"
import jwt, { JsonWebTokenError } from "jsonwebtoken"
import mongoose from "mongoose"

const userData = {
  username: "test",
  email: "test@example.com",
  password: "123456789",
}

let user: UserDocument

beforeAll(async () => {
  await mongoose.connect("mongodb://localhost:27017/test")
  await mongoose.connection.db?.dropDatabase()

  user = await new User(userData).save()
})

afterAll(async () => {
  await mongoose.connection.db?.dropDatabase()
  await mongoose.connection.close()
})

describe("User Model - generateToken", () => {
  it("should generate access token", () => {
    const token = user.generateToken()
    const payload = jwt.decode(token) as TokenPayload

    expect(payload).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        isRefreshToken: false,
      }),
    )
  })
})

describe("User Model - generateRefreshToken", () => {
  it("should generate refresh token", () => {
    const token = user.generateRefreshToken()
    const payload = jwt.decode(token) as TokenPayload

    expect(payload).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        isRefreshToken: true,
      }),
    )
  })
})

describe("User Model - findByToken", () => {
  it("should throw error if token is invalid", () => {
    expect(User.findByToken("")).rejects.toThrow(JsonWebTokenError)
  })

  it("should throw error if refresh token is used instead of access token", async () => {
    const token = user.generateRefreshToken()

    expect(User.findByToken(token)).rejects.toThrow(JsonWebTokenError)
  })

  it("should throw error if user is not exist", async () => {
    const user = new User(userData)
    const token = user.generateToken()

    const foundUser = await User.findByToken(token)

    expect(foundUser).toBeNull()
  })

  it("should find user by token", async () => {
    const token = user.generateToken()

    const foundUser = await User.findByToken(token)

    expect(foundUser).not.toBeNull()
    expect(foundUser?._id.toHexString()).toBe(user._id.toHexString())
  })
})

describe("User Model - validatePassword", () => {
  it("should be falsy if password is invalid", () => {
    expect(user.validatePassword("invalid_password")).resolves.toBeFalsy()
  })

  it("should be truthy if password is valid", () => {
    expect(user.validatePassword(userData.password)).resolves.toBeTruthy()
  })
})
