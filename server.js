const mongoose = require("mongoose");
const app = require("./app");
const url = process.env.MONGODB_URI;
require("dotenv").config();

console.log("connecting to", url);

mongoose
  .connect('mongodb+srv://runtimeterror:runtimeterror@cluster0.r5rsumc.mongodb.net/?retryWrites=true&w=majority')
  .then((result) => {
    console.log("connected to MongoDB");
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });
