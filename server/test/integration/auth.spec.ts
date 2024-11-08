import User from "@/models/user"
import type { UserDocument } from "@/models/user"
import app from "@/server"
import mongoose from "mongoose"
import request from "supertest"

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

describe("User Registeration", () => {
  it("should not accept invalid body", async () => {
    const res = await request(app).post("/register").send({})

    expect(res.status).toBe(400)
    expect(res.body.errors).toMatchObject({
      email: expect.any(String),
      password: expect.any(String),
      username: expect.any(String),
    })
  })

  it("should not accept taken email", done => {
    request(app).post("/register").send(userData).expect(409, done)
  })

  it("should accept valid body", async () => {
    const res = await request(app)
      .post("/register")
      .send({ ...userData, email: "test2@example.com" })

    expect(res.status).toBe(201)
    expect(res.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        username: expect.any(String),
        email: expect.any(String),
      }),
    )
  })
})

describe("User Login", () => {
  const { email, password } = userData
  const incorrectEmail = `incorrect_${email}`
  const incorrectPassword = `${password}123`

  it("should return 400 if body is invalid", async () => {
    const res = await request(app).post("/login").send({})

    expect(res.status).toBe(400)
    expect(res.body).toMatchObject(
      expect.objectContaining({
        message: "invalid body",
        errors: {
          email: expect.any(String),
          password: expect.any(String),
        },
      }),
    )
  })

  it.each([
    { case: "email", email: incorrectEmail, password: incorrectPassword },
    { case: "password", email, password: incorrectPassword },
  ])("should return 401 if $case is incorrect", ({ email, password }, done) => {
    request(app).post("/login").send({ email, password }).expect(401, done)
  })

  it("should return 400 if body is invalid", async () => {
    const res = await request(app).post("/login").send({})

    expect(res.status).toBe(400)
    expect(res.body).toMatchObject(
      expect.objectContaining({
        message: "invalid body",
        errors: {
          email: expect.any(String),
          password: expect.any(String),
        },
      }),
    )
  })
})

describe("Refresh Token", () => {
  it("should return 400 if body is invalid", async () => {
    const res = await request(app).post("/refresh-token").send({})

    expect(res.status).toBe(400)
    expect(res.body).toMatchObject(
      expect.objectContaining({
        message: "invalid body",
        errors: {
          refreshToken: expect.any(String),
        },
      }),
    )
  })

  it("should return 401 if refresh token is invalid", done => {
    request(app)
      .post("/refresh-token")
      .send({ refreshToken: "132456" })
      .expect(401, done)
  })

  it("should return 401 if user is not found", done => {
    const user = new User(userData)

    request(app)
      .post("/refresh-token")
      .send({ refreshToken: user.generateRefreshToken() })
      .expect(401, done)
  })

  it("should return 200 and new tokens if token is valid", async () => {
    const res = await request(app)
      .post("/refresh-token")
      .send({ refreshToken: user.generateRefreshToken() })

    expect(res.status).toBe(200)
    expect(res.body).toEqual({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    })
  })
})
