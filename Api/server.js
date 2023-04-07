const express = require("express");
const cors = require("cors");
const app = express();

const config = require("./config/config.js");

// var corsOptions = {
//   origin: "http://127.0.0.1:5500"
// };


//app.use(cors(corsOptions));
app.use(cors()); 
// parse request of content-type - application/json
app.use(express.json());
// parse request of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({extended:true}));

//db connection
const db = require("./models");
db.mongoose.set('strictQuery', false);
db.mongoose.connect(
  db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
).then(() => {
  console.log("Database connection OK");
}).catch(err => {
  console.log("Database connection error");
  process.exit();
});

require("./routes/plot.routes")(app);
require("./routes/web3.routes")(app);

//set portlisten for request
app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
})
