const { request } = require("../app");
const items = require("../models/items");
const itemSchema = require("../models/items");
const User = require("../models/user");
const userSchema = require("../models/user");
const jwt = require("jsonwebtoken");

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

const getAllItems = async (request, response) => {
  const handleQuery = (query) => {
    try {
      const toJSONString = ("{" + query + "}").replace(
        /(\w+:)|(\w+ :)/g,
        (matched) => {
          return '"' + matched.substring(0, matched.length - 1) + '":';
        }
      );
      return JSON.parse(toJSONString);
    } catch (err) {
      return JSON.parse("{}");
    }
  };

  const sort = handleQuery(request.query.sort);
  const items = await itemSchema
    .find({ ...request.query })
    .sort(sort)
    .populate("user", { username: 1 });
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

const postItems = async (request, response) => {
  const body = request.body;
  const token = getTokenFrom(request);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }
  const user = await User.findById(decodedToken.id);

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
  // const user = userSchema.findById(body.userId);

  const item = new itemSchema({
    name: body.name,
    category: body.category,
    description: body.description,
    createdAt: new Date(),
    image: body.image,
    tippingDate: body.tippingDate,
    user: user._id,
  });

  const savedItem = await item.save();
  user.items = user.items.concat(savedItem._id);
  await user.save();

  response.json(savedItem);

  // item.save().then((savedItem) => {
  //   response.status(201);
  //   response.json(savedItem);
  // });
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

// const filterByCategory = async (req, res, next) => {
//   const category = req.query.category;
//   const items = await itemSchema.aggregate([
//     {
//       $match: {
//         category: req.query.category,
//       },
//     },
//   ]);
//   res.send(items);
// };

module.exports = {
  // filterByCategory,
  getAllItems,
  deleteItemById,
  getItemsById,
  postItems,
  updateItems,
};
