const mongoose = require('mongoose');
const env = require('./env.config');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI);
    console.log("DB Connected");
  } catch (error) {
    console.error("Error connecting to DB");
    process.exit(1);
  }
};

module.exports = connectDB;
