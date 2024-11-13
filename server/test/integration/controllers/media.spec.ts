import request from "supertest"
import app from "@/server"
import mongoose from "mongoose"
import User from "model/user"
import type { UserDocument } from "model/user"
import { UPLOAD_MAX_BYTES, UPLOAD_PATH } from "@/config"
import { rimraf } from "rimraf"
import { mkdirSync } from "fs"

const userData = {
  username: "test",
  password: "123456789",
  email: "test@me.com",
}

let user: UserDocument

beforeAll(async () => {
  await mongoose.connect("mongodb://localhost:27017/test")
  await mongoose.connection.db?.dropDatabase()

  user = await new User(userData).save()
  if (!user) throw new Error("failed to create a new user")
})

afterAll(async () => {
  await mongoose.connection.db?.dropDatabase()
  rimraf.sync(UPLOAD_PATH)
})

describe("Media Upload", () => {
  it("should return 415 when uploading unsupported files", done => {
    request(app)
      .post("/media")
      .set("Authorization", `Bearer ${user.generateToken()}`)
      .attach("media", "test_files/unsupported.gif")
      .expect(415, done)
  })

  // !BUG: Skip until testing manualy on the client side to determine what is
  //  the `writev` error
  it("should consume a single file if multiple files are uploaded", done => {
    request(app)
      .post("/media")
      .set("Authorization", `Bearer ${user.generateToken()}`)
      .attach("media", "test_files/image1.jpg")
      .attach("media", "test_files/image2.jpg")
      .attach("media", "test_files/image3.jpg")
      .expect(201, done)
  })

  // !TODO: implement this
  it("should return 201 and the file path on upload success", async () => {
    // clear any old files
    // rimraf.sync(UPLOAD_PATH)
    // mkdirSync(UPLOAD_PATH, { recursive: true })

    const res = await request(app)
      .post("/media")
      .set("Authorization", `Bearer ${user.generateToken()}`)
      .attach("media", "test_files/image1.jpg")

    expect(res.status).toBe(201)
    // expect(res.body).toEqual({ media: expect.any(Array) })
    // expect(Array.isArray(res.body.media)).toBeTruthy()
    // expect(res.body.media).toHaveLength(1)
    //
    // expect(res.body.media[0]).toEqual({
    //   filename: "image1.jpg",
    //   url: expect.any(String),
    //   mediaId: expect.any(String),
    // })

    // !TODO: make sure the file exists in the path
    // !TODO: make sure the url is correct and valid
  })

  // !BUG: For unknown reason, any test case came after this one will fail,
  //  I will keep it here until manual testing on the client side to figure out
  //  what is the casue.
  it("should return 413 when uploading too large files", done => {
    const largeContent = "0".repeat(UPLOAD_MAX_BYTES + 1024)
    const largeFile = Buffer.from(largeContent)

    request(app)
      .post("/media")
      .set("Authorization", `Bearer ${user.generateToken()}`)
      .attach("media", largeFile, {
        filename: "image.png",
        contentType: "image/png",
      })
      .expect(413, done)
  })
})
