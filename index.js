require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const Item = require("./models/items");
// const mongoose = require("mongoose");

// const url = `mongodb+srv://runtimeterror:runtimeterror@cluster0.r5rsumc.mongodb.net/?retryWrites=true&w=majority`;

app.use(cors());
app.use(express.json());

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/items", (request, response) => {
  Item.find({}).then((items) => {
    response.json(items);
  });
});

app.get("/api/items/:id", (request, response) => {
  Item.findById(request.params.id).then((item) => {
    response.json(item);
  });
  // const id = Number(request.params.id);
  // const item = items.find((item) => item.id === id);
  // if (item) {
  //   response.json(item);
  // } else {
  //   response.status(404).send({ msg: "Not Found" });
  // }
});

app.delete("/api/items/:id", (request, response) => {
  const id = Number(request.params.id);
  items = items.filter((item) => item.id !== id);

  response.status(204).send({ msg: "Item Deleted" });
});

app.post("/api/items", (request, response) => {
  // const maxId = items.length > 0 ? Math.max(...items.map((i) => i.id)) : 0;

  const body = request.body;

  if (!body.name || !body.category) {
    return response.status(400).json({
      error: "parameters missing",
    });
  }
  const item = new Item({
    name: body.name,
    category: body.category,
    description: body.description,
    createdAt: new Date(),
    image: body.image,
    tippingDate: body.tippingDate,
  });
  item.save().then((savedItem) => {
    response.json(savedItem);
  });
});
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
