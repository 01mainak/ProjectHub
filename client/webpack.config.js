const mongoose = require("mongoose");

module.exports = () => {
  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  try {
    mongoose.connect(process.env.DB, connectionParams);
    console.log("connected to the database successfully");
  } catch (error) {
    console.log(error);
    console.log("could not connect to the database");
  }
};
