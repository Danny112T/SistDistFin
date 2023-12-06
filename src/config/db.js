const mongoose = require("mongoose");
require("dotenv").config();

const uriLocal = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

mongoose.connect(uriLocal);
const db = mongoose.connection;

module.exports = mongoose;