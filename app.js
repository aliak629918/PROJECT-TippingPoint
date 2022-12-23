const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

app.use(express.json());
app.use(requestLogger);

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
const { postUsers, getUsers } = require("./controllers/users");
const postLogin = require("./controllers/login");

app.post("/api/users", postUsers);
app.get("/api/users", getUsers);
app.use("/api/login", postLogin);

app.get("/api/items", getAllItems);

app.get("/api/items/:id", getItemsById);

app.delete("/api/items/:id", deleteItemById);

app.post("/api/items", postItems);

app.patch("/api/items/:id", updateItems);

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  if (error.name === "CastError") {
    return response.status(400).send({
      error: "malformatted id",
    });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({
      error: error.message,
    });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({
      error: "invalid token",
    });
  } else if (error.name === "TokenExpiredError") {
    return response.status(401).json({
      error: "token expired",
    });
  }
  next(error);
};

app.use(unknownEndpoint);

module.exports = app;
