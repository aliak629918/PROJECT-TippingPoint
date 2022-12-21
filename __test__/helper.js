const Item = require("../models/items");
const User = require("../models/user");

const initialItems = [
  {
    content: "HTML is easy",
    date: new Date(),
    important: false,
  },
  {
    content: "Browser can execute only Javascript",
    date: new Date(),
    important: true,
  },
];

const nonExistingId = async () => {
  const item = new Item({ content: "willremovethissoon", date: new Date() });
  await item.save();
  await item.remove();

  return item._id.toString();
};

const itemsInDb = async () => {
  const items = await Item.find({});
  return items.map((item) => item.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  initialItems,
  nonExistingId,
  itemsInDb,
  usersInDb,
};
