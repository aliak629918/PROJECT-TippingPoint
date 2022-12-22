const mongoose = require("mongoose");
const request = require("supertest");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const helper = require("./helper");

const app = require("../app");

require("dotenv").config();

beforeEach(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
});

afterEach(async () => {
  await mongoose.connection.close();
});

describe("POST/api/users", () => {
  test("POST: 201 - Adds a new user to the Atlas DB", async () => {
    const usersAtStart = await helper.usersInDb();
    return request(app)
      .post(`/api/users`)
      .send({
        username: "the-ali2",
        email: "something@somewhere.com",
        name: "ali",
        password: "dfsafjhdskl",
      })
      .expect(201)
      .then((res) => {
        expect(res.body).toMatchObject({
          username: "the-ali2",
          email: "something@somewhere.com",
          name: "ali",
          items: [],
          id: expect.any(String),
        });
      });
  });
});

// describe("when there is initially one user in db", () => {
//   beforeEach(async () => {
// await User.deleteMany({});

// const passwordHash = await bcrypt.hash("sekret", 10);
// const user = new User({ username: "root", passwordHash });

// await user.save();
// });

// test("creation succeeds with a fresh username", async () => {
// const usersAtStart = await helper.usersInDb();

// const newUser = {
//   username: "Hermione10",
//   name: "Daniel",
//   password: "cats",
// };

// return await request(app)
//   .post("/api/users")
//   .send(newUser)
//   .expect(201)
//   .expect("Content-Type", /application\/json/);
// .then(() => {

//   const usersAtEnd = await helper.usersInDb();
//   expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

//   const usernames = usersAtEnd.map((u) => u.username);
//   expect(usernames).toContain(newUser.username);
// })
//   });
// });
