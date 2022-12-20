const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

const {
  getAllItems,
  deleteItemById,
  getItemsById,
  postItems,
  updateItems,
} = require("./controllers/items");

const {postUsers} = require("./controllers/users")

app.post("/api/users" , postUsers)

app.get("/api/items", getAllItems);

app.get("/api/items/:id", getItemsById);

app.delete("/api/items/:id", deleteItemById);

app.post("/api/items", postItems);

app.patch("/api/items/:id", updateItems);

module.exports = app;
