const config = require("../config/config.js");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const db = {};
db.mongoose = mongoose;
db.url = config.DATABASE_URI;
db.Plots = require("./plot.model.js")(mongoose);
module.exports = db;
