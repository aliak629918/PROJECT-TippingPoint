const itemSchema = require("../models/items");

const getAllItems = (request, response) => {
  itemSchema.find({}).then((items) => {
    response.json(items);
  });
};

const getItemsById = (request, response) => {
  itemSchema
    .findById(request.params.id)
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
};

const deleteItemById = (request, response) => {
  itemSchema
    .findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).send({ msg: "Item Deleted" });
    })
    .catch((err) => {
      console.log(err);
      response.status(404).send({ msg: "Item not found" });
    });
};

const postItems = (request, response) => {
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
  const item = new itemSchema({
    name: body.name,
    category: body.category,
    description: body.description,
    createdAt: new Date(),
    image: body.image,
    tippingDate: body.tippingDate,
  });
  item.save().then((savedItem) => {
    response.status(201);
    response.json(savedItem);
  });
};

const updateItems = (request, response) => {
  const body = request.body;

  const item = {
    name: body.name,
    category: body.category,
    description: body.description,
    image: body.image,
    tippingDate: body.tippingDate,
  };
  itemSchema
    .findByIdAndUpdate(request.params.id, item, { new: true })
    .then((updatedItem) => {
      response.json(updatedItem);
    })
    .catch((err) => {
      response.status(500).send({ msg: "Internal Server Error" });
    });
};

module.exports = {
  getAllItems,
  deleteItemById,
  getItemsById,
  postItems,
  updateItems,
};
