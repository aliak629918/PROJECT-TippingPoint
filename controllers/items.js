const itemSchema = require("../models/items");
const userSchema = require("../models/user");

const getAllItems = async (request, response) => {
  const handleQuerySort = (query) => {
    try{
      const toJSONString = ("{" + query + "}").replace(/(\w+:)|(\w+ :)/g, (matched => {
          return '"' + matched.substring(0, matched.length - 1) + '":';
      }));
  
      return JSON.parse(toJSONString);

    }catch(err){
      return JSON.parse("{}"); 
    }
  }
  if (handleQuerySort(request.query.sort) === {}) {
    const sort = {createdAt: -1}
  } const sort = handleQuerySort(request.query.sort)
  const items = await itemSchema.find().sort(sort);
    response.json(items);
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
const user = userSchema.findById(body.userId)

  const item = new itemSchema({
    name: body.name,
    category: body.category,
    description: body.description,
    createdAt: new Date(),
    image: body.image,
    tippingDate: body.tippingDate,
    user: user._id,
  });
  item.save().then((savedItem) => {
    
  
    response.status(201);
    response.json(savedItem);
});
}

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
