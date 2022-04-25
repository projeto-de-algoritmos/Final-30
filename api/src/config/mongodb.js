require("dotenv").config();
const DB_URL = 'mongodb://mongo-db:27017/final-db?authSource=admin';

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = DB_URL;

module.exports = db;