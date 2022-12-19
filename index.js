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
  Item.findById(request.params.id)
    .then((item) => {
      if (item) {
        response.json(item);
      } else {
        response.status(404).send({ msg: "Not Found" });
      }
    })
    .catch((err) => {
      console.log(err);
      response.status(500).send({ msg: "Internal Server Error" });
    });
});

app.delete("/api/items/:id", (request, response) => {
  Item.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).send({ msg: "Item Deleted" });
    })
    .catch((err) => {
      console.log(err);
      response.status(404).send({ msg: "Item not found" });
    });
});

app.post("/api/items", (request, response) => {
  // const maxId = items.length > 0 ? Math.max(...items.map((i) => i.id)) : 0;

  const body = request.body;

  if (
    !body.name ||
    !body.category ||
    !body.description ||
    !body.image ||
    !body.tippingDate
  ) {
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

app.patch("/api/items/:id", (request, response) => {
  const body = request.body;

  const item = {
    name: body.name,
    category: body.category,
    description: body.description,
    image: body.image,
    tippingDate: body.tippingDate,
  };
  Item.findByIdAndUpdate(request.params.id, item, { new: true })
    .then((updatedItem) => {
      response.json(updatedItem);
    })
    .catch((err) => {
      response.status(500).send({ msg: "Internal Server Error" });
    });
});
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
