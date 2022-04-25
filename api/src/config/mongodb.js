require("dotenv").config();
const DB_URL = process.env.MONGO_DB_URL;

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = DB_URL;

module.exports = db;