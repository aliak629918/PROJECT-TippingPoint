const mongoose = require("mongoose");
const request = require("supertest");
const bcrypt = require("bcrypt");
const User = require("../models/user");
// const helper = require("./helper");

const app = require("../app");

require("dotenv").config();

beforeEach(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
});

afterEach(async () => {
  await mongoose.connection.close();
});

describe("GET/api/items", () => {
  test("GET: 200 - Should return an array of items", () => {
    return request(app)
      .get("/api/items")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Array);
        expect(body.length).toBeGreaterThan(0);
        body.forEach((item) => {
          expect(item).toMatchObject({
            name: expect.any(String),
            category: expect.any(String),
            id: expect.any(String),
            description: expect.any(String),
            createdAt: expect.any(String),
            tippingDate: expect.any(String),
            image: expect.any(String),
          });
        });
      });
  });
  test.only("GET: 200 - an array of items sorted by date by default", () => {
    return request(app)
      .get("/api/items")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeSortedBy("createdAt", { ascending: true });
      });
  })
  test("GET: 200 - can sort array of items by name DESC", () => {
    return request(app)
      .get("/api/items?sort=name:-1")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeSortedBy("name", { descending: true });
      });
  });
});

describe("GET/api/items/:id", () => {
  test("GET: 200 - Should return an individual matching item", () => {
    const item_id = "63a08145841518b9121e6550";
    return request(app)
      .get(`/api/items/${item_id}`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({
          name: "Original microwave",
          category: "electronics",
          createdAt: "2022-12-19T15:20:37.308Z",
          image: "a url",
          tippingDate: "2022-12-21T15:13:13.950Z",
          description: "a micro",
          id: "63a08145841518b9121e6550",
        });
      });
  });
});

describe("POST/api/items", () => {
  test("POST: 201 - Adds a new item to the Atlas DB", () => {
    return request(app)
      .post(`/api/items`)
      .send({
        name: "Super Duper Microwave",
        category: "electronics",
        image: "a url",
        tippingDate: "2022-12-25T15:13:13.950Z",
        description: "a microwave, but super duper",
      })
      .expect(201)
      .then((res) => {
        expect(res.body).toMatchObject({
          name: "Super Duper Microwave",
          category: "electronics",
          createdAt: expect.any(String),
          image: "a url",
          tippingDate: "2022-12-25T15:13:13.950Z",
          description: "a microwave, but super duper",
          id: expect.any(String),
        });
      });
  });
});

describe("PATCH/api/items/:id", () => {
  test("GET: 200 - Should respond with the updated item", () => {
    const updatedItem = {
      image: "an even better url!",
    };
    return request(app)
      .patch(`/api/items/63a1a8f13a1a0e1c6cbb93a8`)
      .send(updatedItem)
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({
          name: "Super Duper Microwave",
          category: "electronics",
          createdAt: expect.any(String),
          image: "an even better url!",
          tippingDate: "2022-12-25T15:13:13.950Z",
          description: "a microwave, but super duper",
          id: "63a1a8f13a1a0e1c6cbb93a8",
        });
      });
  });
});

describe("DELETE/api/items/:id", () => {
  test("DELETE: 204 - Should delete an individual item", () => {
    const item_id = "63a08145841518b9121e6550";
    return request(app)
      .delete(`/api/items/${item_id}`)
      .expect(204)
      .then(({ body }) => {
        console.log(body);
        expect(body).not.toContain({
          name: "Original microwave",
          category: "electronics",
          createdAt: "2022-12-19T15:20:37.308Z",
          image: "a url",
          tippingDate: "2022-12-21T15:13:13.950Z",
          description: "a micro",
          id: "63a08145841518b9121e6550",
        });
      });
  });
});
// describe.only("POST/api/users", () => {
//   test("POST: 201 - Adds a new user to the Atlas DB",  () => {
//     return request(app)
//       .post(`/api/users`)
//       .send({
//         username: "the-ali2",
//         name: "ali",
//       })
//       .expect(201)

//       .then((res) => {
//         expect(res.body).toMatchObject({
//           username: "the-ali",
//           name: "ali",
//           password: "password",
//         });
//       });
//   });
// });

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    // await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    // const user = new User({ username: "root", passwordHash });

    // await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    // const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "Hermione10",
      name: "Daniel",
      password: "cats",
    };

    return await request(app)
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    // .then(() => {

    //   const usersAtEnd = await helper.usersInDb();
    //   expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    //   const usernames = usersAtEnd.map((u) => u.username);
    //   expect(usernames).toContain(newUser.username);
    // })
  });
});


