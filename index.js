const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
// set envirment varibles
dotenv.config({ path: "./config.env" });

const app = require("./app");
console.log("LinkDB :",process.env.DB_LINK);
mongoose
  .connect(process.env.DB_LINK, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((res) => console.log("Contected to DB......."))
  .catch((err) => {
    console.log("err :",err);
    console.log("Not conntected to DB..!!!!!!!!!");
  });

let server = app.listen(process.env.PORT, () =>
  console.log(`Server running at ${process.env.PORT}.....`)
);

process.on("unhandledRejection", (err) => {
  console.log("unhandledRejection: Server sutting down");
  console.log(err.name, err.message);
  console.log(err);
  server.close(() => process.exit(0));
});

process.on("uncaughtException", (err) => {
  console.log("uncaughtException: Server sutting down");
  console.log(err.name, err.message);
  console.log(err);
  server.close(() => process.exit(0));
});

