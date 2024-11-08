const mongoose = require("mongoose");
const { DB_URL } = require('../configurations/config');

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log('Connected to db successfully!');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
