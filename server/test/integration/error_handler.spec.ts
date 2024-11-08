import app from "@/server"
import request from "supertest"

describe("express error handlers middlewares", () => {
  it("should return 404 on not found route", done => {
    request(app).get("/not-found").expect(404, done)
  })

  it('should return 500 "internal server error" on server error', done => {
    request(app)
      .post("/register")
      .send({
        username: "test",
        email: "test@example.com",
        password: "123456789",
      })
      .expect(500, done)
  }, 15000)
})
