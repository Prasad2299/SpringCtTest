const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/assignment")
  .then(() => {
    console.log("connected successfully");
  })
  .catch(() => {
    console.log("no connection!");
  });
