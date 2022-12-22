// const mongoose = require("mongoose");
// if (process.argv.length < 3) {
//   console.log(
//     "Please provide the password as an argument: node mongo.js <password>"
//   );
//   process.exit(1);
// }
// const password = process.argv[2];
// // const url = `mongodb+srv://notes-app-full:${password}@cluster1.lvvbt.mongodb.net/;`;
// const uri = `mongodb+srv://runtimeterror:runtimeterror@cluster0.r5rsumc.mongodb.net/?retryWrites=true&w=majority`;
// const itemSchema = new mongoose.Schema({
//   content: String,
//   date: Date,
//   important: Boolean,
// });

// const Item = mongoose.model("Item", itemSchema);
// mongoose.connect(uri).then((result) => {
//   console.log("connected");
//   // const item = new Item({
//   //   content: "Mongo is very hard",
//   //   date: new Date(),
//   //   important: true,
//   // });
//   // return item.save();
//   Item.find({ content: "Tipping Point" })
//     .then((result) => {
//       result.forEach((item) => {
//         console.log(item);
//       });
//       return mongoose.connection.close();
//     })
//     // .then(() => {
//     //   console.log("item saved!");

//     // })
//     .catch((err) => console.log(err));
// });
