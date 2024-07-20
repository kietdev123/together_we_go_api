const mongoose = require("mongoose");

const { MONGODB_URI } = process.env;

exports.connect = () => {
  // Connecting to the database
  mongoose
    .connect('mongodb+srv://vercel-admin-user:xz3IckPXwH3uyR2t@cluster0.ynhdj.mongodb.net/test', {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
    })
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    });
};